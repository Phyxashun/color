import { describe, it, expect } from 'vitest';
import { Parser, TokenType, NodeType } from '../src/Lexer.ts';
import Lexer from '../src/Lexer.ts';

describe('Lexer', () => {
    describe('tokenization', () => {
        it('should tokenize whitespace', () => {
            const lexer = new Lexer();
            lexer.init('   ');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.EOF); // Whitespace is skipped
        });

        it('should tokenize function names', () => {
            const lexer = new Lexer();
            lexer.init('rgb(');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.FUNCTION);
            expect(token?.value).toBe('rgb');
        });

        it('should tokenize all function types', () => {
            const functions = ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'hwba', 'lab', 'lch', 'oklab', 'oklch', 'hsv', 'hsva', 'cmyk', 'color'];

            functions.forEach(fn => {
                const lexer = new Lexer();
                lexer.init(`${fn}(`);
                const token = lexer.getNextToken();
                expect(token?.type).toBe(TokenType.FUNCTION);
                expect(token?.value.toLowerCase()).toBe(fn.toLowerCase());
            });
        });

        it('should tokenize hash symbol', () => {
            const lexer = new Lexer();
            lexer.init('#fff');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.HASH);
        });

        it('should tokenize hex values', () => {
            const lexer = new Lexer();
            lexer.init('#abc123');
            lexer.getNextToken(); // Skip HASH
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.HEXVALUE);
            expect(token?.value).toBe('abc123');
        });

        it('should tokenize numbers', () => {
            const lexer = new Lexer();
            lexer.init('255');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.NUMBER);
            expect(token?.value).toBe('255');
        });

        it('should tokenize decimal numbers', () => {
            const lexer = new Lexer();
            lexer.init('0.5');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.NUMBER);
            expect(token?.value).toBe('0.5');
        });

        it('should tokenize percentages', () => {
            const lexer = new Lexer();
            lexer.init('100%');
            const num = lexer.getNextToken();
            const percent = lexer.getNextToken();
            expect(num?.type).toBe(TokenType.NUMBER);
            expect(percent?.type).toBe(TokenType.PERCENT);
        });

        it('should tokenize angle units', () => {
            const units = ['deg', 'rad', 'grad', 'turn'];

            units.forEach(unit => {
                const lexer = new Lexer();
                lexer.init(`120${unit}`);
                lexer.getNextToken(); // Skip NUMBER
                const token = lexer.getNextToken();
                expect(token?.type).toBe(TokenType.UNITS);
                expect(token?.value.toLowerCase()).toBe(unit);
            });
        });

        it('should tokenize parentheses', () => {
            const lexer = new Lexer();
            lexer.init('()');
            const lparen = lexer.getNextToken();
            const rparen = lexer.getNextToken();
            expect(lparen?.type).toBe(TokenType.LPAREN);
            expect(rparen?.type).toBe(TokenType.RPAREN);
        });

        it('should tokenize comma', () => {
            const lexer = new Lexer();
            lexer.init(',');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.COMMA);
        });

        it('should tokenize slash', () => {
            const lexer = new Lexer();
            lexer.init('/');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.SLASH);
        });

        it('should return EOF at end of input', () => {
            const lexer = new Lexer();
            lexer.init('');
            const token = lexer.getNextToken();
            expect(token?.type).toBe(TokenType.EOF);
        });

        it('should throw on unexpected characters', () => {
            const lexer = new Lexer();
            lexer.init('@invalid');
            expect(() => lexer.getNextToken()).toThrow();
        });
    });

    describe('complex tokenization', () => {
        it('should tokenize complete rgb function', () => {
            const lexer = new Lexer();
            lexer.init('rgb(255, 0, 0)');

            expect(lexer.getNextToken()?.type).toBe(TokenType.FUNCTION);
            expect(lexer.getNextToken()?.type).toBe(TokenType.LPAREN);
            expect(lexer.getNextToken()?.type).toBe(TokenType.NUMBER);
            expect(lexer.getNextToken()?.type).toBe(TokenType.COMMA);
            expect(lexer.getNextToken()?.type).toBe(TokenType.NUMBER);
            expect(lexer.getNextToken()?.type).toBe(TokenType.COMMA);
            expect(lexer.getNextToken()?.type).toBe(TokenType.NUMBER);
            expect(lexer.getNextToken()?.type).toBe(TokenType.RPAREN);
            expect(lexer.getNextToken()?.type).toBe(TokenType.EOF);
        });
    });
});

