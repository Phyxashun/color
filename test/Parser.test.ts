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

    describe('Functional Color Parsing', () => {
        it('should parse rgb() with comma-separated values', () => {
            const ast = parse('rgb(255, 0, 128)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('rgb');
            const channels = funcNode.value.value as CommaNode;
            expect(channels.type).toBe(NodeType.comma);
            expect(channels.value.length).toBe(3);
            expect(channels.value[0].value).toBe(255);
            expect(channels.value[2].value).toBe(128);
        });

        it('should parse rgba() with comma-separated values and alpha', () => {
            const ast = parse('rgba(255, 0, 128, 0.5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            const channels = funcNode.value.value as CommaNode;
            console.log("AST:", ast);
            console.log("FUNCNODE:", funcNode);
            console.log("CHANNELS:", channels);

            expect(channels.type).toBe(NodeType.comma);
            expect(channels.value.length).toBe(4);
            expect(channels.alpha).toBeDefined();
            expect(channels.alpha?.value?.value).toBe(0.5);
        });

        it('should parse hsl() with space-separated values and units', () => {
            const ast = parse('hsl(120deg 100% 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hsl');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.type).toBe(NodeType.space);
            expect(channels.value.length).toBe(3);
            expect(channels.value[0]).toMatchObject({ value: 120, units: 'deg' });
            expect(channels.value[1]).toMatchObject({ value: 100, units: '%' });
            expect(channels.value[2]).toMatchObject({ value: 50, units: '%' });
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
    });

    describe('Advanced Functional Color Parsing', () => {
        it('should parse hwb()', () => {
            const ast = parse('hwb(194 0% 0% / .5)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('hwb');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
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

        it('should parse oklab() with alpha', () => {
            const ast = parse('oklab(59.69% 0.11 0.09 / 50%)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('oklab');
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.alpha?.value).toMatchObject({ value: 50, units: '%' });
        });

        it('should parse color() with a color space identifier', () => {
            const ast = parse('color(display-p3 1 0.5 0)');
            const funcNode = (ast.value as ColorNode).value as FunctionNode;
            expect(funcNode.name).toBe('color');
            // The current parser consumes the identifier but doesn't store it.
            // This test just ensures it parses without error.
            const channels = funcNode.value.value as SpaceNode;
            expect(channels.value.length).toBe(3);
            expect(channels.value[0].value).toBe(1);
        });
    });

    describe('Error Handling', () => {
        it('should throw on unexpected token instead of color', () => {
            expect(() => parse('123')).toThrow('Unexpected token: "123", expected HASH or FUNCTION');
        });

        it('should throw on unterminated function', () => {
            expect(() => parse('rgb(255, 0, 0')).toThrow('Unexpected end of input, expected "RPAREN"');
        });

        it('should throw on unexpected token inside a function', () => {
            expect(() => parse('rgb(255 ! 0)')).toThrow('Unexpected token: "!", expected: "RPAREN"');
        });

        it('should throw on missing comma in comma-separated list', () => {
            // Note: This behavior depends on the Tokenizer. Assuming it creates distinct NUMBER tokens.
            expect(() => parse('rgb(255 0, 0)')).toThrow('Unexpected token: "0" (NUMBER), expected: "COMMA"');
        });

        it('should throw on extra comma', () => {
            expect(() => parse('rgb(255,, 0, 0)')).toThrow('Unexpected token: "," (COMMA), expected: "NUMBER"');
        });

        it('should throw if there are too few values', () => {
            expect(() => parse('rgb(255, 0)')).toThrow('Unexpected token: ")" (RPAREN), expected: "COMMA"');
        });

        it('should throw on unexpected end of input', () => {
            expect(() => parse('#')).toThrow('Unexpected end of input, expected "HEXVALUE"');
        });
    });
});