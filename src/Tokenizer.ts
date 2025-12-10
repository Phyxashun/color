/// <reference types='./types/Tokenizer.d.ts' />

import Print from './Print.ts';

export const TokenType: TokenType = {
    FUNCTION: 'FUNCTION',           // 'rgba', 'rgb', 'hsl', etc.
    IDENTIFIER: 'IDENTIFIER',       // Any word/letter not already captured 
    HASH: 'HASH',                   // '#'
    HEXVALUE: 'HEXVALUE',           // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER: 'NUMBER',               // '127', '120', '80'
    PERCENT: 'PERCENT',             // '80%'
    UNITS: 'UNITS',                 // 'deg', 'rad', 'grad', 'turn'
    COMMA: 'COMMA',                 // ',' (for older syntax)
    SLASH: 'SLASH',                 // '/' (for modern syntax)
    LPAREN: 'LPAREN',               // '('
    RPAREN: 'RPAREN',               // ')'
    DELIMITER: 'DELIMITER',         // Any delimiter not already captured
    WHITESPACE: 'WHITESPACE',       // ' '
    CHAR: 'CHAR',                   // Any single character not already captured
    EOF: 'EOF'                      // End of line/string
} as const;

export const TokenSpec: TokenSpec = [
    // Whitespace (to be ignored)
    [TokenType.WHITESPACE, /^\s+/],

    // Specific function names
    [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)\b/i],

    // Punctuation
    [TokenType.LPAREN, /^\(/],
    [TokenType.RPAREN, /^\)/],
    [TokenType.COMMA, /^,/],
    [TokenType.SLASH, /^\//],

    // Hash symbol for hex colors
    [TokenType.HASH, /^#/],

    // Units must come before IDENTIFIER
    [TokenType.UNITS, /^(deg|grad|rad|turn)\b/i],

    // Percentage must come before NUMBER
    [TokenType.PERCENT, /^-?\d*\.?\d+%/],

    // Number must come before IDENTIFIER
    [TokenType.NUMBER, /^-?\d*\.?\d+/],

    // Hex values (3, 4, 6, or 8 chars). Must come before IDENTIFIER.
    // The \b ensures it doesn't match the start of a longer word.
    [TokenType.HEXVALUE, /^([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b/i],

    // Generic identifiers for color spaces like 'display-p3'
    [TokenType.IDENTIFIER, /^[a-z][a-z\d-]*/i],
] as const;

export default class Tokenizer {
    private readonly source: string = '';
    tokens: Token[] = [];
    private tokenIndex: number = 0;

    constructor(string: string) {
        Print.add('1. Tokenizer - Constructor()');

        if (typeof string !== 'string') {
            throw new Error('Tokenizer validateSource(): Class expects a string...');
        }
        this.source = string;

        Print.add('1.A. Constructor Args:', this.source);

        this.tokens = this._tokenize();
        Print();
    }

    /**
     * Returns the current token without consuming it.
     */
    public current(): Token {
        return this.tokens[this.tokenIndex];
    }

    /**
     * Consumes the current token and advances the cursor.
     * @returns The consumed token.
     */
    public consume(): Token {
        const token = this.current();
        this.tokenIndex++;
        return token;
    }

    /**
     * Peeks at a future token without consuming the current one.
     * @param offset How many tokens to look ahead (default is 1, the very next token).
     * @returns The future token, or the EOF token if out of bounds.
     */
    public lookahead(offset: number = 1): Token {
        const index = this.tokenIndex + offset;
        if (index >= this.tokens.length) {
            // Return the EOF token if looking past the end.
            return this.tokens[this.tokens.length - 1];
        }
        return this.tokens[index];
    }

    /**
     * Looks at a previously consumed token.
     * @param offset How many tokens to look behind (default is 1, the immediate previous token).
     * @returns The previous token, or null if the offset is invalid.
     */
    public lookbehind(offset: number = 1): Token | null {
        const index = this.tokenIndex - offset;
        if (index < 0) {
            return null;
        }
        return this.tokens[index];
    }

    // This internal method contains the tokenization logic
    private _tokenize(): Token[] {
        Print.add('2. Tokenizer - tokenize()');

        const tokens: Token[] = [];
        let cursor = 0;

        while (cursor < this.source.length) {
            const remaining = this.source.substring(cursor);
            let matched: boolean = false;

            for (const [tokenType, regexp] of TokenSpec) {
                const match = remaining.match(regexp);

                if (match) {
                    // Identifiers are invalid tokens, throw
                    if (tokenType === TokenType.IDENTIFIER) {
                        const errorMsg = `Tokenizer._tokenize(): Unexpected character: ${this.source[cursor]}, at position: ${cursor}.`;
                        throw new SyntaxError(errorMsg);
                    }
                    // Skip whitespace tokens in the final list for the parser
                    if (tokenType !== TokenType.WHITESPACE) {
                        tokens.push({ type: tokenType, value: match[0] });
                    }
                    cursor += match[0].length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                const errorMsg = `Tokenizer._tokenize(): Unexpected character: ${this.source[cursor]}, at position: ${cursor}.`;
                throw new SyntaxError(errorMsg);
            }
        }

        tokens.push({ type: TokenType.EOF, value: 'EOF' });

        for (const token of tokens) {
            Print.add('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }
} // End of class Tokenizer