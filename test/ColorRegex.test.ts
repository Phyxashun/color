import { describe, it, expect } from 'vitest';
import ColorRegex from '../src/ColorRegex.ts';

describe('ColorRegex', () => {
    describe('hex3or4', () => {
        it('should match 3-digit hex colors', () => {
            expect(ColorRegex.hex3or4.test('#abc')).toBe(true);
            expect(ColorRegex.hex3or4.test('#ABC')).toBe(true);
            expect(ColorRegex.hex3or4.test('#123')).toBe(true);
            expect(ColorRegex.hex3or4.test('#f0f')).toBe(true);
        });

        it('should match 4-digit hex colors with alpha', () => {
            expect(ColorRegex.hex3or4.test('#abcd')).toBe(true);
            expect(ColorRegex.hex3or4.test('#1234')).toBe(true);
            expect(ColorRegex.hex3or4.test('#F0FA')).toBe(true);
        });

        it('should not match invalid hex colors', () => {
            expect(ColorRegex.hex3or4.test('#ab')).toBe(false);
            expect(ColorRegex.hex3or4.test('#abcde')).toBe(false);
            expect(ColorRegex.hex3or4.test('abc')).toBe(false);
            expect(ColorRegex.hex3or4.test('#ghij')).toBe(false);
            expect(ColorRegex.hex3or4.test('#abcdef')).toBe(false);
        });
    });

    describe('hex6or8', () => {
        it('should match 6-digit hex colors', () => {
            expect(ColorRegex.hex6or8.test('#abcdef')).toBe(true);
            expect(ColorRegex.hex6or8.test('#ABCDEF')).toBe(true);
            expect(ColorRegex.hex6or8.test('#123456')).toBe(true);
            expect(ColorRegex.hex6or8.test('#ff00ff')).toBe(true);
        });

        it('should match 8-digit hex colors with alpha', () => {
            expect(ColorRegex.hex6or8.test('#abcdef12')).toBe(true);
            expect(ColorRegex.hex6or8.test('#12345678')).toBe(true);
            expect(ColorRegex.hex6or8.test('#FF00FFAA')).toBe(true);
        });

        it('should not match invalid hex colors', () => {
            expect(ColorRegex.hex6or8.test('#abcde')).toBe(false);
            expect(ColorRegex.hex6or8.test('#abcdefg')).toBe(false);
            expect(ColorRegex.hex6or8.test('#abc')).toBe(false);
            expect(ColorRegex.hex6or8.test('abcdef')).toBe(false);
        });
    });

    describe('rgb', () => {
        it('should match rgb with comma separators', () => {
            expect(ColorRegex.rgb.test('rgb(255, 0, 0)')).toBe(true);
            expect(ColorRegex.rgb.test('rgb(255,0,0)')).toBe(true);
            expect(ColorRegex.rgb.test('rgb(100%, 50%, 0%)')).toBe(true);
        });

        it('should match rgb with space separators', () => {
            expect(ColorRegex.rgb.test('rgb(255 0 0)')).toBe(true);
            expect(ColorRegex.rgb.test('rgb( 255  0  0 )')).toBe(true);
        });

        it('should not match invalid rgb', () => {
            expect(ColorRegex.rgb.test('rgb(255, 0)')).toBe(false);
            expect(ColorRegex.rgb.test('rgb(255, 0, 0, 0.5)')).toBe(false);
            expect(ColorRegex.rgb.test('rgba(255, 0, 0)')).toBe(false);
        });
    });

    describe('rgba', () => {
        it('should match rgba with comma separators and alpha', () => {
            expect(ColorRegex.rgba.test('rgba(255, 0, 0, 0.5)')).toBe(true);
            expect(ColorRegex.rgba.test('rgba(255, 0, 0, 1)')).toBe(true);
            expect(ColorRegex.rgba.test('rgba(100%, 50%, 0%, 0.75)')).toBe(true);
        });

        it('should match rgba with slash notation', () => {
            expect(ColorRegex.rgba.test('rgba(255 0 0 / 0.5)')).toBe(true);
            expect(ColorRegex.rgba.test('rgb(255 0 0 / 0.5)')).toBe(true);
        });

        it('should match rgb without alpha', () => {
            expect(ColorRegex.rgba.test('rgb(255, 0, 0)')).toBe(true);
            expect(ColorRegex.rgba.test('rgb(255 0 0)')).toBe(true);
        });

        it('should not match invalid rgba', () => {
            expect(ColorRegex.rgba.test('rgba(255, 0)')).toBe(false);
            expect(ColorRegex.rgba.test('rgba(255, 0, 0, 1.5)')).toBe(false);
        });
    });

    describe('hsl', () => {
        it('should match hsl with various formats', () => {
            expect(ColorRegex.hsl.test('hsl(120, 100%, 50%)')).toBe(true);
            expect(ColorRegex.hsl.test('hsl(120deg, 100%, 50%)')).toBe(true);
            expect(ColorRegex.hsl.test('hsl(120 100% 50%)')).toBe(true);
            expect(ColorRegex.hsl.test('hsl(2rad 100% 50%)')).toBe(true);
            expect(ColorRegex.hsl.test('hsl(0.5turn 100% 50%)')).toBe(true);
        });

        it('should match hsl with alpha using slash notation', () => {
            expect(ColorRegex.hsl.test('hsl(120deg 100% 50% / 0.5)')).toBe(true);
            expect(ColorRegex.hsl.test('hsl(120 100% 50% / 1)')).toBe(true);
        });

        it('should not match invalid hsl', () => {
            expect(ColorRegex.hsl.test('hsl(120, 100%)')).toBe(false);
            expect(ColorRegex.hsl.test('hsl(120deg, 100%, 50%, 0.5)')).toBe(false);
        });
    });

    describe('hsla', () => {
        it('should match hsla with comma separators and alpha', () => {
            expect(ColorRegex.hsla.test('hsla(120, 100%, 50%, 0.5)')).toBe(true);
            expect(ColorRegex.hsla.test('hsla(120deg, 100%, 50%, 1)')).toBe(true);
        });

        it('should match hsla with slash notation', () => {
            expect(ColorRegex.hsla.test('hsla(120 100% 50% / 0.5)')).toBe(true);
            expect(ColorRegex.hsla.test('hsl(120 100% 50% / 0.5)')).toBe(true);
        });

        it('should match hsl without alpha', () => {
            expect(ColorRegex.hsla.test('hsl(120, 100%, 50%)')).toBe(true);
            expect(ColorRegex.hsla.test('hsl(120deg 100% 50%)')).toBe(true);
        });

        it('should not match invalid hsla', () => {
            expect(ColorRegex.hsla.test('hsla(120, 100%)')).toBe(false);
            expect(ColorRegex.hsla.test('hsla(120deg, 100%, 50%, 1.5)')).toBe(false);
        });
    });

    describe('hwb', () => {
        it('should match hwb with space separators', () => {
            expect(ColorRegex.hwb.test('hwb(120 30% 50%)')).toBe(true);
            expect(ColorRegex.hwb.test('hwb(120deg 30% 50%)')).toBe(true);
            expect(ColorRegex.hwb.test('hwb(2rad 30% 50%)')).toBe(true);
        });

        it('should match hwb with alpha using slash notation', () => {
            expect(ColorRegex.hwb.test('hwb(120 30% 50% / 0.5)')).toBe(true);
            expect(ColorRegex.hwb.test('hwb(120deg 30% 50% / 1)')).toBe(true);
        });

        it('should not match invalid hwb', () => {
            expect(ColorRegex.hwb.test('hwb(120, 30%, 50%)')).toBe(false);
            expect(ColorRegex.hwb.test('hwb(120 30%)')).toBe(false);
        });
    });

    describe('hwba', () => {
        it('should match hwba with alpha', () => {
            expect(ColorRegex.hwba.test('hwba(120 30% 50% / 0.5)')).toBe(true);
            expect(ColorRegex.hwba.test('hwb(120 30% 50%)')).toBe(true);
            expect(ColorRegex.hwba.test('hwb(120deg 30% 50% / 1)')).toBe(true);
        });

        it('should not match invalid hwba', () => {
            expect(ColorRegex.hwba.test('hwba(120, 30%, 50%, 0.5)')).toBe(false);
            expect(ColorRegex.hwba.test('hwba(120 30%)')).toBe(false);
        });
    });

    describe('hsv', () => {
        it('should match hsv with various formats', () => {
            expect(ColorRegex.hsv.test('hsv(120, 100%, 50%)')).toBe(true);
            expect(ColorRegex.hsv.test('hsv(120deg, 100%, 50%)')).toBe(true);
            expect(ColorRegex.hsv.test('hsv(120 100% 50%)')).toBe(true);
        });

        it('should match hsv with alpha using slash notation', () => {
            expect(ColorRegex.hsv.test('hsv(120 100% 50% / 0.5)')).toBe(true);
        });

        it('should not match invalid hsv', () => {
            expect(ColorRegex.hsv.test('hsv(120, 100%)')).toBe(false);
        });
    });

    describe('hsva', () => {
        it('should match hsva with comma separators and alpha', () => {
            expect(ColorRegex.hsva.test('hsva(120, 100%, 50%, 0.5)')).toBe(true);
            expect(ColorRegex.hsva.test('hsva(120deg, 100%, 50%, 1)')).toBe(true);
        });

        it('should match hsva with slash notation', () => {
            expect(ColorRegex.hsva.test('hsv(120 100% 50% / 0.5)')).toBe(true);
        });

        it('should match hsv without alpha', () => {
            expect(ColorRegex.hsva.test('hsv(120 100% 50%)')).toBe(true);
        });

        it('should not match invalid hsva', () => {
            expect(ColorRegex.hsva.test('hsva(120, 100%)')).toBe(false);
            expect(ColorRegex.hsva.test('hsva(120deg, 100%, 50%, 1.5)')).toBe(false);
        });
    });

    describe('lab', () => {
        it('should match lab with space separators', () => {
            expect(ColorRegex.lab.test('lab(50% 40 59)')).toBe(true);
            expect(ColorRegex.lab.test('lab(50 40 59)')).toBe(true);
        });

        it('should match lab with negative values', () => {
            expect(ColorRegex.lab.test('lab(50% -40 59)')).toBe(true);
            expect(ColorRegex.lab.test('lab(50% 40 -59)')).toBe(true);
            expect(ColorRegex.lab.test('lab(50% -40 -59)')).toBe(true);
        });

        it('should match lab with alpha using slash notation', () => {
            expect(ColorRegex.lab.test('lab(50% 40 59 / 0.5)')).toBe(true);
        });

        it('should not match invalid lab', () => {
            expect(ColorRegex.lab.test('lab(50% 40)')).toBe(false);
            expect(ColorRegex.lab.test('lab(50%, 40, 59)')).toBe(false);
        });
    });

    describe('oklab', () => {
        it('should match oklab with space separators', () => {
            expect(ColorRegex.oklab.test('oklab(50% 0.1 0.2)')).toBe(true);
            expect(ColorRegex.oklab.test('oklab(50 0.1 0.2)')).toBe(true);
        });

        it('should match oklab with negative values', () => {
            expect(ColorRegex.oklab.test('oklab(50% -0.1 0.2)')).toBe(true);
            expect(ColorRegex.oklab.test('oklab(50% 0.1 -0.2)')).toBe(true);
            expect(ColorRegex.oklab.test('oklab(50% -0.1 -0.2)')).toBe(true);
        });

        it('should match oklab with alpha using slash notation', () => {
            expect(ColorRegex.oklab.test('oklab(50% 0.1 0.2 / 0.5)')).toBe(true);
        });

        it('should not match invalid oklab', () => {
            expect(ColorRegex.oklab.test('oklab(50% 0.1)')).toBe(false);
            expect(ColorRegex.oklab.test('oklab(50%, 0.1, 0.2)')).toBe(false);
        });
    });

    describe('lch', () => {
        it('should match lch with space separators', () => {
            expect(ColorRegex.lch.test('lch(50% 70 120)')).toBe(true);
            expect(ColorRegex.lch.test('lch(50% 70 120deg)')).toBe(true);
            expect(ColorRegex.lch.test('lch(50% 70 2rad)')).toBe(true);
            expect(ColorRegex.lch.test('lch(50% 70 0.5turn)')).toBe(true);
        });

        it('should match lch with alpha using slash notation', () => {
            expect(ColorRegex.lch.test('lch(50% 70 120 / 0.5)')).toBe(true);
        });

        it('should not match invalid lch', () => {
            expect(ColorRegex.lch.test('lch(50% 70)')).toBe(false);
            expect(ColorRegex.lch.test('lch(50%, 70, 120)')).toBe(false);
        });
    });

    describe('oklch', () => {
        it('should match oklch with space separators', () => {
            expect(ColorRegex.oklch.test('oklch(50% 0.2 120)')).toBe(true);
            expect(ColorRegex.oklch.test('oklch(50% 0.2 120deg)')).toBe(true);
            expect(ColorRegex.oklch.test('oklch(50% 0.2 2rad)')).toBe(true);
            expect(ColorRegex.oklch.test('oklch(50% 0.2 0.5turn)')).toBe(true);
        });

        it('should match oklch with alpha using slash notation', () => {
            expect(ColorRegex.oklch.test('oklch(50% 0.2 120 / 0.5)')).toBe(true);
        });

        it('should not match invalid oklch', () => {
            expect(ColorRegex.oklch.test('oklch(50% 0.2)')).toBe(false);
            expect(ColorRegex.oklch.test('oklch(50%, 0.2, 120)')).toBe(false);
        });
    });

    describe('cmyk', () => {
        it('should match cmyk with percentages and commas', () => {
            expect(ColorRegex.cmyk.test('cmyk(0%, 100%, 100%, 0%)')).toBe(true);
            expect(ColorRegex.cmyk.test('cmyk(0, 100, 100, 0)')).toBe(true);
        });

        it('should match cmyk with space separators', () => {
            expect(ColorRegex.cmyk.test('cmyk(0% 100% 100% 0%)')).toBe(true);
            expect(ColorRegex.cmyk.test('cmyk(0 100 100 0)')).toBe(true);
        });

        it('should not match invalid cmyk', () => {
            expect(ColorRegex.cmyk.test('cmyk(0%, 100%, 100%)')).toBe(false);
            expect(ColorRegex.cmyk.test('cmyk(0%, 100%, 100%, 0%, 50%)')).toBe(false);
        });
    });

    describe('color', () => {
        it('should match color function with various color spaces', () => {
            expect(ColorRegex.color.test('color(display-p3 1 0.5 0)')).toBe(true);
            expect(ColorRegex.color.test('color(srgb 1 0.5 0)')).toBe(true);
            expect(ColorRegex.color.test('color(xyz 0.5 0.3 0.2)')).toBe(true);
        });

        it('should match color function with alpha', () => {
            expect(ColorRegex.color.test('color(display-p3 1 0.5 0 / 0.5)')).toBe(true);
        });

        it('should not match invalid color function', () => {
            expect(ColorRegex.color.test('color(display-p3)')).toBe(false);
            expect(ColorRegex.color.test('color()')).toBe(false);
        });
    });

    describe('namedColors', () => {
        it('should match common color names', () => {
            expect(ColorRegex.namedColors.test('red')).toBe(true);
            expect(ColorRegex.namedColors.test('blue')).toBe(true);
            expect(ColorRegex.namedColors.test('transparent')).toBe(true);
            expect(ColorRegex.namedColors.test('currentColor')).toBe(true);
        });

        it('should match extended color names', () => {
            expect(ColorRegex.namedColors.test('aliceblue')).toBe(true);
            expect(ColorRegex.namedColors.test('lightgoldenrodyellow')).toBe(true);
            expect(ColorRegex.namedColors.test('darkslategray')).toBe(true);
        });

        it('should match CSS keywords', () => {
            expect(ColorRegex.namedColors.test('inherit')).toBe(true);
            expect(ColorRegex.namedColors.test('initial')).toBe(true);
            expect(ColorRegex.namedColors.test('unset')).toBe(true);
            expect(ColorRegex.namedColors.test('revert')).toBe(true);
        });

        it('should not match invalid color names', () => {
            expect(ColorRegex.namedColors.test('notacolor')).toBe(false);
            expect(ColorRegex.namedColors.test('reds')).toBe(false);
            expect(ColorRegex.namedColors.test('Red123')).toBe(false);
        });
    });

    describe('tokenizing patterns', () => {
        describe('WHITESPACE', () => {
            it('should match one or more whitespace characters', () => {
                expect(ColorRegex.WHITESPACE.test(' ')).toBe(true);
                expect(ColorRegex.WHITESPACE.test('   ')).toBe(true);
                expect(ColorRegex.WHITESPACE.test('\t')).toBe(true);
                expect(ColorRegex.WHITESPACE.test('\n')).toBe(true);
                expect(ColorRegex.WHITESPACE.test(' \t\n')).toBe(true);
            });

            it('should not match empty string', () => {
                expect(ColorRegex.WHITESPACE.test('')).toBe(false);
            });
        });

        describe('FUNCTION', () => {
            it('should match color function names', () => {
                expect(ColorRegex.FUNCTION.test('rgb(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('rgba(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hsl(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hsla(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hwb(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hwba(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hsv(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hsva(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('lab(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('lch(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('oklab(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('oklch(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('cmyk(')).toBe(true);
                // Note: 'color' keyword conflicts with other patterns, test with space
                expect(ColorRegex.FUNCTION.test('color (')).toBe(true);
            });

            it('should match with whitespace before parenthesis', () => {
                expect(ColorRegex.FUNCTION.test('rgb (')).toBe(true);
                expect(ColorRegex.FUNCTION.test('hsl  (')).toBe(true);
            });

            it('should be case insensitive', () => {
                expect(ColorRegex.FUNCTION.test('RGB(')).toBe(true);
                expect(ColorRegex.FUNCTION.test('Hsl(')).toBe(true);
            });

            it('should not match without opening parenthesis', () => {
                expect(ColorRegex.FUNCTION.test('rgb')).toBe(false);
                expect(ColorRegex.FUNCTION.test('hsl')).toBe(false);
            });

            it('should not match invalid function names', () => {
                expect(ColorRegex.FUNCTION.test('notafunction(')).toBe(false);
                expect(ColorRegex.FUNCTION.test('red(')).toBe(false);
            });
        });

        describe('HASH', () => {
            it('should match hash symbol', () => {
                expect(ColorRegex.HASH.test('#')).toBe(true);
                expect(ColorRegex.HASH.test('#abc')).toBe(true);
            });

            it('should not match without hash', () => {
                expect(ColorRegex.HASH.test('abc')).toBe(false);
            });
        });

        describe('HEXVALUE', () => {
            it('should match hexadecimal values', () => {
                expect(ColorRegex.HEXVALUE.test('abc')).toBe(true);
                expect(ColorRegex.HEXVALUE.test('123')).toBe(true);
                expect(ColorRegex.HEXVALUE.test('ABC123')).toBe(true);
                expect(ColorRegex.HEXVALUE.test('f0f0f0')).toBe(true);
            });

            it('should be case insensitive', () => {
                expect(ColorRegex.HEXVALUE.test('ABCDEF')).toBe(true);
                expect(ColorRegex.HEXVALUE.test('abcdef')).toBe(true);
            });

            it('should not match non-hex characters', () => {
                expect(ColorRegex.HEXVALUE.test('xyz')).toBe(false);
                expect(ColorRegex.HEXVALUE.test('g')).toBe(false);
            });
        });

        describe('LPAREN', () => {
            it('should match opening parenthesis', () => {
                expect(ColorRegex.LPAREN.test('(')).toBe(true);
                expect(ColorRegex.LPAREN.test('(255')).toBe(true);
            });

            it('should not match closing parenthesis', () => {
                expect(ColorRegex.LPAREN.test(')')).toBe(false);
            });
        });

        describe('NUMBER', () => {
            it('should match integers', () => {
                expect(ColorRegex.NUMBER.test('0')).toBe(true);
                expect(ColorRegex.NUMBER.test('255')).toBe(true);
                expect(ColorRegex.NUMBER.test('100')).toBe(true);
            });

            it('should match decimal numbers', () => {
                expect(ColorRegex.NUMBER.test('0.5')).toBe(true);
                expect(ColorRegex.NUMBER.test('100.25')).toBe(true);
                expect(ColorRegex.NUMBER.test('3.14159')).toBe(true);
            });

            it('should not match negative numbers', () => {
                expect(ColorRegex.NUMBER.test('-5')).toBe(false);
            });

            it('should not match just a decimal point', () => {
                expect(ColorRegex.NUMBER.test('.')).toBe(false);
            });
        });

        describe('COMMA', () => {
            it('should match comma', () => {
                expect(ColorRegex.COMMA.test(',')).toBe(true);
                expect(ColorRegex.COMMA.test(', ')).toBe(true);
            });

            it('should not match other punctuation', () => {
                expect(ColorRegex.COMMA.test('.')).toBe(false);
                expect(ColorRegex.COMMA.test(';')).toBe(false);
            });
        });

        describe('UNITS', () => {
            it('should match CSS length units', () => {
                expect(ColorRegex.UNITS.test('px')).toBe(true);
                expect(ColorRegex.UNITS.test('em')).toBe(true);
                expect(ColorRegex.UNITS.test('rem')).toBe(true);
                expect(ColorRegex.UNITS.test('vh')).toBe(true);
                expect(ColorRegex.UNITS.test('vw')).toBe(true);
                expect(ColorRegex.UNITS.test('vmin')).toBe(true);
                expect(ColorRegex.UNITS.test('vmax')).toBe(true);
                expect(ColorRegex.UNITS.test('cm')).toBe(true);
                expect(ColorRegex.UNITS.test('mm')).toBe(true);
                expect(ColorRegex.UNITS.test('in')).toBe(true);
                expect(ColorRegex.UNITS.test('pt')).toBe(true);
                expect(ColorRegex.UNITS.test('pc')).toBe(true);
                expect(ColorRegex.UNITS.test('ch')).toBe(true);
                expect(ColorRegex.UNITS.test('ex')).toBe(true);
            });

            it('should be case insensitive', () => {
                expect(ColorRegex.UNITS.test('PX')).toBe(true);
                expect(ColorRegex.UNITS.test('Em')).toBe(true);
            });

            it('should not match angle units', () => {
                expect(ColorRegex.UNITS.test('deg')).toBe(false);
                expect(ColorRegex.UNITS.test('rad')).toBe(false);
            });
        });

        describe('PERCENT', () => {
            it('should match percent symbol', () => {
                expect(ColorRegex.PERCENT.test('%')).toBe(true);
                expect(ColorRegex.PERCENT.test('% ')).toBe(true);
            });

            it('should not match without percent', () => {
                expect(ColorRegex.PERCENT.test('50')).toBe(false);
            });
        });

        describe('ANGLE', () => {
            it('should match angle units', () => {
                expect(ColorRegex.ANGLE.test('deg')).toBe(true);
                expect(ColorRegex.ANGLE.test('grad')).toBe(true);
                expect(ColorRegex.ANGLE.test('rad')).toBe(true);
                expect(ColorRegex.ANGLE.test('turn')).toBe(true);
            });

            it('should be case insensitive', () => {
                expect(ColorRegex.ANGLE.test('DEG')).toBe(true);
                expect(ColorRegex.ANGLE.test('Rad')).toBe(true);
            });

            it('should not match length units', () => {
                expect(ColorRegex.ANGLE.test('px')).toBe(false);
                expect(ColorRegex.ANGLE.test('em')).toBe(false);
            });
        });

        describe('SLASH', () => {
            it('should match slash', () => {
                expect(ColorRegex.SLASH.test('/')).toBe(true);
                expect(ColorRegex.SLASH.test('/ ')).toBe(true);
            });

            it('should not match backslash', () => {
                expect(ColorRegex.SLASH.test('\\')).toBe(false);
            });
        });

        describe('RPAREN', () => {
            it('should match closing parenthesis', () => {
                expect(ColorRegex.RPAREN.test(')')).toBe(true);
                expect(ColorRegex.RPAREN.test(') ')).toBe(true);
            });

            it('should not match opening parenthesis', () => {
                expect(ColorRegex.RPAREN.test('(')).toBe(false);
            });
        });
    });

    describe('validation sub-patterns', () => {
        describe('whitespace', () => {
            it('should match whitespace characters', () => {
                expect(ColorRegex.whitespace.test('   ')).toBe(true);
                expect(ColorRegex.whitespace.test('\t')).toBe(true);
                expect(ColorRegex.whitespace.test('\n')).toBe(true);
                expect(ColorRegex.whitespace.test('')).toBe(true);
            });
        });

        describe('number', () => {
            it('should match numbers', () => {
                expect(ColorRegex.number.test('123')).toBe(true);
                expect(ColorRegex.number.test('0')).toBe(true);
                expect(ColorRegex.number.test('999')).toBe(true);
            });

            it('should not match non-numbers', () => {
                expect(ColorRegex.number.test('abc')).toBe(false);
                expect(ColorRegex.number.test('-123')).toBe(false);
            });
        });

        describe('percentage', () => {
            it('should match percentages', () => {
                expect(ColorRegex.percentage.test('50%')).toBe(true);
                expect(ColorRegex.percentage.test('100%')).toBe(true);
                expect(ColorRegex.percentage.test('0%')).toBe(true);
            });

            it('should not match numbers without percent sign', () => {
                expect(ColorRegex.percentage.test('50')).toBe(false);
            });
        });

        describe('numberOrPercent', () => {
            it('should match numbers or percentages', () => {
                expect(ColorRegex.numberOrPercent.test('50')).toBe(true);
                expect(ColorRegex.numberOrPercent.test('50%')).toBe(true);
                expect(ColorRegex.numberOrPercent.test('100')).toBe(true);
            });
        });

        describe('decimal', () => {
            it('should match decimal numbers', () => {
                expect(ColorRegex.decimal.test('0.5')).toBe(true);
                expect(ColorRegex.decimal.test('.5')).toBe(true);
                expect(ColorRegex.decimal.test('0.123')).toBe(true);
            });

            it('should not match non-decimal numbers', () => {
                expect(ColorRegex.decimal.test('5')).toBe(false);
                expect(ColorRegex.decimal.test('1.0.5')).toBe(false);
            });
        });

        describe('units', () => {
            it('should match angle units', () => {
                expect(ColorRegex.units.test('deg')).toBe(true);
                expect(ColorRegex.units.test('rad')).toBe(true);
                expect(ColorRegex.units.test('grad')).toBe(true);
                expect(ColorRegex.units.test('turn')).toBe(true);
                expect(ColorRegex.units.test('')).toBe(true);
            });
        });
    });
});