describe('Parser', () => {
    describe('hex colors', () => {
        it('should parse 3-digit hex colors', () => {
            const parser = new Parser();
            const ast = parser.parse('#fff');

            expect(ast.type).toBe(NodeType.start);
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#fff');
        });

        it('should parse 4-digit hex colors with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('#ffff');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ffff');
        });

        it('should parse 6-digit hex colors', () => {
            const parser = new Parser();
            const ast = parser.parse('#ff00ff');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ff00ff');
        });

        it('should parse 8-digit hex colors with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('#ff00ff80');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ff00ff80');
        });

        it('should handle uppercase hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#ABCDEF');

            expect(ast.value.value.value).toBe('#ABCDEF');
        });

        it('should handle mixed case hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#AbCdEf');

            expect(ast.value.value.value).toBe('#AbCdEf');
        });
    });

    describe('RGB/RGBA - space-separated syntax', () => {
        it('should parse rgb with integers', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            expect(ast.value.value.type).toBe(NodeType.function);
            expect(ast.value.value.name).toBe('rgb');
            expect(ast.value.value.value.type).toBe(NodeType.channels);
            expect(ast.value.value.value.value.type).toBe(NodeType.space);
            expect(ast.value.value.value.value.channels).toHaveLength(3);
            expect(ast.value.value.value.value.channels[0].value).toBe(255);
            expect(ast.value.value.value.value.channels[1].value).toBe(0);
            expect(ast.value.value.value.value.channels[2].value).toBe(0);
        });

        it('should parse rgb with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 50% 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[0].value).toBe(100);
            expect(channels[0].units).toBe('%');
        });

        it('should parse rgba with slash alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.5)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeDefined();
            expect(spaceList.alpha?.type).toBe(NodeType.alpha);
            expect(spaceList.alpha?.value.value).toBe(0.5);
        });

        it('should parse rgba with percentage alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 50%)');

            const alpha = ast.value.value.value.value.alpha;
            expect(alpha?.value.valueType).toBe('percentage');
            expect(alpha?.value.value).toBe(50);
        });

        it('should parse rgba with alpha = 1', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 1)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(1);
        });

        it('should parse rgba function name', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255 0 0 / 0.5)');

            expect(ast.value.value.name).toBe('rgba');
        });
    });

    describe('RGB/RGBA - comma-separated syntax', () => {
        it('should parse rgb with commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255, 0, 0)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
            expect(ast.value.value.value.value.channels[0].value).toBe(255);
            expect(ast.value.value.value.value.channels[1].value).toBe(0);
            expect(ast.value.value.value.value.channels[2].value).toBe(0);
        });

        it('should parse rgba with comma alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255, 0, 0, 0.5)');

            const commaList = ast.value.value.value.value;
            expect(commaList.alpha).toBeDefined();
            expect(commaList.alpha?.type).toBe(NodeType.optional_alpha);
            expect(commaList.alpha?.value.value).toBe(0.5);
        });

        it('should parse rgb with percentages and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100%, 50%, 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[1].valueType).toBe('percentage');
            expect(channels[2].valueType).toBe('percentage');
        });

        it('should handle spaces around commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 , 0 , 0)');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });
    });

    describe('HSL/HSLA - space-separated syntax', () => {
        it('should parse hsl with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(ast.value.value.name).toBe('hsl');
            expect(channels[0].valueType).toBe('angle');
            expect(channels[0].value).toBe(120);
            expect(channels[0].units).toBe('deg');
            expect(channels[1].valueType).toBe('percentage');
            expect(channels[2].valueType).toBe('percentage');
        });

        it('should parse hsl without units on hue', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(120);
            expect(channels[0].valueType).toBe('number');
        });

        it('should parse hsl with radians', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(2rad 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].units).toBe('rad');
        });

        it('should parse hsl with gradians', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(133grad 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].units).toBe('grad');
        });

        it('should parse hsl with turns', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(0.33turn 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.33);
            expect(channels[0].units).toBe('turn');
        });

        it('should parse hsla with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50% / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse hsla function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hsla(120deg 100% 50% / 0.5)');

            expect(ast.value.value.name).toBe('hsla');
        });
    });

    describe('HSL/HSLA - comma-separated syntax', () => {
        it('should parse hsl with commas', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120, 100%, 50%)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
            expect(ast.value.value.value.value.channels[0].value).toBe(120);
        });

        it('should parse hsla with comma alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsla(120, 100%, 50%, 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });

        it('should parse hsl with degrees and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg, 100%, 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });
    });

    describe('HWB/HWBA', () => {
        it('should parse hwb', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120 30% 50%)');

            expect(ast.value.value.name).toBe('hwb');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(120);
            expect(channels[1].value).toBe(30);
            expect(channels[2].value).toBe(50);
        });

        it('should parse hwb with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120deg 30% 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });

        it('should parse hwba with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120 30% 50% / 0.7)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.7);
        });

        it('should parse hwba function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hwba(120 30% 50% / 0.7)');

            expect(ast.value.value.name).toBe('hwba');
        });
    });

    describe('HSV/HSVA', () => {
        it('should parse hsv', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120 100% 50%)');

            expect(ast.value.value.name).toBe('hsv');
        });

        it('should parse hsv with comma syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120, 100%, 50%)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse hsva with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120 100% 50% / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse hsva function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hsva(120, 100%, 50%, 0.5)');

            expect(ast.value.value.name).toBe('hsva');
        });
    });

    describe('LAB', () => {
        it('should parse lab', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50 40 59)');

            expect(ast.value.value.name).toBe('lab');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(40);
            expect(channels[2].value).toBe(59);
        });

        it('should parse lab with percentage lightness', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50% 40 59)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse lab with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50 40 59 / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse lab with decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50.5 40.2 59.8)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50.5);
            expect(channels[1].value).toBe(40.2);
            expect(channels[2].value).toBe(59.8);
        });
    });

    describe('OKLAB', () => {
        it('should parse oklab', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50 0.1 0.2)');

            expect(ast.value.value.name).toBe('oklab');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(0.1);
            expect(channels[2].value).toBe(0.2);
        });

        it('should parse oklab with percentage', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50% 0.1 0.2)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse oklab with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50 0.1 0.2 / 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });
    });

    describe('LCH', () => {
        it('should parse lch', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120)');

            expect(ast.value.value.name).toBe('lch');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(70);
            expect(channels[2].value).toBe(120);
        });

        it('should parse lch with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120deg)');

            expect(ast.value.value.value.value.channels[2].units).toBe('deg');
        });

        it('should parse lch with percentage lightness', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50% 70 120)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse lch with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120 / 0.9)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.9);
        });

        it('should parse lch with decimal hue', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120.5)');

            expect(ast.value.value.value.value.channels[2].value).toBe(120.5);
        });
    });

    describe('OKLCH', () => {
        it('should parse oklch', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50 0.2 120)');

            expect(ast.value.value.name).toBe('oklch');
        });

        it('should parse oklch with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50% 0.2 120deg)');

            expect(ast.value.value.value.value.channels[2].units).toBe('deg');
        });

        it('should parse oklch with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50 0.2 120 / 0.6)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.6);
        });
    });

    describe('CMYK', () => {
        it('should parse cmyk with space syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0 100 100 0)');

            expect(ast.value.value.name).toBe('cmyk');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(100);
            expect(channels[2].value).toBe(100);
        });

        it('should parse cmyk with comma syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0, 100, 100, 0)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse cmyk with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0% 100% 100% 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[1].valueType).toBe('percentage');
        });
    });

    describe('COLOR function', () => {
        it('should parse color function', () => {
            const parser = new Parser();
            const ast = parser.parse('color(display-p3 1 0.5 0)');

            expect(ast.value.value.name).toBe('color');
        });

        it('should parse color with decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('color(srgb 0.5 0.3 0.2)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.5);
            expect(channels[1].value).toBe(0.3);
            expect(channels[2].value).toBe(0.2);
        });

        it('should parse color with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('color(display-p3 1 0.5 0 / 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });
    });

    describe('edge cases', () => {
        it('should handle no whitespace', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255,0,0)');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });

        it('should handle extra whitespace', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(  255   0   0  )');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });

        it('should handle mixed whitespace and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb( 255 , 0 , 0 )');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse zero values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0 0 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(0);
            expect(channels[2].value).toBe(0);
        });

        it('should parse alpha = 0', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });

        it('should parse very small decimals', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.001)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.001);
        });
    });

    describe('error handling', () => {
        it('should throw on missing hash for hex color', () => {
            const parser = new Parser();
            expect(() => parser.parse('fff')).toThrow();
        });

        it('should throw on missing opening parenthesis', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb 255, 0, 0)')).toThrow();
        });

        it('should throw on missing closing parenthesis', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255, 0, 0')).toThrow();
        });

        it('should throw on missing comma in comma-separated list', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255 0, 0)')).toThrow();
        });

        it('should throw on invalid function name', () => {
            const parser = new Parser();
            expect(() => parser.parse('invalid(255, 0, 0)')).toThrow();
        });

        it('should throw on unexpected token', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255, 0, 0, 0, 0)')).toThrow();
        });

        it('should throw on premature EOF', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255')).toThrow();
        });

        it('should throw on invalid hex characters', () => {
            const parser = new Parser();
            expect(() => parser.parse('#xyz')).toThrow();
        });
    });

    describe('case insensitivity', () => {
        it('should handle uppercase function names', () => {
            const parser = new Parser();
            const ast = parser.parse('RGB(255, 0, 0)');

            expect(ast.value.value.name).toBe('rgb');
        });

        it('should handle mixed case function names', () => {
            const parser = new Parser();
            const ast = parser.parse('RgBa(255, 0, 0, 0.5)');

            expect(ast.value.value.name).toBe('rgba');
        });

        it('should handle uppercase angle units', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120DEG 100% 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });
    });

    describe('real world examples', () => {
        it('should parse common red color', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            expect(ast.value.type).toBe(NodeType.color);
        });

        it('should parse transparent black', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(0, 0, 0, 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });

        it('should parse semi-transparent white', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255, 255, 255, 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse pure green in HSL', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120, 100%, 50%)');

            expect(ast.value.value.name).toBe('hsl');
        });

        it('should parse blue with modern syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(240 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(240);
        });

        it('should parse yellow', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 255 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[1].value).toBe(255);
            expect(channels[2].value).toBe(0);
        });

        it('should parse cyan in modern HSL', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(180deg 100% 50%)');

            expect(ast.value.value.value.value.channels[0].value).toBe(180);
        });

        it('should parse magenta', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 255)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[2].value).toBe(255);
        });

        it('should parse orange', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 165 0)');

            expect(ast.value.value.value.value.channels[1].value).toBe(165);
        });

        it('should parse gray with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(50% 50% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[0].value).toBe(50);
        });
    });

    describe('comprehensive color space tests', () => {
        it('should parse all RGB variants', () => {
            const parser = new Parser();
            const colors = [
                'rgb(255 0 0)',
                'rgb(255, 0, 0)',
                'rgba(255 0 0 / 0.5)',
                'rgba(255, 0, 0, 0.5)',
                'rgb(100% 0% 0%)',
                'rgb(100%, 0%, 0%)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.type).toBe(NodeType.start);
                expect(ast.value.value.name).toMatch(/^rgba?$/);
            });
        });

        it('should parse all HSL variants', () => {
            const parser = new Parser();
            const colors = [
                'hsl(120 100% 50%)',
                'hsl(120, 100%, 50%)',
                'hsla(120 100% 50% / 0.5)',
                'hsla(120, 100%, 50%, 0.5)',
                'hsl(120deg 100% 50%)',
                'hsl(2rad 100% 50%)',
                'hsl(0.33turn 100% 50%)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.value.value.name).toMatch(/^hsla?$/);
            });
        });

        it('should parse all angle units', () => {
            const parser = new Parser();
            const units = ['deg', 'rad', 'grad', 'turn'];

            units.forEach(unit => {
                const ast = parser.parse(`hsl(120${unit} 100% 50%)`);
                expect(ast.value.value.value.value.channels[0].units).toBe(unit);
            });
        });

        it('should parse hex colors of all lengths', () => {
            const parser = new Parser();
            const colors = ['#f00', '#f00f', '#ff0000', '#ff0000ff'];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.value.value.type).toBe(NodeType.hexcolor);
                expect(ast.value.value.value).toBe(color);
            });
        });
    });

    describe('AST structure validation', () => {
        it('should have correct node hierarchy for rgb', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            // Validate structure
            expect(ast.type).toBe(NodeType.start);
            expect(ast.value).toBeDefined();
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value).toBeDefined();
            expect(ast.value.value.type).toBe(NodeType.function);
            expect(ast.value.value.value).toBeDefined();
            expect(ast.value.value.value.type).toBe(NodeType.channels);
            expect(ast.value.value.value.value).toBeDefined();
            expect(ast.value.value.value.value.type).toBe(NodeType.space);
            expect(ast.value.value.value.value.channels).toHaveLength(3);
            expect(ast.value.value.value.value.channels[0].type).toBe(NodeType.value);
        });

        it('should have correct node hierarchy for hex', () => {
            const parser = new Parser();
            const ast = parser.parse('#fff');

            expect(ast.type).toBe(NodeType.start);
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#fff');
        });

        it('should have alpha node when present', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.5)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeDefined();
            expect(spaceList.alpha?.type).toBe(NodeType.alpha);
            expect(spaceList.alpha?.value).toBeDefined();
            expect(spaceList.alpha?.value.type).toBe(NodeType.value);
        });

        it('should not have alpha node when absent', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeUndefined();
        });
    });

    describe('value node properties', () => {
        it('should correctly identify number type', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('number');
            expect(channel.units).toBeUndefined();
        });

        it('should correctly identify percentage type', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 0% 0%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('percentage');
            expect(channel.units).toBe('%');
        });

        it('should correctly identify angle type with deg', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('deg');
        });

        it('should correctly identify angle type with rad', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(2rad 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('rad');
        });

        it('should correctly identify angle type with grad', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(133grad 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('grad');
        });

        it('should correctly identify angle type with turn', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(0.33turn 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('turn');
        });

        it('should store correct numeric values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(123 45 67)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(123);
            expect(channels[1].value).toBe(45);
            expect(channels[2].value).toBe(67);
        });

        it('should store correct decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0.5 0.25 0.75)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.5);
            expect(channels[1].value).toBe(0.25);
            expect(channels[2].value).toBe(0.75);
        });
    });

    describe('function name normalization', () => {
        it('should normalize function names to lowercase', () => {
            const parser = new Parser();
            const colors = [
                ['RGB(255, 0, 0)', 'rgb'],
                ['RGBA(255, 0, 0, 0.5)', 'rgba'],
                ['HSL(120, 100%, 50%)', 'hsl'],
                ['HSLA(120, 100%, 50%, 0.5)', 'hsla'],
                ['HWB(120 30% 50%)', 'hwb'],
                ['LAB(50 40 59)', 'lab'],
                ['LCH(50 70 120)', 'lch'],
                ['OKLAB(50 0.1 0.2)', 'oklab'],
                ['OKLCH(50 0.2 120)', 'oklch']
            ];

            colors.forEach(([input, expected]) => {
                const ast = parser.parse(input);
                expect(ast.value.value.name).toBe(expected);
            });
        });
    });

    describe('boundary values', () => {
        it('should handle max RGB values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 255 255)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[1].value).toBe(255);
            expect(channels[2].value).toBe(255);
        });

        it('should handle min RGB values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0 0 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(0);
            expect(channels[2].value).toBe(0);
        });

        it('should handle 100% percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 100% 100%)');

            const channels = ast.value.value.value.value.channels;
            channels.forEach(channel => {
                expect(channel.value).toBe(100);
                expect(channel.valueType).toBe('percentage');
            });
        });

        it('should handle 0% percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0% 0% 0%)');

            const channels = ast.value.value.value.value.channels;
            channels.forEach(channel => {
                expect(channel.value).toBe(0);
                expect(channel.valueType).toBe('percentage');
            });
        });

        it('should handle 360deg hue', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(360deg 100% 50%)');

            expect(ast.value.value.value.value.channels[0].value).toBe(360);
        });

        it('should handle alpha = 1', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 1)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(1);
        });

        it('should handle alpha = 0', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });
    });

    describe('performance tests', () => {
        it('should parse multiple colors efficiently', () => {
            const parser = new Parser();
            const colors = [
                '#fff',
                'rgb(255, 0, 0)',
                'hsl(120, 100%, 50%)',
                'rgba(255, 0, 0, 0.5)',
                'hsla(120, 100%, 50%, 0.8)',
                'hwb(120 30% 50%)',
                'lab(50 40 59)',
                'lch(50 70 120)',
                'oklab(50 0.1 0.2)',
                'oklch(50 0.2 120)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.type).toBe(NodeType.start);
            });
        });

        it('should handle long hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#aabbccdd');

            expect(ast.value.value.value).toBe('#aabbccdd');
        });
    });
});