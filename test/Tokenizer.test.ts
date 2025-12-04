import { describe, it, expect } from 'vitest'
import Tokenizer from '../src/Tokenizer.ts';
import Colors from '../src/Colors.ts';

/*
describe('Tokenizer Named Colors', () => {        
    // Test named colors from Colors.ts
    it('should parse named colors from Colors (e.g. Colors.rebeccapurple)', () => {
        expect(new Tokenizer(Colors.rebeccapurple).source).toEqual('#663399');
        expect(new Tokenizer(Colors.rebeccapurple).tokens).toEqual([ 
            { 
                'type': 'HEXSTRING', 
                'value': '#663399' 
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });
});
//*/

describe('Tokenizer Hex Colors', () => {
    // Test valid 3-digit hex values
    it('should tokenize 3-digit hex colors', () => {
        expect(new Tokenizer('#fff').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#fff',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#000').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#000',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#abc').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#abc',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });

    // Test valid 6-digit hex values
    it('should tokenize 6-digit hex colors', () => {
        expect(new Tokenizer('#ffffff').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#ffffff',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#000000').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#000000',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#aabbcc').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#aabbcc',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });

    // Test valid 8-digit hex values
    it('should tokenize 8-digit hex colors', () => {
        expect(new Tokenizer('#ffffffff').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#ffffffff',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#00000000').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#00000000',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('#aabbccdd').tokens).toEqual([
            {
                'type': 'HEXSTRING',
                'value': '#aabbccdd',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });
});


describe('Tokenizer RGB/RGBA Colors', () => {
    // Test valid rgb() values
    it('should tokenize rgb() colors', () => {
        expect(new Tokenizer('rgb(255, 0, 128)').tokens).toEqual([
            {
                'type': 'FUNCTION',
                'value': 'rgb',
            },
            {
                'type': 'OPEN_PAREN',
                'value': '(',
            },
            {
                'type': 'NUMBER',
                'value': '255',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'NUMBER',
                'value': '128',
            },
            {
                'type': 'CLOSE_PAREN',
                'value': ')',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('rgb( 0 , 0 , 0 )').tokens).toEqual([
            {
                'type': 'FUNCTION',
                'value': 'rgb',
            },
            {
                'type': 'OPEN_PAREN',
                'value': '(',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'CLOSE_PAREN',
                'value': ')',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('rgba(100 50 200 / 80%)').tokens).toEqual([
            {
                'type': 'FUNCTION',
                'value': 'rgba',
            },
            {
                'type': 'OPEN_PAREN',
                'value': '(',
            },
            {
                'type': 'NUMBER',
                'value': '100',
            },
            {
                'type': 'NUMBER',
                'value': '50',
            },
            {
                'type': 'NUMBER',
                'value': '200',
            },
            {
                'type': 'SLASH',
                'value': '/',
            },
            {
                'type': 'PERCENTAGE',
                'value': '80%',
            },
            {
                'type': 'CLOSE_PAREN',
                'value': ')',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });

    // Test valid named colors
    it('should parse named colors', () => {
        expect(new Tokenizer('white').tokens).toEqual([
            {
                type: 'IDENTIFIER',
                value: 'white',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('black').tokens).toEqual([
            {
                type: 'IDENTIFIER',
                value: 'black',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
        expect(new Tokenizer('red').tokens).toEqual([
            {
                type: 'IDENTIFIER',
                value: 'red',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);
    });
});
//*/
/*
describe('CSS Color String Tokenizer class', () => {
    // Test invalid inputs
    it('should return null for invalid formats', () => {
        // Invalid identifier
        expect(new Tokenizer('invalidcolor').tokens).toBeNull();

        // Too short hex value
        expect(new Tokenizer('#ff').tokens).toBeNull();

        // Out of range
        expect(new Tokenizer('rgb(256, 0, 0)').tokens).toEqual([
            {
                'type': 'FUNCTION',
                'value': 'rgb',
            },
            {
                'type': 'OPEN_PAREN',
                'value': '(',
            },
            {
                'type': 'NUMBER',
                'value': '256',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'WHITESPACE',
                'value': ' ',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'COMMA',
                'value': ',',
            },
            {
                'type': 'WHITESPACE',
                'value': ' ',
            },
            {
                'type': 'NUMBER',
                'value': '0',
            },
            {
                'type': 'CLOSE_PAREN',
                'value': ')',
            },
            {
                'type': 'EOL',
                'value': '',
            },
        ]);

        // Non-numeric
        expect(new Tokenizer('rgb(a, b, c)').tokens).toBeNull();
    });
});
//*/