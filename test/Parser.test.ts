// src/test/Parser.test.ts

import { describe, it, expect, vi } from 'vitest';
import Parser, { NodeType } from '../src/Parser.ts';

// Mock the Print module to avoid errors during testing
vi.mock('../src/Print.ts');

describe('Parser', () => {

    // Helper to run the parser and get the result
    const parse = (str: string) => new Parser(str).parse();

    describe('Hex Color Parsing', () => {
        it('should parse a 3-digit hex color', () => {
            const ast = parse('#fff');
            expect(ast.value.type).toBe(NodeType.color);
            const colorNode = ast.value as ColorNode;
            expect(colorNode.value.type).toBe(NodeType.hex);
            const hexNode = colorNode.value as HexNode;
            expect(hexNode.value).toBe('#fff');
            expect(ast.toString()).toBe('#fff');
        });

        it('should parse a 4-digit hex color with alpha', () => {
            const ast = parse('#ffff');
            const hexNode = (ast.value as ColorNode).value as HexNode;
            expect(hexNode.value).toBe('#ffff');
        });

        it('should parse a 6-digit hex color', () => {
            const ast = parse('#ff0000');
            const hexNode = (ast.value as ColorNode).value as HexNode;
            expect(hexNode.value).toBe('#ff0000');
        });

        it('should parse an 8-digit hex color with alpha', () => {
            const ast = parse('#ff000080');
            const hexNode = (ast.value as ColorNode).value as HexNode;
            expect(hexNode.value).toBe('#ff000080');
        });

        it('should throw on invalid hex color length', () => {
            expect(() => parse('#ff')).toThrow(SyntaxError);
            expect(() => parse('#12345')).toThrow(SyntaxError);
        });
    });

    describe('RGB/RGBA Comma-Separated Parsing', () => {
        it('should parse rgb() with comma-separated values', () => {
            const ast = parse('rgb(255, 0, 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('rgb');
            const channels = funcNode.value.value as CommaNode;
            expect(channels.type).toBe(NodeType.comma);
            expect(channels.value.length).toBe(3);
            expect(channels.value[0].value).toBe(255);
            expect(channels.value[1].value).toBe(0);
            expect(channels.value[2].value).toBe(128);
            expect(channels.alpha).toBeUndefined();
        });

        it('should parse rgba() with comma-separated values and numeric alpha', () => {
            const ast = parse('rgba(255, 0, 128, 0.5)');
            const funcNode = (ast.value).value;
            const channels = funcNode.value.value;

            expect(channels.type).toBe(NodeType.comma);
            expect(channels.value.length).toBe(3);
            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(0.5);
            expect(channels.alpha?.valueType).toBe('number');
        });

        it('should parse rgba() with comma-separated values and percentage alpha', () => {
            const ast = parse('rgba(255, 0, 128, 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;

            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(50);
            expect(channels.alpha?.value?.units).toBe('%');
            expect(channels.alpha?.valueType).toBe('percentage');
        });

        it('should parse rgba() with comma-separated and slash alpha', () => {
            const ast = parse('rgba(255, 0, 128, / 0.75)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;

            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(0.75);
        });

        it('should parse rgb() with negative values', () => {
            const ast = parse('rgb(-10, 255, 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(-10);
        });

        it('should parse rgb() with decimal values', () => {
            const ast = parse('rgb(255.5, 128.75, 64.25)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(255.5);
            expect(channels.value[1].value).toBe(128.75);
        });

        it('should parse rgb() with percentage values', () => {
            const ast = parse('rgb(100%, 50%, 25%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(100);
            expect(channels.value[0].units).toBe('%');
            expect(channels.value[1].value).toBe(50);
        });
    });

    describe('RGB/RGBA Space-Separated Parsing', () => {
        it('should parse rgb() with space-separated values', () => {
            const ast = parse('rgb(255 0 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('rgb');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.type).toBe(NodeType.space);
            expect(channels.value.length).toBe(3);
            expect(channels.value[0].value).toBe(255);
            expect(channels.alpha).toBeUndefined();
        });

        it('should parse rgb() with space-separated values and slash alpha', () => {
            const ast = parse('rgb(255 0 128 / 0.5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;

            expect(channels.value.length).toBe(3);
            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(0.5);
        });

        it('should parse rgb() with space-separated values and percentage alpha', () => {
            const ast = parse('rgb(255 0 128 / 75%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;

            expect(channels.alpha?.value?.value).toBe(75);
            expect(channels.alpha?.value?.units).toBe('%');
        });

        it('should parse rgb() with percentage values space-separated', () => {
            const ast = parse('rgb(100% 50% 25%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].units).toBe('%');
        });
    });

    describe('HSL/HSLA Parsing', () => {
        it('should parse hsl() with space-separated values and angle units', () => {
            const ast = parse('hsl(120deg 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hsl');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.type).toBe(NodeType.space);
            expect(channels.value.length).toBe(3);
            expect(channels.value[0]).toMatchObject({ value: 120, units: 'deg', valueType: 'angle' });
            expect(channels.value[1]).toMatchObject({ value: 100, units: '%', valueType: 'percentage' });
            expect(channels.value[2]).toMatchObject({ value: 50, units: '%', valueType: 'percentage' });
        });

        it('should parse hsl() with grad units', () => {
            const ast = parse('hsl(133grad 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].units).toBe('grad');
        });

        it('should parse hsl() with rad units', () => {
            const ast = parse('hsl(2.09rad 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].units).toBe('rad');
        });

        it('should parse hsl() with turn units', () => {
            const ast = parse('hsl(0.33turn 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].units).toBe('turn');
        });

        it('should parse hsl() with space-separated values and alpha', () => {
            const ast = parse('hsl(120 100% 50% / 0.75)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(0.75);
        });

        it('should parse hsl() with percentage alpha', () => {
            const ast = parse('hsl(120 100% 50% / 75%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value).toMatchObject({ value: 75, units: '%' });
        });

        it('should parse hsla() with comma-separated values', () => {
            const ast = parse('hsla(120, 100%, 50%, 0.5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hsla');
            const channels = funcNode.value.value as CommaNode;
            expect(channels.type).toBe(NodeType.comma);
            expect(channels.alpha?.value?.value).toBe(0.5);
        });

        it('should parse hsl() with unitless hue', () => {
            const ast = parse('hsl(120 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(120);
            expect(channels.value[0].valueType).toBe('number');
        });
    });

    describe('Advanced Functional Color Parsing', () => {
        it('should parse hwb() space-separated', () => {
            const ast = parse('hwb(194 0% 0% / .5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hwb');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.alpha?.value?.value).toBe(0.5);
        });

        it('should parse hwba() comma-separated', () => {
            const ast = parse('hwba(194, 0%, 0%, 0.5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hwba');
            const channels = funcNode.value.value as CommaNode;
            expect(channels.alpha?.value?.value).toBe(0.5);
        });

        it('should parse lch()', () => {
            const ast = parse('lch(52.23% 72.2 56.2)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('lch');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.value[0]).toMatchObject({ value: 52.23, units: '%' });
            expect(channels.value[1]).toMatchObject({ value: 72.2 });
        });

        it('should parse oklch()', () => {
            const ast = parse('oklch(0.6 0.15 180)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('oklch');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
        });

        it('should parse lab() with alpha', () => {
            const ast = parse('lab(50% 40 59.5 / 0.8)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('lab');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.alpha?.value?.value).toBe(0.8);
        });

        it('should parse oklab() with alpha', () => {
            const ast = parse('oklab(59.69% 0.11 0.09 / 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('oklab');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.alpha?.value).toMatchObject({ value: 50, units: '%' });
        });

        it('should parse color() with a color space identifier (display-p3)', () => {
            const ast = parse('color(display-p3 1 0.5 0)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('color');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.value[0].value).toBe(1);
        });

        it('should parse color() with srgb color space', () => {
            const ast = parse('color(srgb 0.8 0.4 0.2)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('color');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(0.8);
        });

        it('should parse color() with alpha', () => {
            const ast = parse('color(display-p3 1 0.5 0 / 0.7)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.alpha?.value?.value).toBe(0.7);
        });
    });

    describe('CMYK Parsing', () => {
        it('should parse cmyk() with 4 space-separated values', () => {
            const ast = parse('cmyk(0 0.5 1 0.2)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('cmyk');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(4);
            expect(channels.value[0].value).toBe(0);
            expect(channels.value[1].value).toBe(0.5);
            expect(channels.value[2].value).toBe(1);
            expect(channels.value[3]?.value).toBe(0.2);
            expect(channels.alpha).toBeUndefined();
        });

        it('should parse cmyk() with 4 comma-separated values', () => {
            const ast = parse('cmyk(0, 50%, 100%, 20%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value.length).toBe(4);
            expect(channels.value[1]?.units).toBe('%');
        });

        it('should parse cmyk() with percentage values', () => {
            const ast = parse('cmyk(0% 50% 100% 20%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0]?.units).toBe('%');
            expect(channels.value[1]?.value).toBe(50);
        });
    });

    describe('HSV/HSVA Parsing', () => {
        it('should parse hsv() space-separated', () => {
            const ast = parse('hsv(120 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hsv');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
        });

        it('should parse hsva() with alpha', () => {
            const ast = parse('hsva(120, 100%, 50%, 0.8)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hsva');
            const channels = funcNode.value.value as CommaNode;
            expect(channels.alpha?.value?.value).toBe(0.8);
        });
    });

    describe('Scientific Notation', () => {
        it('should parse numbers with scientific notation', () => {
            const ast = parse('rgb(1e2 2.5e1 3e-1)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(100);
            expect(channels.value[1].value).toBe(25);
            expect(channels.value[2].value).toBe(0.3);
        });

        it('should parse negative exponents', () => {
            const ast = parse('rgb(1.5e-2 2e+1 3e0)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(0.015);
            expect(channels.value[1].value).toBe(20);
            expect(channels.value[2].value).toBe(3);
        });
    });

    describe('toString() Methods', () => {
        it('should call toString() on hex colors', () => {
            const ast = parse('#abc');
            expect(typeof ast.toString()).toBe('string');
            expect(ast.toString()).toBe('#abc');
        });

        it('should call toString() on function colors', () => {
            const ast = parse('rgb(255, 0, 128)');
            const result = ast.toString();
            expect(typeof result).toBe('string');
            expect(result).toContain('rgb');
        });

        it('should call toString() on space-separated channels', () => {
            const ast = parse('hsl(120 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            const result = channels.toString?.();
            expect(typeof result).toBe('string');
        });

        it('should call toString() on comma-separated channels', () => {
            const ast = parse('rgb(255, 0, 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            const result = channels.toString?.();
            expect(typeof result).toBe('string');
        });

        it('should call toString() on values with units', () => {
            const ast = parse('hsl(120deg 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            const value = channels.value[0];
            const result = value.toString?.();
            expect(result).toBe('120deg');
        });

        it('should call toString() on alpha values', () => {
            const ast = parse('rgb(255 0 128 / 0.5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            const alpha = channels.alpha;
            expect(alpha?.toString?.()).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('should throw on unexpected token instead of HEXVALUE or FUNCTION', () => {
            expect(() => parse('123')).toThrow(SyntaxError);
            expect(() => parse('123')).toThrow('expected HEXVALUE or FUNCTION');
        });

        it('should throw on unterminated function', () => {
            expect(() => parse('rgb(255, 0, 0')).toThrow(SyntaxError);
            expect(() => parse('rgb(255, 0, 0')).toThrow('expected: "RPAREN"');
        });

        it('should throw on unexpected character in function', () => {
            expect(() => parse('rgb(255, 0, !)')).toThrow(SyntaxError);
        });

        it('should throw on missing comma in comma-separated list', () => {
            // When parsing 'rgb(255 0, 0)', after consuming 255, it sees a space
            // then tries to parse the next value. It gets '0' but then expects another value
            // for space-separated syntax, which leads to expecting COMMA when it sees ','
            expect(() => parse('rgb(255 0, 0)')).toThrow(SyntaxError);
            // The actual error depends on parser state - just verify it throws
        });

        it('should throw on extra comma at start', () => {
            expect(() => parse('rgb(,255, 0, 0)')).toThrow(SyntaxError);
        });

        it('should throw if there are too few values', () => {
            expect(() => parse('rgb(255, 0)')).toThrow(SyntaxError);
            expect(() => parse('rgb(255, 0)')).toThrow('expected: "COMMA"');
        });

        it('should throw on unexpected end of input', () => {
            expect(() => parse('rgb(')).toThrow(SyntaxError);
        });

        it('should throw when missing values after slash in space-separated', () => {
            expect(() => parse('rgb(255 0 128 /)')).toThrow(SyntaxError);
        });

        it('should throw when using wrong separator mixing', () => {
            expect(() => parse('rgb(255, 0 128)')).toThrow(SyntaxError);
        });

        it('should throw on missing opening parenthesis', () => {
            expect(() => parse('rgb 255, 0, 0)')).toThrow(SyntaxError);
        });

        it('should throw on invalid token type in color position', () => {
            // Parser expects HEXVALUE or FUNCTION, test with KEYWORD token
            expect(() => parse('none')).toThrow(SyntaxError);
        });
    });

    describe('Edge Cases', () => {
        it('should handle whitespace normalization', () => {
            const ast = parse('  rgb(  255  ,  0  ,  128  )  ');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(255);
        });

        it('should handle lowercase function names', () => {
            const ast = parse('RGB(255, 0, 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('rgb');
        });

        it('should handle mixed case hex values', () => {
            const ast = parse('#AbCdEf');
            const hexNode = (ast.value as ColorNode).value as HexNode;
            expect(hexNode.value).toBe('#abcdef');
        });

        it('should parse zero values', () => {
            const ast = parse('rgb(0, 0, 0)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(0);
        });

        it('should parse decimal percentages', () => {
            const ast = parse('rgb(99.9%, 50.5%, 25.1%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(99.9);
        });

        it('should parse negative percentages', () => {
            const ast = parse('rgb(-10%, 50%, 100%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            expect(channels.value[0].value).toBe(-10);
        });

        it('should parse very small decimals', () => {
            const ast = parse('rgb(0.001 0.002 0.003)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(0.001);
        });

        it('should parse angle with decimal degrees', () => {
            const ast = parse('hsl(120.5deg 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value[0].value).toBe(120.5);
        });
    });
});