import Tokenizer, { TokenType } from "./Tokenizer.ts";
import { type Token } from './Tokenizer.ts';

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

type NodeType = typeof NodeType[keyof typeof NodeType];

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

export default class Parser {
    private readonly string: string = '';
    private tokens: Token[] = [];
    private lookahead: Token | null = null;
    private index: number = 0;

    constructor(source: string) {
        this.string = source;
        this.tokens = new Tokenizer(this.string).tokens;
    }

    get length(): number { return this.tokens.length; }

    isEOF(): boolean {
        return this.index === this.length;
    }

    hasMoreTokens(): boolean {
        return this.index < this.length;
    }

    // Obtain the next token
    getNextToken(): Token | null {
        if (!this.hasMoreTokens()) return null;
        return this.tokens[this.index];
    }

    /**
     * Parse a CSS color string into an Abstract Syntax Tree
     * @param string - CSS color string (e.g., "rgb(255, 0, 0)", "#fff", "hsl(120 100% 50%)")
     * @returns AST representing the parsed color
     */
    parse(): StartNode {
        this.lookahead = this.getNextToken();

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
            // @ts-expect-error
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
        this.lookahead = this.getNextToken();

        return token;
    }
}
