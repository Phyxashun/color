//*************************************************************************************************
//*
//* CSS COLOR PARSER - Complete Implementation
//*
//*************************************************************************************************

export const TokenType = {
    WHITESPACE: 'WHITESPACE',
    FUNCTION: 'FUNCTION',
    HASH: 'HASH',
    HEXVALUE: 'HEXVALUE',
    LPAREN: 'LPAREN',
    NUMBER: 'NUMBER',
    COMMA: 'COMMA',
    UNITS: 'UNITS',
    PERCENT: 'PERCENT',
    SLASH: 'SLASH',
    RPAREN: 'RPAREN',
    IDENTIFIER: 'IDENTIFIER',
    EOF: 'EOF'
} as const;

export const NodeType = {
    start: '<start>',
    color: '<color>',
    hexcolor: '<hex-color>',
    function: '<function-color>',
    channels: '<channels-list>',
    space: '<space-separated-list>',
    comma: '<comma-separated-list>',
    value: '<value>',
    alpha: '<alpha-channel>',
    optional_alpha: '<optional-alpha>'
} as const;

export const Spec: TokenRules[] = [
    [TokenType.WHITESPACE, /^\s+/],
    [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)(?=\s*\()/i],
    [TokenType.HASH, /^#/],
    [TokenType.LPAREN, /^\(/],
    [TokenType.RPAREN, /^\)/],
    [TokenType.NUMBER, /^\d+(?:\.\d+)?/],
    [TokenType.COMMA, /^,/],
    [TokenType.UNITS, /^(?:deg|g?rad|turn|px|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/i],
    [TokenType.PERCENT, /^%/],
    [TokenType.SLASH, /^\//],
    [TokenType.IDENTIFIER, /^[a-z][\w-]*/i],
    [TokenType.HEXVALUE, /^[a-f\d]+/i],
] as const;

type TokenType = typeof TokenType[keyof typeof TokenType];
type NodeType = typeof NodeType[keyof typeof NodeType];

interface Token {
    type: TokenType;
    value: string;
}

type HexValue = `#${string}`;

type Units = 'deg' | 'rad' | 'grad' | 'turn';

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

type TokenRules = [TokenType, RegExp];

// AST Node Types
interface StartNode {
    type: '<start>';
    value: ColorNode;
}

interface ColorNode {
    type: '<color>';
    value: HexNode | FunctionNode;
}

interface HexNode {
    type: '<hex-color>';
    value: HexValue;
}

interface FunctionNode {
    type: '<function-color>';
    name: ColorModel;
    value: ChannelsListNode;
}

interface ChannelsListNode {
    type: '<channels-list>';
    value: SpaceSeparatedNode | CommaSeparatedNode;
}

interface SpaceSeparatedNode {
    type: '<space-separated-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
}

interface CommaSeparatedNode {
    type: '<comma-separated-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
}

interface AlphaNode {
    type: '<alpha-channel>' | '<optional-alpha>';
    value: ValueNode;
}

interface ValueNode {
    type: '<value>';
    valueType: 'number' | 'percentage' | 'angle';
    value: number;
    units?: '%' | Units | undefined;
}

export class Parser {
    private string: string;
    private tokenizer: Lexer;
    private lookahead: Token | null = null;

    constructor() {
        this.string = '';
        this.tokenizer = new Lexer();
    }

    /**
     * Parse a CSS color string into an Abstract Syntax Tree
     * @param string - CSS color string (e.g., "rgb(255, 0, 0)", "#fff", "hsl(120 100% 50%)")
     * @returns AST representing the parsed color
     */
    parse(string: string): StartNode {
        this.string = string;
        this.tokenizer.init(this.string);

        // Prime the tokenizer to obtain the first token
        this.lookahead = this.tokenizer.getNextToken();

        // Parse recursively starting from the main entry point
        return this.Start();
    }

    /**
     * <start> ::= <color> EOF
     */
    private Start(): StartNode {
        const color = this.Color();
        this.eat(TokenType.EOF);
        return {
            type: NodeType.start,
            value: color,
        };
    }

    /**
     * <color> ::= <hexcolor>
     * <color> ::= <function-color>
     */
    private Color(): ColorNode {
        let value: HexNode | FunctionNode;

        if (this.lookahead?.type === TokenType.HASH) {
            value = this.HexColor();
        } else if (this.lookahead?.type === TokenType.FUNCTION) {
            value = this.FunctionColor();
        } else {
            throw new SyntaxError(
                `Unexpected token: "${this.lookahead?.value}", expected HASH or FUNCTION`
            );
        }

        return {
            type: NodeType.color,
            value,
        };
    }

    /**
     * <hexcolor> ::= HASH HEXVALUE
     */
    private HexColor(): HexNode {
        this.eat(TokenType.HASH);
        const hexValue = this.eat(TokenType.HEXVALUE);

        return {
            type: NodeType.hexcolor,
            value: `#${hexValue.value}` as HexValue,
        };
    }

    /**
     * <function-color> ::= FUNCTION <channels-list> RPAREN
     */
    private FunctionColor(): FunctionNode {
        const functionToken = this.eat(TokenType.FUNCTION);
        this.eat(TokenType.LPAREN);
        const channels = this.ChannelsList();
        this.eat(TokenType.RPAREN);

        return {
            type: NodeType.function,
            name: functionToken.value.toLowerCase() as ColorModel,
            value: channels,
        };
    }

    /**
     * <channels-list> ::= <space-separated-list>
     * <channels-list> ::= <comma-separated-list>
     */
    private ChannelsList(): ChannelsListNode {
        let value: SpaceSeparatedNode | CommaSeparatedNode;

        // Special handling for color() function with color space identifier
        if (this.lookahead?.type === TokenType.IDENTIFIER) {
            // Consume the color space name (e.g., "display-p3", "srgb")
            this.eat(TokenType.IDENTIFIER);
        }

        // Parse the first value
        const firstValue = this.Value();

        if (this.lookahead?.type === TokenType.COMMA) {
            // Comma-separated list
            value = this.CommaSeparatedListContinuation(firstValue);
        } else {
            // Space-separated list
            value = this.SpaceSeparatedListContinuation(firstValue);
        }

        return {
            type: NodeType.channels,
            value,
        };
    }

    /**
     * <space-separated-list> ::= <value> <value> <value> <alpha-channel>
     * Special case for CMYK: <value> <value> <value> <value>
     */
    private SpaceSeparatedListContinuation(firstValue: ValueNode): SpaceSeparatedNode {
        const secondValue = this.Value();
        const thirdValue = this.Value();

        // Check if there's a 4th value (for CMYK) or alpha channel
        let alpha: AlphaNode | undefined = undefined;

        if (this.lookahead?.type === TokenType.SLASH) {
            alpha = this.AlphaChannel();
            return {
                type: NodeType.space,
                value: [firstValue, secondValue, thirdValue],
                alpha,
            };
        } else if (this.lookahead?.type === TokenType.NUMBER) {
            // CMYK has 4 values
            const fourthValue = this.Value();
            return {
                type: NodeType.space,
                value: [firstValue, secondValue, thirdValue, fourthValue],
                alpha: undefined,
            };
        }

        return {
            type: NodeType.space,
            value: [firstValue, secondValue, thirdValue],
            alpha: undefined,
        };
    }

    /**
     * <comma-separated-list> ::= <value> COMMA <value> COMMA <value> <optional-alpha>
     * Special case for CMYK: <value> COMMA <value> COMMA <value> COMMA <value>
     */
    private CommaSeparatedListContinuation(firstValue: ValueNode): CommaSeparatedNode {
        this.eat(TokenType.COMMA);
        const secondValue = this.Value();
        this.eat(TokenType.COMMA);
        const thirdValue = this.Value();

        let alpha: AlphaNode | undefined = undefined;

        if (this.lookahead?.type === TokenType.COMMA) {
            this.eat(TokenType.COMMA);
            const fourthValueOrAlpha = this.Value();

            // Check if we're at the end (CMYK with 4 values)
            if (this.lookahead?.type === TokenType.RPAREN || this.lookahead?.type === TokenType.EOF) {
                // This is CMYK with 4 values, no alpha
                return {
                    type: NodeType.comma,
                    value: [firstValue, secondValue, thirdValue, fourthValueOrAlpha],
                    alpha: undefined,
                };
            } else {
                // This is alpha channel
                alpha = {
                    type: NodeType.optional_alpha,
                    value: fourthValueOrAlpha,
                };
            }
        }

        return {
            type: NodeType.comma,
            value: [firstValue, secondValue, thirdValue],
            alpha,
        };
    }

    /**
     * <alpha-channel> ::= SLASH <value>
     */
    private AlphaChannel(): AlphaNode {
        this.eat(TokenType.SLASH);
        const value = this.Value();

        return {
            type: NodeType.alpha,
            value,
        };
    }

    /**
     * <value> ::= NUMBER
     * <value> ::= NUMBER PERCENT
     * <value> ::= NUMBER ANGLE
     */
    private Value(): ValueNode {
        const numberToken = this.eat(TokenType.NUMBER);
        const numValue = parseFloat(numberToken.value);

        let valueType: 'number' | 'percentage' | 'angle' = 'number';
        let units: '%' | Units | undefined = undefined;

        // Check for percentage
        if (this.lookahead?.type === TokenType.PERCENT) {
            this.eat(TokenType.PERCENT);
            valueType = 'percentage';
            units = '%';
        }
        // Check for angle units
        else if (this.lookahead?.type === TokenType.UNITS) {
            const unitsToken = this.eat(TokenType.UNITS);
            const unitsValue = unitsToken.value.toLowerCase();

            if (['deg', 'rad', 'grad', 'turn'].includes(unitsValue)) {
                valueType = 'angle';
                units = unitsValue as Units;
            }
        }

        return {
            type: NodeType.value,
            valueType,
            value: numValue,
            units,
        };
    }

    /**
     * Expects a token of a given type and consumes it
     */
    private eat(tokenType: TokenType): Token {
        const token = this.lookahead;

        if (token === null) {
            throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}" (${token.type}), expected: "${tokenType}"`
            );
        }

        // Advance to the next token
        this.lookahead = this.tokenizer.getNextToken();

        return token;
    }
}

export default class Lexer {
    private string: string = '';
    private cursor: number = 0;

    init(string: string) {
        this.string = string;
        this.cursor = 0;
    }

    /**
     * Whether the tokenizer has reached the EOF
     */
    isEOF(): boolean {
        return this.cursor === this.string.length;
    }

    /**
     * Whether we still have more tokens
     */
    hasMoreTokens(): boolean {
        return this.cursor < this.string.length;
    }

    /**
     * Obtains next token
     */
    getNextToken(): Token | null {
        if (!this.hasMoreTokens()) {
            return { type: TokenType.EOF, value: '' };
        }

        const string = this.string.slice(this.cursor);

        for (const [tokenType, regexp] of Spec) {
            const tokenValue = this.match(regexp, string);

            // No match, continue to next rule
            if (tokenValue === null) {
                continue;
            }

            // Skip whitespace tokens
            if (tokenType === TokenType.WHITESPACE) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}" at position ${this.cursor}`);
    }

    /**
     * Matches a token for a regular expression
     */
    private match(regexp: RegExp, string: string): string | null {
        const matched = regexp.exec(string);
        if (matched === null) {
            return null;
        }
        this.cursor += matched[0].length;
        return matched[0];
    }
}