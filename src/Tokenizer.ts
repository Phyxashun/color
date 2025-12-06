const __DEBUG__ = true;

import { Colors, ConsoleColors, CSSColors } from './Colors.ts';
import Print from './Print.ts';

const TokenType = {
    FUNCTION: 'FUNCTION',          // 'rgba', 'rgb', 'hsl', etc.
    IDENTIFIER: 'IDENTIFIER',      // Any word/letter not already captured 
    HEXSTRING: 'HEXSTRING',        // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER: 'NUMBER',              // '127', '120', '80'
    PERCENTAGE: 'PERCENTAGE',      // '80%'
    COMMA: 'COMMA',                // ',' (for older syntax)
    SLASH: 'SLASH',                // '/' (for modern syntax)
    OPEN_PAREN: 'OPEN_PAREN',      // '('
    CLOSE_PAREN: 'CLOSE_PAREN',    // ')'
    DELIMITER: 'DELIMITER',        // Any delimiter not already captured
    WHITESPACE: 'WHITESPACE',      // ' '
    CHAR: 'CHAR',                  // Any single character not already captured
    EOL: 'EOL'                     // End of line/string
} as const;

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
    { type: TokenType.HEXSTRING, regex: /^#([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})+$/i },
    { type: TokenType.PERCENTAGE, regex: /^-?\d*\.?\d+%/i },
    { type: TokenType.NUMBER, regex: /^-?\d*\.?\d+(deg|grad|rad|turn)+\b|^-?\d*\.?\d+/i },
    { type: TokenType.FUNCTION, regex: /^(rgba?|hsla?|hwba?|lab|lch|oklab|oklch)+\b/i }, ///^[a-zA-Z]+\b/ },
    { type: TokenType.IDENTIFIER, regex: /^(black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|[a-zA-Z0-9])+\b/i },
    { type: TokenType.COMMA, regex: /^,/i },
    { type: TokenType.SLASH, regex: /^\//i },
    { type: TokenType.OPEN_PAREN, regex: /^\(/i },
    { type: TokenType.CLOSE_PAREN, regex: /^\)/i },
    { type: TokenType.DELIMITER, regex: /[\(\),\/]/i, }
] as const;

export default class Tokenizer {
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
        Print('1. Tokenizer - Constructor()');
        const [sourceString] = [...args];
        this.source = this.validateSource(sourceString);
        Print('1.A. Constructor Args:', this.source);

        this.tokens = this.tokenize();
        this.AST = this.createAST(this.tokens!);

        if (__DEBUG__) console.log('\n')
        if (__DEBUG__) Print.log();
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

    private isValidKey(key: string, obj: object): key is keyof typeof obj {
        return key in obj;
    }

    //
    // 2. Tokenize()
    //
    private tokenize(): Token[] | null {
        Print('2. Tokenizer - tokenize()');

        let tokens: Token[] = [];

        while (!this.isEOL) {
            let matched = false;

            for (const matcher of tokenMatchers) {
                const match = this.source.substring(this.currentPosition).match(matcher.regex);
                if (match) {
                    // Skip whitespace tokens in the final list for the parser
                    if (matcher.type !== TokenType.WHITESPACE) {
                        const matchedToken = { type: matcher.type, value: match[0] };
                        tokens.push(matchedToken);
                    }
                    this.currentPosition += match[0].length;
                    matched = true;
                    break;
                }

            }
            if (!matched) {
                const p = this.currentPosition;
                console.error(`${ConsoleColors.red}ERROR:${ConsoleColors.reset} Tokenizer.tokenize(): Unexpected character at ${ConsoleColors.blue}position ${p}: ${this.source[p]}${ConsoleColors.reset}`);
                Print('2.B. Tokenizer - tokens:', 'null');
                return null;
            }
        }

        tokens.push({ type: TokenType.EOL, value: '' });
        for (const token of tokens) {
            Print('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }

    //
    // 3. CreateAST()
    //
    private createAST(tokens: Token[]): ASTNode | null {
        Print('3. Tokenizer - createAST()');
        if (tokens === null) return null;

        console.log("3. Tokenizer - this.currentPosition:", this.currentPosition);

        let current = 0; // Current token index

        // Helper to get the current token
        const walk = (): ASTNode | null => {
            let token = tokens[current];
            if (!token) return null;

            // --- RULE: Handle Hex Strings (Hexadecimal Colors) ---
            if (token.type === TokenType.HEXSTRING) {
                current++; // Consume the hex string token
                return {
                    type: 'hexstring', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // --- RULE: Handle Identifiers (Named Colors) ---
            if (token.type === TokenType.IDENTIFIER) {
                current++; // Consume the hex string token
                if (this.isValidKey(token.value, CSSColors)) {
                    return {
                        type: 'identifier', // Matches our previous AST type name
                        value: CSSColors[token.value],
                        //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                    };
                } else if (this.isValidKey(token.value, Colors)) {
                    return {
                        type: 'identifier', // Matches our previous AST type name
                        value: Colors[token.value],
                        //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                    };
                }
                return null;
            }

            // --- RULE: Handle a Function Call (e.g., rgba(...)) ---
            if (token.type === TokenType.FUNCTION) {
                current++; // Consume the function name token

                // Expect a left parenthesis next
                if (tokens[current].type !== TokenType.OPEN_PAREN) {
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
                while (tokens[current] && tokens[current].type !== TokenType.CLOSE_PAREN) {
                    // We call walk() recursively to parse the *next* meaningful token inside the function
                    const childNode = walk();
                    if (childNode) {
                        functionNode.nodes!.push(childNode);
                    }
                }

                // Expect and consume the right parenthesis
                if (tokens[current].type !== TokenType.CLOSE_PAREN) {
                    throw new Error('Expected ) after function arguments');
                }
                current++; // Consume the ')' token

                return functionNode;
            }

            // --- RULE: Handle Numbers (Arguments) ---
            if (token.type === TokenType.NUMBER) {
                current++; // Consume the number token
                return {
                    type: 'numeric', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // --- RULE: Handle Percentages (%) ---
            if (token.type === TokenType.PERCENTAGE) {
                current++; // Consume the number token
                const percent = token.value.slice(0, -1);
                return {
                    type: 'percentage', // Matches our previous AST type name
                    value: percent,
                    unit: "%", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // --- RULE: Handle Operators (Commas) ---
            if (token.type === TokenType.COMMA) {
                current++; // Consume the comma token
                return {
                    type: 'operator',
                    value: ',',
                };
            }

            // --- RULE: Handle Operators (Forward Slashes) ---
            if (token.type === TokenType.SLASH) {
                current++; // Consume the comma token
                return {
                    type: 'operator',
                    value: '/',
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
        console.log('3.A. Tokenizer - ast', ast);
        return ast;
    }

} // End of class Tokenizer //*/