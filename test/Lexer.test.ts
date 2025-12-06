import { describe, it, expect } from 'vitest';
import { Parser } from '../src/Lexer.ts';
import { ConsoleColors } from '../src/Colors.ts';

const MAGENTA = ConsoleColors.magenta;
const RESET = ConsoleColors.reset;

describe('Tokenizer Hex Colors', () => {
    const parser = new Parser();

    // Test valid 3-digit hex values
    it('should tokenize 3-digit hex colors', () => {
        const test1 = parser.parse('oklab(126 125 15 / 0.8)');
        expect(test1).toStrictEqual(
            {
                "type": "ColorString",
                "value": {
                    "type": "FunctionNotation",
                    "value": "oklab",
                },
            }
        );
        console.log(`${MAGENTA + JSON.stringify(test1, null, 2) + RESET}`);
    });

    it('should tokenize 3-digit hex colors', () => {
        const test1 = parser.parse('cmyk(126 125 15 / 0.8)');
        expect(test1).toEqual(
            {
                "type": "ColorString",
                "value": null,
            }
        );
        console.log(`${MAGENTA + JSON.stringify(test1, null, 2) + RESET}`);
    });

});