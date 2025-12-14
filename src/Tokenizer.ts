/// <reference types='./types/Tokenizer.d.ts' />
// /src/Tokenizer.ts

import { Colors } from './Colors.ts';
import { Print } from './utils/Print.ts';

Print.off();

export const Keywords = {
    'display-p3': 'display-p3',
    none: 'none',
    initial: 'initial',
    unset: 'unset'
} as const;

export enum TokenType {
    FUNCTION = 'FUNCTION',           // 'rgba', 'rgb', 'hsl', etc.
    KEYWORD = 'KEYWORD',             // For specific keywords like 'display-p3'
    NAMEDCOLOR = 'NAMEDCOLOR',       // For CSS named colors like 'red', 'transparent'
    IDENTIFIER = 'IDENTIFIER',       // Any word/letter not already captured 
    HEXVALUE = 'HEXVALUE',           // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER = 'NUMBER',               // '127', '120', '80'
    PERCENT = 'PERCENT',             // '80%'
    ANGLE = 'ANGLE',                 // 'deg', 'rad', 'grad', 'turn'
    COMMA = 'COMMA',                 // ',' (for older syntax)
    SLASH = 'SLASH',                 // '/' (for modern syntax)
    LPAREN = 'LPAREN',               // '('
    RPAREN = 'RPAREN',               // ')'
    DELIMITER = 'DELIMITER',         // Any delimiter/general punctuation not already captured
    WHITESPACE = 'WHITESPACE',       // All other whitespace
    CHAR = 'CHAR',                   // Fallback for any unexpected character
    EOF = 'EOF'                      // End of line/string
}

