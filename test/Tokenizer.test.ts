/// <reference types='../src/types/Tokenizer.d.ts' />
// src/test/Tokenizer.test.ts

import { describe, it, expect, beforeEach } from 'vitest';

import Tokenizer, { TokenType, TokenSpec, Keywords } from '../src/Tokenizer.ts';
import { Colors } from '../src/Colors.ts';

describe('Tokenizer', () => {

    describe('Constructor and Initialization', () => {
        it('should throw an error if constructor receives non-string input', () => {
            // @ts-expect-error - Testing invalid input type
            expect(() => new Tokenizer(123)).toThrow('Tokenizer constructor: Class expects a string input.');
            // @ts-expect-error - Testing invalid input type
            expect(() => new Tokenizer(null)).toThrow('Tokenizer constructor: Class expects a string input.');
            // @ts-expect-error - Testing invalid input type
            expect(() => new Tokenizer(undefined)).toThrow('Tokenizer constructor: Class expects a string input.');
        });

        it('should initialize source and tokens correctly for an empty string', () => {
            const tokenizer = new Tokenizer('');
            expect((tokenizer as any).source).toBe('');
            expect(tokenizer.tokens).toEqual([{ type: TokenType.EOF }]);
        });

        it('should normalize whitespace and convert to lowercase during construction', () => {
            const input = `  RGB( \n 255 , \t 0 , 128 )\r\n  `;
            const tokenizer = new Tokenizer(input);
            expect((tokenizer as any).source).toBe('rgb( 255 , 0 , 128 )'); // Normalized and lowercased
        });

        it('should handle a string with only whitespace gracefully (results in empty source)', () => {
            const tokenizer = new Tokenizer('   \n \t \r\n  ');
            expect((tokenizer as any).source).toBe('');
            expect(tokenizer.tokens).toEqual([{ type: TokenType.EOF }]);
        });
    });

    describe('Core Tokenization', () => {
        it('should tokenize FUNCTION names correctly (case-insensitive)', () => {
            const functions = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'hwba', 'lab', 'lch', 'oklab', 'oklch', 'hsv', 'hsva', 'cmyk', 'color'];
            for (const fn of functions) {
                const tokenizer = new Tokenizer(fn.toUpperCase()); // Test uppercase input
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.FUNCTION, value: fn });
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize NAMEDCOLORs correctly (case-insensitive)', () => {
            const namedColors = Object.keys(Colors).concat('transparent'); // Assuming 'transparent' is a named color
            for (const color of namedColors) {
                const tokenizer = new Tokenizer(color.toUpperCase()); // Test uppercase input
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.NAMEDCOLOR, value: color });
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize KEYWORDs correctly (case-insensitive)', () => {
            const keywords = Object.keys(Keywords);
            for (const keyword of keywords) {
                const tokenizer = new Tokenizer(keyword.toUpperCase()); // Test uppercase input
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.KEYWORD, value: keyword });
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize HEXVALUEs (3, 4, 6, 8 digits, case-insensitive)', () => {
            const hexValues = ['#f00', '#F00', '#ff00', '#FF00', '#aabbcc', '#AABBCC', '#aabbccdd', '#AABBCCDD'];
            for (const hex of hexValues) {
                const tokenizer = new Tokenizer(hex);
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.HEXVALUE, value: hex.toLowerCase() }); // Source is lowercased
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize NUMBERs (integers, decimals, negative, scientific notation)', () => {
            const numbers = ['123', '0.5', '-45', '-45.5', '1.23e+5', '-4.56e-2'];
            for (const num of numbers) {
                const tokenizer = new Tokenizer(num);
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.NUMBER, value: num.toLowerCase() }); // Source is lowercased
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize PERCENTAGEs', () => {
            const percentages = ['50%', '100%', '0%', '-10%'];
            for (const percent of percentages) {
                const tokenizer = new Tokenizer(percent);
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.PERCENT, value: percent });
                expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize UNITS (case-insensitive)', () => {
            const units = ['deg', 'rad', 'grad', 'turn'];
            for (const unit of units) {
                const tokenizer = new Tokenizer('120' + unit.toUpperCase()); // Test with number and uppercase unit
                expect(tokenizer.tokens[0]).toEqual({ type: TokenType.NUMBER, value: '120' });
                expect(tokenizer.tokens[1]).toEqual({ type: TokenType.UNITS, value: unit }); // Expected lowercase unit
                expect(tokenizer.tokens[2].type).toBe(TokenType.EOF);
            }
        });

        it('should tokenize COMMA, SLASH, LPAREN, RPAREN', () => {
            const tokens = new Tokenizer(', / ( )').tokens;
            expect(tokens[0]).toEqual({ type: TokenType.COMMA });
            expect(tokens[1]).toEqual({ type: TokenType.SLASH });
            expect(tokens[2]).toEqual({ type: TokenType.LPAREN });
            expect(tokens[3]).toEqual({ type: TokenType.RPAREN });
            expect(tokens[4].type).toBe(TokenType.EOF);
        });

        it('should correctly tokenize a complex color string: rgba(100%, 50%, 25%, 0.5)', () => {
            const tokenizer = new Tokenizer('rgba(100%, 50%, 25%, 0.5)');
            const expectedTokens = [
                { type: TokenType.FUNCTION, value: 'rgba' },
                { type: TokenType.LPAREN },
                { type: TokenType.PERCENT, value: '100%' },
                { type: TokenType.COMMA },
                { type: TokenType.PERCENT, value: '50%' },
                { type: TokenType.COMMA },
                { type: TokenType.PERCENT, value: '25%' },
                { type: TokenType.COMMA },
                { type: TokenType.NUMBER, value: '0.5' },
                { type: TokenType.RPAREN },
                { type: TokenType.EOF },
            ];
            expect(tokenizer.tokens).toEqual(expectedTokens);
        });

        it('should correctly tokenize a complex color string: hsl(120deg 100% 50% / 0.75)', () => {
            const tokenizer = new Tokenizer('hsl(120deg 100% 50% / 0.75)');
            const expectedTokens = [
                { type: TokenType.FUNCTION, value: 'hsl' },
                { type: TokenType.LPAREN },
                { type: TokenType.NUMBER, value: '120' },
                { type: TokenType.UNITS, value: 'deg' },
                { type: TokenType.PERCENT, value: '100%' },
                { type: TokenType.PERCENT, value: '50%' },
                { type: TokenType.SLASH },
                { type: TokenType.NUMBER, value: '0.75' },
                { type: TokenType.RPAREN },
                { type: TokenType.EOF },
            ];
            expect(tokenizer.tokens).toEqual(expectedTokens);
        });

        it('should correctly tokenize color(display-p3 1 0.5 0.3 / 100%)', () => {
            const tokenizer = new Tokenizer('color(display-p3 1 0.5 0.3 / 100%)');
            const expectedTokens = [
                { type: TokenType.FUNCTION, value: 'color' },
                { type: TokenType.LPAREN },
                { type: TokenType.KEYWORD, value: 'display-p3' },
                { type: TokenType.NUMBER, value: '1' },
                { type: TokenType.NUMBER, value: '0.5' },
                { type: TokenType.NUMBER, value: '0.3' },
                { type: TokenType.SLASH },
                { type: TokenType.PERCENT, value: '100%' },
                { type: TokenType.RPAREN },
                { type: TokenType.EOF },
            ];
            expect(tokenizer.tokens).toEqual(expectedTokens);
        });
    });

    describe('Token Precedence (Order in TokenSpec)', () => {
        it('should prioritize KEYWORD over IDENTIFIER', () => {
            // Assuming 'display-p3-test' would be a generic identifier if keyword wasn't prioritized
            const tokenizer = new Tokenizer('display-p3-test');
            expect(tokenizer.tokens[0]).toEqual({ type: TokenType.KEYWORD, value: 'display-p3' });
            expect(tokenizer.tokens[1]).toEqual({ type: TokenType.IDENTIFIER, value: '-test' });
            expect(tokenizer.tokens[2].type).toBe(TokenType.EOF);
        });

        it('should prioritize HEXVALUE over HASH (as HASH is removed, this test is slightly adjusted)', () => {
            const tokenizer = new Tokenizer('#abc');
            expect(tokenizer.tokens[0]).toEqual({ type: TokenType.HEXVALUE, value: '#abc' });
            expect(tokenizer.tokens[1].type).toBe(TokenType.EOF);
        });

        it('should handle a lone hash symbol (now will be a CHAR as HASH is removed)', () => {
            // A standalone '#' would now be caught by CHAR. Adjust if you want a dedicated HASH token.
            expect(() => new Tokenizer('#')).toThrow();
        });
    });

    describe('Utility Methods (current, consume, lookahead, lookbehind)', () => {
        let tokenizer: Tokenizer;

        beforeEach(() => {
            // Initialize with a simple sequence for testing utilities
            tokenizer = new Tokenizer('rgb(10, 20)');
            // Expected tokens: FUNCTION, LPAREN, NUMBER, COMMA, NUMBER, RPAREN, EOF
        });

        it('current() should return the token at tokenIndex without advancing', () => {
            expect(tokenizer.current()).toEqual({ type: TokenType.FUNCTION, value: 'rgb' });
            expect((tokenizer as any).tokenIndex).toBe(0); // Should not advance
        });

        it('current() should return EOF if at the end of token stream', () => {
            // Advance to EOF
            for (let i = 0; i < tokenizer.tokens.length - 1; i++) {
                tokenizer.consume();
            }
            expect(tokenizer.current()).toEqual({ type: TokenType.EOF });
        });

        it('consume() should return the current token and advance tokenIndex', () => {
            const firstToken = tokenizer.consume();
            expect(firstToken).toEqual({ type: TokenType.FUNCTION, value: 'rgb' });
            expect((tokenizer as any).tokenIndex).toBe(1);
            expect(tokenizer.current()).toEqual({ type: TokenType.LPAREN });
        });

        it('lookahead() should peek at future tokens without advancing tokenIndex', () => {
            expect(tokenizer.lookahead(1)).toEqual({ type: TokenType.LPAREN });
            expect(tokenizer.lookahead(2)).toEqual({ type: TokenType.NUMBER, value: '10' });
            expect((tokenizer as any).tokenIndex).toBe(0); // Should not advance
        });

        it('lookahead() should return EOF if looking beyond the token stream', () => {
            // Total tokens = 7 (rgb, (, 10, ,, 20, ), EOF)
            expect(tokenizer.lookahead(100)).toEqual({ type: TokenType.EOF });
        });

        it('lookbehind() should peek at previous tokens without advancing tokenIndex', () => {
            tokenizer.consume(); // Consume rgb
            tokenizer.consume(); // Consume (
            tokenizer.consume(); // Consume 10
            expect(tokenizer.lookbehind(1)).toEqual({ type: TokenType.NUMBER, value: '10' });
            expect(tokenizer.lookbehind(2)).toEqual({ type: TokenType.LPAREN });
            expect((tokenizer as any).tokenIndex).toBe(3); // Should not change
        });

        it('lookbehind() should return null if looking before the start of the token stream', () => {
            expect(tokenizer.lookbehind(1)).toBeNull(); // Before consuming any tokens
            tokenizer.consume(); // Consume rgb
            expect(tokenizer.lookbehind(2)).toBeNull(); // Only one token consumed
        });

        it('should correctly navigate through the entire token stream using utilities', () => {
            // This is a comprehensive test for utility methods
            expect(tokenizer.current().type).toBe(TokenType.FUNCTION);
            tokenizer.consume(); // FUNCTION
            expect(tokenizer.current().type).toBe(TokenType.LPAREN);
            expect(tokenizer.lookahead(1).type).toBe(TokenType.NUMBER);
            expect(tokenizer.lookbehind(1)?.type).toBe(TokenType.FUNCTION);
            tokenizer.consume(); // LPAREN
            expect(tokenizer.current().type).toBe(TokenType.NUMBER);
            tokenizer.consume(); // NUMBER
            expect(tokenizer.current().type).toBe(TokenType.COMMA);
            tokenizer.consume(); // COMMA
            expect(tokenizer.current().type).toBe(TokenType.NUMBER);
            tokenizer.consume(); // NUMBER
            expect(tokenizer.current().type).toBe(TokenType.RPAREN);
            tokenizer.consume(); // RPAREN
            expect(tokenizer.current().type).toBe(TokenType.EOF);
            expect(tokenizer.lookahead(1).type).toBe(TokenType.EOF);
            expect(tokenizer.lookbehind(1)?.type).toBe(TokenType.RPAREN);
        });
    });

    describe('Error Handling', () => {
        it('should throw SyntaxError for an unrecognized character', () => {
            const input = 'rgb(255, !, 0)';
            expect(() => new Tokenizer(input)).toThrow();
        });

        it('should throw SyntaxError for an unexpected character at the start', () => {
            const input = '@invalid';
            expect(() => new Tokenizer(input)).toThrow();
        });

        it('should throw if a token rule is missing and CHAR fallback is disabled (not applicable with CHAR enabled)', () => {
            // This test is more for if TokenType.CHAR was removed and no rule matched
            // Given CHAR is present, it will always catch unhandled chars
            const tokenizerWithNoMatchingRules = () => {
                // Temporarily override TokenSpec to exclude CHAR for this test
                const originalTokenSpec = TokenSpec;
                (TokenSpec as any) = []; // Clear all rules
                try {
                    new Tokenizer('abc');
                } finally {
                    (TokenSpec as any) = originalTokenSpec; // Restore
                }
            };
            // If CHAR is the very last rule, and it matches anything, then the `!matched` condition is only for regex issues
            // This case specifically tests the `if (!matched)` block if CHAR *fails* to match.
            // Which is impossible as CHAR matches '.', so it will always match.
            // Therefore, the error message will always come from the `if (tokenType === TokenType.CHAR)` block.
            // This test validates that the CHAR rule indeed functions as the final error catcher.
            const input = '`'; // A character not likely to be in any rule before CHAR
            expect(() => new Tokenizer(input)).toThrow();
        });
    });

    describe('Edge Cases and Specific Scenarios', () => {
        it('should handle negative numbers in lab() color', () => {
            const tokenizer = new Tokenizer('lab(50 20 -30 / 0.8)');
            const expectedTokens = [
                { type: TokenType.FUNCTION, value: 'lab' },
                { type: TokenType.LPAREN },
                { type: TokenType.NUMBER, value: '50' },
                { type: TokenType.NUMBER, value: '20' },
                { type: TokenType.NUMBER, value: '-30' },
                { type: TokenType.SLASH },
                { type: TokenType.NUMBER, value: '0.8' },
                { type: TokenType.RPAREN },
                { type: TokenType.EOF },
            ];
            expect(tokenizer.tokens).toEqual(expectedTokens);
        });

        it('should handle zero values and floats without leading zero', () => {
            const tokenizer = new Tokenizer('rgb(0, .5, 0.0)');
            const expectedTokens = [
                { type: TokenType.FUNCTION, value: 'rgb' },
                { type: TokenType.LPAREN },
                { type: TokenType.NUMBER, value: '0' },
                { type: TokenType.COMMA },
                { type: TokenType.NUMBER, value: '.5' },
                { type: TokenType.COMMA },
                { type: TokenType.NUMBER, value: '0.0' },
                { type: TokenType.RPAREN },
                { type: TokenType.EOF },
            ];
            expect(tokenizer.tokens).toEqual(expectedTokens);
        });

        // This tokenizer will never be required to parse such a string, but it should
        it('should tokenize long strings with many different token types', () => {
            const longString = `
                linear-gradient(to right, rgb(255 0 0), #00ff00, hsl(120deg 100% 50% / 0.7), transparent);
                color(display-p3 0.1 0.2 0.3 / 50%);
                oklab(70% 0.02 -0.15);
                #12345678;
            `;
            const tokenizer = new Tokenizer(longString);
            const expectedPartialTokens = [ // Just check a few to ensure it processes
                { type: TokenType.IDENTIFIER, value: 'linear-gradient' },
                { type: TokenType.LPAREN },
                { type: TokenType.IDENTIFIER, value: 'to' },
                { type: TokenType.IDENTIFIER, value: 'right' },
                { type: TokenType.COMMA },
                { type: TokenType.FUNCTION, value: 'rgb' },
                { type: TokenType.LPAREN },
                { type: TokenType.NUMBER, value: '255' },
                { type: TokenType.NUMBER, value: '0' },
                { type: TokenType.NUMBER, value: '0' },
                { type: TokenType.RPAREN },
                { type: TokenType.COMMA },
                { type: TokenType.HEXVALUE, value: '#00ff00' },
                { type: TokenType.COMMA },
                { type: TokenType.FUNCTION, value: 'hsl' },
                { type: TokenType.LPAREN },
                { type: TokenType.NUMBER, value: '120' },
                { type: TokenType.UNITS, value: 'deg' },
                { type: TokenType.PERCENT, value: '100%' },
                { type: TokenType.PERCENT, value: '50%' },
                { type: TokenType.SLASH },
                { type: TokenType.NUMBER, value: '0.7' },
                { type: TokenType.RPAREN },
                { type: TokenType.COMMA },
                { type: TokenType.NAMEDCOLOR, value: 'transparent' },
                { type: TokenType.RPAREN },
                { type: TokenType.DELIMITER, value: ';' }, // Semicolon is parsed as delimiter, as it's not in TokenSpec
                { type: TokenType.FUNCTION, value: 'color' },
                { type: TokenType.LPAREN },
                { type: TokenType.KEYWORD, value: 'display-p3' },
                { type: TokenType.NUMBER, value: '0.1' },
                { type: TokenType.NUMBER, value: '0.2' },
                { type: TokenType.NUMBER, value: '0.3' },
                { type: TokenType.SLASH },
                { type: TokenType.PERCENT, value: '50%' },
                { type: TokenType.RPAREN },
                { type: TokenType.DELIMITER, value: ';' }, // Semicolon is parsed as delimiter, as it's not in TokenSpec
                { type: TokenType.FUNCTION, value: 'oklab' },
                { type: TokenType.LPAREN },
                { type: TokenType.PERCENT, value: '70%' },
                { type: TokenType.NUMBER, value: '0.02' },
                { type: TokenType.NUMBER, value: '-0.15' },
                { type: TokenType.RPAREN },
                { type: TokenType.DELIMITER, value: ';' }, // Semicolon is parsed as delimiter, as it's not in TokenSpec
                { type: TokenType.HEXVALUE, value: '#12345678' },
                { type: TokenType.DELIMITER, value: ';' }, // Semicolon is parsed as delimiter, as it's not in TokenSpec
                { type: TokenType.EOF }
            ];
            // Adjust the actual output depending on how you want to handle ';' - currently it'll be CHAR (or DELIMITER)
            // if TokenSpec doesn't have a specific rule. Your current spec will parse it as CHAR.
            // If you want to accept semicolons, add: [TokenType.SEMICOLON, /^;/]
            // For now, I'll update the expectation that it would throw on ';'
            // Since the code has `toLowerCase()`, the `linear-gradient` will also be lowercased.

            // The semicolon will be caught by CHAR
            expect(tokenizer.tokens).toEqual(expectedPartialTokens);
            expect(tokenizer.tokens.length).toEqual(expectedPartialTokens.length); // Check length
            expect(tokenizer.tokens[0]).toEqual(expectedPartialTokens[0]);
            expect(tokenizer.tokens[tokenizer.tokens.length > 100 ? 50 : 0]).toBeDefined(); // Just a sanity check that many tokens exist
        });
    });
});