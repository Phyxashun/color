const __DEBUG__ = true;

import { CC } from '../src/Colors.ts';

enum TokenType {
    FUNCTION = 'FUNCTION',          // 'rgba', 'rgb', 'hsl', etc.
    IDENTIFIER = 'IDENTIFIER',      // Any word/letter not already captured 
    HEXSTRING = 'HEXSTRING',        // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER = 'NUMBER',              // '127', '120', '80'
    PERCENTAGE = 'PERCENTAGE',      // '80%'
    COMMA = 'COMMA',                // ',' (for older syntax)
    SLASH = 'SLASH',                // '/' (for modern syntax)
    OPEN_PAREN = 'OPEN_PAREN',      // '('
    CLOSE_PAREN = 'CLOSE_PAREN',    // ')'
    DELIMITER = 'DELIMITER',        // Any delimiter not already captured
    WHITESPACE = 'WHITESPACE',      // ' '
    CHAR = 'CHAR',                  // Any single character not already captured
    EOL = 'EOL'                     // End of line/string
}

/* Regular Expressions */
/*
const RX = {
    ALPHA: /[a-zA-Z]+/i,
    NUMBER: /[\d]/i,
    HASH: /[#]/i,
    EXPONENT: /e/i,
    KEYWORD: /^(#|rgba?|hsla?|hwba?|lab|lch|oklab|oklch)+\b/i,
    IDENTIFIER: /(deg|grad|rad|turn)/i,
    OPERATOR: /[%.\-]/i,
    DELIMITER: /[\(\),\/]/i,
    INTEGER: /[-+]?\d+/i,
    FLOAT: /[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/i,
    DOUBLEQUOTE: /"(?:[^"\\]|\\.)*"/i,
    SINGLEQUOTE: /'(?:[^'\\]|\\.)*'/i,
    BOOLEAN: /\b(true|false)\b/i,
    WHITESPACE: /\s+/i,
    COMMENTS: /\/\*[^]*?\*\/|\/\/[^\n]+/i,
    EOL: /\n|$/i,
    ANSICOLORS = /\x1b\[[0-9;]*m/g;
} as const; //*/

