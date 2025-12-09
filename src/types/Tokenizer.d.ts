type ClassConstructor<T> = new () => T;
type ConstructorFunction = <T>(Ctor: ClassConstructor<T>) => T

type TokenType =
    | 'WHITESPACE'
    | 'FUNCTION'
    | 'HASH'
    | 'HEXVALUE'
    | 'LPAREN'
    | 'NUMBER'
    | 'PERCENT'
    | 'UNITS'
    | 'COMMA'
    | 'SLASH'
    | 'RPAREN'
    | 'DELIMITER'
    | 'IDENTIFIER'
    | 'CHAR'
    | 'EOF'

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

type Units = 'deg' | 'rad' | 'grad' | 'turn';

type TokenHexValue = `#${string}`;

type TokenAngleValue = `${number}${Units}`;

type TokenPercentValue = `${number}%`;

type TokenNumericValue = number | number[];

type TokenValue = string | TokenNumericValue;

type Token = {
    type: TokenType,
    value: TokenValue,
};

type TokenSpecTuple = [TokenType, RegExp];

type TokenSpec = TokenSpecTuple[];