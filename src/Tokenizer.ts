/// <reference types='./types/Tokenizer.d.ts' />

//src/Tokenizer.ts

const __DEBUG__ = true;

import { ConsoleColors } from './Colors.ts';
import Print from './Print.ts';

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

export const TokenType: Record<TokenType, TokenType> = {
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
    [TokenType.WHITESPACE, /^[\s]+/],
    [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)/i], ///^[a-zA-Z]+\b/ },
    [TokenType.PERCENT, /^-?\d*\.?\d+%/],
    [TokenType.NUMBER, /^-?\d*\.?\d+/],
    [TokenType.HEXVALUE, /^#([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})+$/i],
    [TokenType.UNITS, /^(deg|grad|rad|turn)\b/i],
    [TokenType.COMMA, /^,/],
    [TokenType.SLASH, /^\//],
    [TokenType.LPAREN, /^\(/],
    [TokenType.RPAREN, /^\)/],
] as const;

export default class Tokenizer {
    private readonly source: string = '';
    private cursor: number = 0;
    tokens: Token[] = [];

    //
    // 1. TOKENIZER CONSTRUCTOR()
    //
    constructor(...args: any[]) {
        Print('1. Tokenizer - Constructor()');

        const [sourceString] = [...args];
        this.source = this.validateSource(sourceString);

        Print('1.A. Constructor Args:', this.source);

        this.tokens = this.tokenize();
        if (__DEBUG__) Print.log();
    }

    private validateSource(...args: any) {
        const [result] = [...args];
        if (typeof result !== 'string')
            throw new Error('Tokenizer validateSource(): Class expects a string...');
        return result;
    }

    private isEOF(): boolean {
        return this.cursor >= this.source.length;
    }

    //
    // 2. Tokenize()
    //
    private tokenize(): Token[] {
        Print('2. Tokenizer - tokenize()');

        let tokens: Token[] = [];

        while (!this.isEOF()) {
            let matched: boolean = false;

            for (const [tokenType, regexp] of TokenSpec) {
                const match = this.source.substring(this.cursor).match(regexp);
                if (match) {
                    // Skip whitespace tokens in the final list for the parser
                    if (tokenType !== TokenType.WHITESPACE) {
                        tokens.push(this.createToken(tokenType, match[0]));
                    }

                    this.cursor += match[0].length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                this.throwError();
            }
        }

        tokens.push(this.createToken(TokenType.EOF, 'EOF'));
        for (const token of tokens) {
            Print('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }

    private createToken(tType: TokenType, tValue: TokenValue): Token {
        return {
            type: tType,
            value: tValue,
        }
    }

    private throwError() {
        let errorMsg = `Tokenizer.tokenize(): `;
        errorMsg += `Unexpected character: ${this.source[this.cursor]}, `;
        errorMsg += `at position: ${this.cursor}.`;

        throw new SyntaxError(errorMsg);
    }

} // End of class Tokenizer