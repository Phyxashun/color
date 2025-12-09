/// <reference types='./types/Parser.d.ts' />
/// <reference types='./types/Tokenizer.d.ts' />

import Tokenizer, { TokenType } from "./Tokenizer.ts";

export const NodeType: NodeType = {
    start: '<start>',
    color: '<color>',
    hex: '<hex-color>',
    function: '<function-color>',
    channels: '<channels-list>',
    space: '<space-list>',
    comma: '<comma-list>',
    value: '<value>',
    alpha: '<alpha>',
} as const;

abstract class BaseNode {
    public abstract value: NodeValue;
    constructor(public type: NodeTypeValue) {
        this.type = type;
    }
    abstract toString(): string;
}

export class Node extends BaseNode {
    constructor(public type: NodeTypeValue, public value: NodeValue) {
        super(type);
        this.value = value;
    }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
}

export default class Parser {
    private tokenizer: Tokenizer;

    constructor(source: string) {
        this.tokenizer = new Tokenizer(source);
    }

    /**
     * Parse a CSS color string into an Abstract Syntax Tree
     * @param string - CSS color string (e.g., "rgb(255, 0, 0)", "#fff", "hsl(120 100% 50%)")
     * @returns AST representing the parsed color
     */
    parse(): StartNode {
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
            toString: () => color.toString(),
        };
    }

    /**
     * <color> ::= <hex-color> | <function-color>
     */
    private Color(): ColorNode {
        let value: HexNode | FunctionNode;

        // Use tokenizer.current() to check the token type.
        const currentToken = this.tokenizer.current();

        if (currentToken.type === TokenType.HASH) {
            value = this.HexColor();
        } else if (currentToken.type === TokenType.FUNCTION) {
            value = this.FunctionColor();
        } else {
            throw new SyntaxError(
                `Unexpected token: "${currentToken.value}", expected HASH or FUNCTION`
            );
        }

        return {
            type: NodeType.color,
            value,
            toString: () => value.toString(),
        };
    }

    /**
     * <hexcolor> ::= HASH HEXVALUE
     */
    private HexColor(): HexNode {
        this.eat(TokenType.HASH);
        const hexValue = this.eat(TokenType.HEXVALUE);

        return {
            type: NodeType.hex,
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
            name: functionToken.value as ColorModel,
            value: channels,
        };
    }

    /**
     * <channels-list> ::= <space-separated-list>
     * <channels-list> ::= <comma-separated-list>
     */
    private ChannelsList(): ChannelsNode {
        let value: SpaceNode | CommaNode;

        // Special handling for color() function with color space identifier
        if (this.tokenizer.current().type === TokenType.IDENTIFIER) {
            // Consume the color space name (e.g., "display-p3", "srgb")
            this.eat(TokenType.IDENTIFIER);
        }

        // Parse the first value
        const firstValue = this.Value();

        if (this.tokenizer.current().type === TokenType.COMMA) {
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
    private SpaceSeparatedListContinuation(firstValue: ValueNode): SpaceNode {
        const secondValue = this.Value();
        const thirdValue = this.Value();

        // Check if there's a 4th value (for CMYK) or alpha channel
        let alpha: AlphaNode | undefined = undefined;

        if (this.tokenizer.current().type === TokenType.SLASH) {
            alpha = this.AlphaChannel();
            return {
                type: NodeType.space,
                value: [firstValue, secondValue, thirdValue],
                alpha,
            };
        } else if (this.tokenizer.current().type === TokenType.NUMBER) {
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
    private CommaSeparatedListContinuation(firstValue: ValueNode): CommaNode {
        this.eat(TokenType.COMMA);
        const secondValue = this.Value();

        this.eat(TokenType.COMMA);
        const thirdValue = this.Value();

        let alpha: AlphaNode | undefined = undefined;

        if (this.tokenizer.current().type === TokenType.COMMA) {
            this.eat(TokenType.COMMA);

            if (this.tokenizer.lookahead().type === TokenType.SLASH) alpha = this.AlphaChannel();

            // Check if we're at the end (CMYK with 4 values)
            if (this.tokenizer.current().type === TokenType.RPAREN || this.tokenizer.current().type === TokenType.EOF) {
                // This is CMYK with 4 values, no alpha
                return {
                    type: NodeType.comma,
                    value: [firstValue, secondValue, thirdValue, alpha] as [ValueNode, ValueNode, ValueNode, ValueNode],
                    alpha: alpha,
                };
            } else {
                // This is alpha channel
                alpha = {
                    type: NodeType.alpha,
                    value: this.AlphaChannel(),
                    valueType: 'number',
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
        let valueType: 'number' | 'percentage' = 'number';

        return {
            type: NodeType.alpha,
            value,
            valueType,
        };
    }

    /**
     * <value> ::= NUMBER
     * <value> ::= NUMBER PERCENT
     * <value> ::= NUMBER ANGLE
     */
    private Value(): ValueNode {
        const numberToken = this.eat(TokenType.NUMBER);
        const numValue = typeof numberToken.value === 'string' ? parseFloat(numberToken.value) : numberToken.value;

        let valueType: 'number' | 'percentage' | 'angle' = 'number';
        let units: '%' | Units | undefined = undefined;

        // Check for percentage
        if (this.tokenizer.current().type === TokenType.PERCENT) {
            this.eat(TokenType.PERCENT);
            valueType = 'percentage';
            units = '%';
        }
        // Check for angle units
        else if (this.tokenizer.current().type === TokenType.UNITS) {
            const unitsToken = this.eat(TokenType.UNITS);
            const unitsValue = unitsToken.value as string;

            if (['deg', 'rad', 'grad', 'turn'].includes(unitsValue)) {
                valueType = 'angle';
                units = unitsValue as Units;
            }
        }

        return {
            type: NodeType.value,
            valueType,
            value: numValue as number,
            units,
        };
    }

    private eat(tokenType: TokenTypeValue): Token {
        const token = this.tokenizer.current();

        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: current token: "${token.value} (${token.type})", expected: "${tokenType}"`
            );
        }

        // Advance the tokenizer to the next token.
        this.tokenizer.consume();
        return token;
    }
}
