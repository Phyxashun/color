// globals.d.ts

declare enum TokenType {
    FUNCTION = 'FUNCTION',          // 'rgba', 'rgb', 'hsl', etc.
    IDENTIFIER = 'IDENTIFIER',      // Any word/letter not already captured 
    HEXSTRING = 'HEXSTRING',        // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER = 'NUMBER',              // '127', '120', '80'
    PERCENTAGE = 'PERCENTAGE',      // '80%'
    COMMA = 'COMMA',                // ',' (for older syntax)
    SLASH = 'SLASH',                // '/' (for modern syntax)
    OPEN_PAREN = 'OPEN_PAREN',      // '('
    CLOSE_PAREN = 'CLOSE_PAREN',    // ')'
    DELIMITER = 'DELIMITER',        // Any delimiter not already captured
    WHITESPACE = 'WHITESPACE',      // ' '
    CHAR = 'CHAR',                  // Any single character not already captured
    EOL = 'EOL'                     // End of line/string
}

declare interface Token {
    type: TokenType;
    value: string;
}

declare type HexColor = `#${string}`;
declare type HexColorMap = Record<string, HexColor>;

// Define the basic structure of the AST nodes
interface NumericLiteralNode {
    type: 'numericLiteral';
    value: string; // The raw number string
    unit: string;  // e.g., '%', 'px', or ''
    channel?: 'red' | 'green' | 'blue' | 'alpha'; // Optional semantic label
}

interface OperatorNode {
    type: 'operator';
    value: ',' | '/'; // Comma or Slash separator
}

type ValueNode = NumericLiteralNode | OperatorNode;

interface FunctionNode {
    type: 'function';
    value: 'rgb' | 'rgba'; // Function name
    nodes: ValueNode[]; // Array of arguments/operators
}

type AST = FunctionNode;

type ASTNode = {
    type: string;
    value: string;
    nodes?: ASTNode[]
};

/*
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
*/
