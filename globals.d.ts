//global.d.ts

declare class Color { }

declare const NamedColors: Record<string, string>;

type HexColorMap = Record<string, HexValue>;

type HexValue = `#${string}`;

type ColorName = keyof typeof NamedColors;

type ColorMap = Record<ColorName, Color>;

type ColorString = {
    get: {
        (color: string): { model: Model; value: number[] } | null;
        rgb: (color: string) => number[] | null;
        hsl: (color: string) => number[] | null;
        hwb: (color: string) => number[] | null;
    };
    to: {
        hex: (r: number, g: number, b: number, a?: number) => string | null;
        rgb: {
            (r: number, g: number, b: number, a?: number): string | null;
            percent: (r: number, g: number, b: number, a?: number) => string | null;
        };
        keyword: (r: number, g: number, b: number, a?: number) => string | null;
        hsl: (h: number, s: number, l: number, a?: number) => string | null;
        hwb: (h: number, w: number, b: number, a?: number) => string | null;
    };
};

interface IColor {
    toString: () => string;
}

type ColorLike = IColor | string | ArrayLike<number> | number | Record<string, any>;
type ColorJson = { model: string; color: number[]; alpha: number };
type ColorObject = { alpha?: number | undefined } & Record<string, number>;

type TokenType =
    | 'HEXVALUE'
    | 'IDENTIFIER'
    | 'NUMBER'
    | 'PERCENTAGE'
    | 'DELIMITER'
    | 'CHAR'
    | 'WHITESPACE';

interface Token {
    type: TokenType;
    value: string;
}

type TColorModel =
    | 'hex'
    | 'rgb'
    | 'rgba'
    | 'hsl'
    | 'hsla'
    | 'hwb'
    | 'hwba'
    | 'lab'
    | 'lch'
    | 'oklab'
    | 'oklch'
    | 'hsv'
    | 'hsva'
    | 'cmyk';

type TColorChannelMap = {
    hex: { value: string };
    rgb: { r: number; g: number; b: number };
    rgba: { r: number; g: number; b: number, alpha: number };
    hsl: { h: number; s: number; l: number };
    hsla: { h: number; s: number; l: number, alpha: number };
    hwb: { h: number; w: number; b: number };
    hwba: { h: number; w: number; b: number, alpha: number };
    lab: { l: number; a: number; b: number, alpha?: number };
    lch: { l: number; c: number; h: number, alpha?: number };
    oklab: { l: number; a: number; b: number, alpha?: number };
    oklch: { l: number; c: number; h: number, alpha?: number };
};

type TModelParsedColor<T extends TColorModel = TColorModel> = { model: T } & TColorChannelMap[T];

// Union of all parsed colors
//type TParsedColor = TModelParsedColor<'hex'>
//    | TModelParsedColor<'rgb'>
//    | TModelParsedColor<'rgba'>
//    | TModelParsedColor<'hsl'>
//    | TModelParsedColor<'hsla'>
//    | TModelParsedColor<'hwb'>
//    | TModelParsedColor<'hwba'>
//    | TModelParsedColor<'lab'>
//    | TModelParsedColor<'lch'>
//    | TModelParsedColor<'oklab'>
//    | TModelParsedColor<'oklch'>;
// Union of all parsed colors ... same as the commented out TParsedColor above
type TParsedColor = TColorModel extends infer M
    ? M extends TColorModel
    ? TModelParsedColor<M>
    : never
    : never;

// Union of all parsed colors ... same as the commented out TParsedColor above, except as an interface
interface IParsedColor extends TParsedColor { }

// A helper utility type to calculate the length of a string literal type T
type LengthOfStringLiteral<T extends string> = T['length'];