// Helper function to create the dynamic TokenSpec
const createTokenSpec = (): TokenSpec => {
    // Generate a dynamic regex for all named colors.
    // This is far more efficient than looping through an object later.
    const colorNames = Object.keys(Colors);
    const namedColorRegexStr = `^(${colorNames.join('|')})\\b`;

    const keywords = Object.keys(Keywords);
    const keywordRegexStr = `^(${keywords.join('|')})\\b`;
    const keywordRegex = new RegExp(namedColorRegexStr + '|' + keywordRegexStr, 'i');

    return [
        // Whitespace (to be ignored)
        [TokenType.WHITESPACE, /^\s+/],

        // Named colors (must come before IDENTIFIER)
        //[TokenType.NAMEDCOLOR, namedColorRegex],

        // Keywords (must come before IDENTIFIER)
        [TokenType.KEYWORD, keywordRegex],

        // Specific function names
        [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)\b/i],

        // Punctuation
        [TokenType.LPAREN, /^\(/],
        [TokenType.RPAREN, /^\)/],
        [TokenType.COMMA, /^,/],
        [TokenType.SLASH, /^\//],

        // Units (must come before IDENTIFIER)
        [TokenType.ANGLE, /^(deg|grad|rad|turn)\b/i],

        // Percentage (must come before NUMBER)
        [TokenType.PERCENT, /^-?\d*\.?\d+%/],

        // Number (must come before IDENTIFIER)
        [TokenType.NUMBER, /^-?\d*\.?\d+(e[+-]?\d+)?/i],

        // Hex value (must come before IDENTIFIER)
        [TokenType.HEXVALUE, /^#([a-f\d]{8}|[a-f\d]{6}|[a-f\d]{4}|[a-f\d]{3})\b/i],

        // Generic identifiers for color spaces like 'display-p3' or CSS variables
        [TokenType.IDENTIFIER, /^[-\w][a-z_][a-z\d_-]*/i],

        // Fallback to catch any character not matched. This indicates an error.
        [TokenType.DELIMITER, /\=[;\-]+/],

        // Fallback to catch any character not matched. This indicates an error.
        [TokenType.CHAR, /^./],
    ] as const;
};

// Create the token specification
export const TokenSpec: TokenSpec = createTokenSpec();
export const EOF_TOKEN: Token = { type: TokenType.EOF, value: '<end>' };

export default class Tokenizer {
    private readonly source: string = '';
    tokens: Token[] = [];
    private tokenIndex: number = 0; // Current position in the `tokens` array
    private cursor: number = 0; // Current position in the `source` string

    constructor(string: string) {
        Print.add('1. Tokenizer - Constructor()');

        if (typeof string !== 'string') {
            throw new Error('Tokenizer constructor: Class expects a string input.');
        }

        // Remove unnecessary whitespace and convert to lowercase for case-insensitivity
        this.source = string.replace(/(\s+|\r\n|\n|\r)/gm, " ").trim().toLowerCase();
        Print.add('1.A. Constructor Args:', this.source);

        this.tokens = this._tokenize();
        Print();
    }

    /**
     * @returns The current token without consuming it.
     */
    public current(): Token {
        if (this.tokenIndex >= this.tokens.length) {
            return EOF_TOKEN;
        }
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

    /**
     * Makes the tokenizer iterable over its tokens.
     * Usage: for (const token of tokenizer) { ... }
     */
    public *[Symbol.iterator](): Iterator<Token> {
        for (const token of this.tokens) {
            yield token;
        }
    }

    /**
     * Returns a formatted string representation of all tokens.
     * @returns String in format "Token: [token1, token2, ...]"
     */
    public toString(): string {
        return this.tokens
            .map(token => `Token ${JSON.stringify(token)}`)
            .join('\n');
    }


    // Returns true if the cursor is at the end of source.
    private isEOF() {
        return this.cursor >= this.source.length;
    }

    private _tokenize(): Token[] {
        Print.add('2. Tokenizer - tokenize()');
        const tokens: Token[] = [];
        this.cursor = 0;

        while (!this.isEOF()) {
            let matched = false;

            // Get the remaining string from the current cursor position
            const remaining = this.source.substring(this.cursor);

            for (const [tokenType, regexp] of TokenSpec) {
                const match = regexp.exec(remaining);

                if (match) {
                    const value = match[0];
                    const tokenStart = this.cursor;
                    const tokenEnd = this.cursor + value.length;

                    // Critical: If CHAR is matched, it's an unrecognized token.
                    if (tokenType === TokenType.CHAR) {
                        const errorMsg = `Tokenizer: Unexpected character: ${value}, at position: ${this.cursor}.`;
                        throw new SyntaxError(errorMsg);
                    }

                    // Skip whitespace tokens in the final list for the parser
                    if (tokenType !== TokenType.WHITESPACE) {

                        //* This is where tokens are created for each token type
                        //* and we can inject changes, for example delimiters:
                        /*
                        // These token types do not require a value property
                        if (tokenType === TokenType.LPAREN
                            || tokenType === TokenType.RPAREN
                            || tokenType === TokenType.COMMA
                            || tokenType === TokenType.SLASH
                        ) {
                            // Create tokens for TokenNodes (with position tracking)
                            tokens.push({
                                type: tokenType,
                                start: tokenStart,
                                end: tokenEnd
                            });
                        }
                        //*/

                        // Create tokens for everything else (TokenValueNodes)
                        tokens.push({
                            type: tokenType,
                            value: match[0],
                            start: tokenStart,
                            end: tokenEnd,

                        });
                    }

                    // Advance cursor by the length of the matched value
                    this.cursor += match[0].length;
                    matched = true;
                    break; // Move to the next part of the source string
                }
            }

            if (!matched) {
                // This case should ideally be caught by TokenType.CHAR.
                // If it's reached, it indicates a regex issue or an unhandled edge case
                // where CHAR didn't match.
                const errorMsg = `Tokenizer: Infinite loop or unmatched character at position: ${this.cursor}.`;
                throw new SyntaxError(errorMsg);
            }
        }

        tokens.push(EOF_TOKEN);

        for (const token of tokens) {
            Print.add('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }

} // End of class Tokenizer