const tokenMatchers = [
    { type: TokenType.WHITESPACE, regex: /^\s+/i },
    { type: TokenType.FUNCTION, regex: /^(rgba?|hsla?|hwba?|lab|lch|oklab|oklch)+\b/i }, ///^[a-zA-Z]+\b/ },
    { type: TokenType.PERCENTAGE, regex: /^-?\d*\.?\d+%/i },
    { type: TokenType.NUMBER, regex: /^-?\d*\.?\d+/i },
    { type: TokenType.HEXSTRING, regex: /^#([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})+$/i },
    { type: TokenType.COMMA, regex: /^,/i },
    { type: TokenType.SLASH, regex: /^\//i },
    { type: TokenType.OPEN_PAREN, regex: /^\(/i },
    { type: TokenType.CLOSE_PAREN, regex: /^\)/i },
] as const;

export default class Tokenizer {
    private readonly data: any[] = [];
    //private readonly source: string = '';
    source: string = '';
    private currentPosition: number = 0;
    tokens: Token[] | null;
    AST: ASTNode | null;

    //
    // 1. TOKENIZER CONSTRUCTOR()
    // 1.A. Constructor Args
    //
    constructor(...args: any[]) {
        this.print('1. Tokenizer - Constructor()');
        const [sourceString] = [...args];
        this.source = this.validateSource(sourceString);
        this.print('1.A. Constructor Args:', this.source);

        this.tokens = this.tokenize();
        this.AST = this.createAST(this.tokens!);

        if (__DEBUG__) console.log('\n')
        if (__DEBUG__) console.table(this.data);
    }

    private print(m?: string, v1?: any, v2?: any): void {
        if (!v1 && !v2) {
            this.data.push({
                Message: m
            });
        } else if (v1 !== null && typeof v1 === 'object' && !v2) {
            this.data.push({
                Message: m,
                Value1: JSON.stringify(v1)
            });
        } else if (v1 !== null && typeof v1 === 'object' &&
            v2 !== null && typeof v2 === 'object') {
            this.data.push({
                Message: m,
                Value1: JSON.stringify(v1),
                Value2: JSON.stringify(v2)
            });
        } else if (!v2) {
            this.data.push({
                Message: m,
                Value1: v1
            });
        } else {
            this.data.push({
                Message: m,
                Value1: v1,
                Value2: v2
            });
        }
    }

    private validateSource(...args: any) {
        const [result] = [...args];
        if (typeof result !== 'string')
            throw new Error('Tokenizer validateSource(): Class expects a string...');
        return result;
    }

    private get isEOL(): boolean {
        return this.currentPosition >= this.source.length;
    }

    //
    // 2. Tokenize()
    //
    private tokenize(): Token[] | null {
        this.print('2. Tokenizer - tokenize()');

        let tokens: Token[] = [];

        while (!this.isEOL) {
            let matched = false;
            for (const matcher of tokenMatchers) {
                const match = this.source.substring(this.currentPosition).match(matcher.regex);
                if (match) {
                    // Skip whitespace tokens in the final list for the parser
                    //if (matcher.type !== TokenType.WHITESPACE) {
                    const matchedToken = { type: matcher.type, value: match[0] };
                    tokens.push(matchedToken);
                    //}
                    this.currentPosition += match[0].length;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                const p = this.currentPosition;
                console.error(`${CC.red}ERROR:${CC.reset} Tokenizer.tokenize(): Unexpected character at ${CC.blue}position ${p}: ${this.source[p]}${CC.reset}`);
                this.print('2.B. Tokenizer - tokens:', 'null');
                return null;
            }
        }

        tokens.push({ type: TokenType.EOL, value: '' });
        for (const token of tokens) {
            this.print('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }

    //
    // 3. CreateAST()
    //
    private createAST(tokens: Token[]): ASTNode | null {
        this.print('3. Tokenizer - createAST()');
        if (tokens === null) return null;

        let current = 0; // Current token index

        // Helper to get the current token
        function walk(): ASTNode | null {

            let token = tokens[current];

            if (!token) return null;

            // --- RULE 1: Handle a Function Call (e.g., rgba(...)) ---
            if (token.type === 'FUNCTION') {
                current++; // Consume the function name token

                // Expect a left parenthesis next
                if (tokens[current].type !== 'OPEN_PAREN') {
                    throw new Error('Expected ( after function name');
                }
                current++; // Consume the '(' token

                // Create the main Function Node
                const functionNode: ASTNode = {
                    type: 'function',
                    value: token.value, // "rgba"
                    nodes: [],          // We will push arguments/operators here
                };

                // Loop through arguments/operators until we hit the closing ')'
                while (tokens[current] && tokens[current].type !== 'CLOSE_PAREN') {
                    // We call walk() recursively to parse the *next* meaningful token inside the function
                    const childNode = walk();
                    if (childNode) {
                        functionNode.nodes!.push(childNode);
                    }
                }

                // Expect and consume the right parenthesis
                if (tokens[current].type !== 'CLOSE_PAREN') {
                    throw new Error('Expected ) after function arguments');
                }
                current++; // Consume the ')' token

                return functionNode;
            }

            // --- RULE 2: Handle Numbers (Arguments) ---
            if (token.type === 'NUMBER') {
                current++; // Consume the number token
                return {
                    type: 'numeric', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // --- RULE 3: Handle Operators (Commas) ---
            if (token.type === 'COMMA') {
                current++; // Consume the comma token
                return {
                    type: 'operator',
                    value: ',',
                };
            }

            // --- RULE 4: Handle Hex Strings (Arguments) ---
            if (token.type === 'HEXSTRING') {
                current++; // Consume the hex string token
                return {
                    type: 'hexstring', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // If we hit an unexpected token, something is wrong with the input or grammar
            throw new Error('Unknown token type: ' + token.type);
        }

        // Start the parsing process. We only expect one top-level function call here.
        const ast = walk();

        // Basic validation that we processed all tokens
        if (current !== tokens.length) {
            // In a real-world scenario, you might have whitespace tokens that are ignored
            console.warn("Parser finished early or has leftover tokens.");
        }
        this.print('3.A. Tokenizer - ast', ast);
        return ast;
    }

} // End of class Tokenizer //*/