type ClassConstructor<T> = new () => T;
type ConstructorFunction = < T >(Ctor: ClassConstructor<T>) => T

type ColorModel =
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
    | 'cmyk'
    | 'color'

type TokenType = {
    FUNCTION: 'FUNCTION',
    IDENTIFIER: 'IDENTIFIER',
    HASH: 'HASH',
    HEXVALUE: 'HEXVALUE',
    NUMBER: 'NUMBER',
    PERCENT: 'PERCENT',
    UNITS: 'UNITS',
    COMMA: 'COMMA',
    SLASH: 'SLASH',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    DELIMITER: 'DELIMITER',
    WHITESPACE: 'WHITESPACE',
    CHAR: 'CHAR',
    EOF: 'EOF'
}

type TokenTypeValue = TokenType[keyof TokenType];

type Units = 'deg' | 'rad' | 'grad' | 'turn';

type HexValue = `#${string}`;
type AngleValue = `${number}${Units}`;
type PercentValue = `${number}%`;
type NumericValue = number | number[];

type TokenValue = string | NumericValue;

type Token = {
    type: TokenTypeValue,
    value: TokenValue,
};

type TokenSpecTuple = [TokenTypeValue, RegExp];

type TokenSpec = Array<TokenSpecTuple>;

declare class Tokenizer {
    private readonly source: string;
    private cursor: number;
    tokens: Token[];

    constructor(...args: any[]);
}

