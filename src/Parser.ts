/// <reference types='./types/Parser.d.ts' />
/// <reference types='./types/Tokenizer.d.ts' />
// /src/Parser.ts

import Tokenizer, { TokenType } from "./Tokenizer.ts";

export enum NodeType {
    start = '<start>',
    color = '<color>',
    hex = '<hex-color>',
    function = '<function-color>',
    channels = '<channels-list>',
    space = '<space-list>',
    comma = '<comma-list>',
    value = '<value>',
    alpha = '<alpha>',
}

type RHS = readonly (TokenType | NodeType)[];
type GrammarRule = readonly [NodeType, RHS];

export const NodeSpec: readonly GrammarRule[] = [
    // <start> ::= <color> EOF
    [NodeType.start, [NodeType.color, TokenType.EOF]],

    // <color> ::= <hex-color>
    [NodeType.color, [NodeType.hex]],

    // <color> ::= <function-color>
    [NodeType.color, [NodeType.function]],

    // <hex-color> - Fixed to use HEXVALUE instead of HASH
    [NodeType.hex, [TokenType.HEXVALUE]],

    // <function-color> ::= FUNCTION '(' <channels> ')'
    [NodeType.function, [TokenType.FUNCTION, TokenType.LPAREN, NodeType.channels, TokenType.RPAREN]],

    // channels: space-list OR comma-list
    [NodeType.channels, [NodeType.space]],
    [NodeType.channels, [NodeType.comma]],

    // <space-list> ::= value value value
    [NodeType.space, [NodeType.value, NodeType.value, NodeType.value]],

    // <space-list> ::= value value value alpha
    [NodeType.space, [NodeType.value, NodeType.value, NodeType.value, NodeType.alpha]],

    // <comma-list> ::= value , value , value
    [NodeType.comma, [NodeType.value, TokenType.COMMA, NodeType.value, TokenType.COMMA, NodeType.value]],

    // <comma-list> ::= value , value , value alpha
    [NodeType.comma, [NodeType.value, TokenType.COMMA, NodeType.value, TokenType.COMMA, NodeType.value, NodeType.alpha]],

    // alpha ::= '/' value
    [NodeType.alpha, [TokenType.SLASH, NodeType.value]],
    // alpha ::= ',' value
    [NodeType.alpha, [TokenType.COMMA, NodeType.value]],

    // <value> ::= percentage
    [NodeType.value, [TokenType.PERCENT]],

    // <value> ::= number units
    [NodeType.value, [TokenType.NUMBER, TokenType.UNITS]],

    // <value> ::= number
    [NodeType.value, [TokenType.NUMBER]],
] as const;

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

        const currentToken = this.tokenizer.current();

        // Fixed: Check for HEXVALUE instead of HASH
        if (currentToken.type === TokenType.HEXVALUE) {
            value = this.HexColor();
        } else if (currentToken.type === TokenType.FUNCTION) {
            value = this.FunctionColor();
        } else {
            const tokenValue = 'value' in currentToken ? currentToken.value : currentToken.type;
            throw new SyntaxError(
                `Unexpected token: "${tokenValue}", expected HEXVALUE or FUNCTION`
            );
        }

        return {
            type: NodeType.color,
            value,
            toString: () => value.toString(),
        };
    }

    /**
     * <hexcolor> ::= HEXVALUE
     */
    private HexColor(): HexNode {
        const hexToken = this.eat(TokenType.HEXVALUE);

        // Type guard: HEXVALUE tokens always have a value property
        if (!('value' in hexToken)) {
            throw new Error('Internal error: HEXVALUE token missing value');
        }

        return {
            type: NodeType.hex,
            value: hexToken.value as HexValue,
            toString: () => hexToken.value,
        };
    }

    /**
     * <function-color> ::= FUNCTION LPAREN <channels> RPAREN
     */
    private FunctionColor(): FunctionNode {
        const functionToken = this.eat(TokenType.FUNCTION);

        // Type guard: FUNCTION tokens always have a value property
        if (!('value' in functionToken)) {
            throw new Error('Internal error: FUNCTION token missing value');
        }

        this.eat(TokenType.LPAREN);
        const channels = this.ChannelsList();
        this.eat(TokenType.RPAREN);

        return {
            type: NodeType.function,
            name: functionToken.value as ColorModel,
            value: channels,
            toString: () => `${functionToken.value}(${channels.toString()})`,
        };
    }

    /**
     * <channels-list> ::= <space-separated-list> | <comma-separated-list>
     */
    private ChannelsList(): ChannelsNode {
        let value: SpaceNode | CommaNode;

        // Special handling for color() function with color space identifier
        // Accept both IDENTIFIER and KEYWORD tokens (like 'display-p3')
        if (this.tokenizer.current().type === TokenType.IDENTIFIER ||
            this.tokenizer.current().type === TokenType.KEYWORD) {
            this.tokenizer.consume();
        }

        // Parse the first value
        const firstValue = this.Value();

        if (this.tokenizer.current().type === TokenType.COMMA) {
            value = this.CommaSeparatedListContinuation(firstValue);
        } else {
            value = this.SpaceSeparatedListContinuation(firstValue);
        }

        return {
            type: NodeType.channels,
            value,
            toString: () => value.toString(),
        };
    }

    /**
     * <space-separated-list> ::= <value> <value> <value> [<alpha-channel>]
     */
    private SpaceSeparatedListContinuation(firstValue: ValueNode): SpaceNode {
        const secondValue = this.Value();
        const thirdValue = this.Value();

        let alpha: AlphaNode | undefined = undefined;

        if (this.tokenizer.current().type === TokenType.SLASH) {
            alpha = this.AlphaChannel();
            return {
                type: NodeType.space,
                value: [firstValue, secondValue, thirdValue],
                alpha,
                toString: () => {
                    const vals = [firstValue, secondValue, thirdValue]
                        .map(v => v.toString?.() || String(v.value))
                        .join(' ');
                    return alpha ? `${vals} / ${alpha.toString?.() || String(alpha.value)}` : vals;
                },
            };
        } else if (
            this.tokenizer.current().type === TokenType.NUMBER ||
            this.tokenizer.current().type === TokenType.PERCENT
        ) {
            // CMYK has 4 values
            const fourthValue = this.Value();
            return {
                type: NodeType.space,
                value: [firstValue, secondValue, thirdValue, fourthValue],
                alpha: undefined,
                toString: () => [firstValue, secondValue, thirdValue, fourthValue]
                    .map(v => v.toString?.() || String(v.value))
                    .join(' '),
            };
        }

        return {
            type: NodeType.space,
            value: [firstValue, secondValue, thirdValue],
            alpha: undefined,
            toString: () => [firstValue, secondValue, thirdValue]
                .map(v => v.toString?.() || String(v.value))
                .join(' '),
        };
    }

    /**
     * <comma-separated-list> ::= <value> COMMA <value> COMMA <value> [<alpha>]
     */
    private CommaSeparatedListContinuation(firstValue: ValueNode): CommaNode {
        this.eat(TokenType.COMMA);
        const secondValue = this.Value();

        this.eat(TokenType.COMMA);
        const thirdValue = this.Value();

        let alpha: AlphaNode | undefined = undefined;
        let fourthValue: ValueNode | undefined = undefined;

        if (this.tokenizer.current().type === TokenType.COMMA) {
            this.eat(TokenType.COMMA);

            // Check if next is alpha (slash) or fourth value
            if (this.tokenizer.current().type === TokenType.SLASH) {
                alpha = this.AlphaChannel();
            } else if (
                this.tokenizer.current().type === TokenType.NUMBER ||
                this.tokenizer.current().type === TokenType.PERCENT
            ) {
                fourthValue = this.Value();
            }
        }

        if (fourthValue) {
            return {
                type: NodeType.comma,
                value: [firstValue, secondValue, thirdValue, fourthValue],
                alpha: undefined,
                toString: () => [firstValue, secondValue, thirdValue, fourthValue]
                    .map(v => v.toString?.() || String(v.value))
                    .join(', '),
            };
        }

        return {
            type: NodeType.comma,
            value: [firstValue, secondValue, thirdValue],
            alpha,
            toString: () => {
                const vals = [firstValue, secondValue, thirdValue]
                    .map(v => v.toString?.() || String(v.value))
                    .join(', ');
                return alpha ? `${vals}, ${alpha.toString?.() || String(alpha.value)}` : vals;
            },
        };
    }

    /**
     * <alpha-channel> ::= SLASH <value>
     */
    private AlphaChannel(): AlphaNode {
        this.eat(TokenType.SLASH);
        const value = this.Value();

        // Alpha channels can only be 'number' or 'percentage', not 'angle'
        const valueType = value.valueType === 'angle' ? 'number' : (value.valueType || 'number');

        return {
            type: NodeType.alpha,
            value,
            valueType: valueType as 'number' | 'percentage',
            toString: () => value.toString?.() || String(value.value),
        };
    }

    /**
     * <value> ::= NUMBER | PERCENT | NUMBER UNITS
     */
    private Value(): ValueNode {
        const tok = this.tokenizer.current();

        // percentage
        if (tok.type === TokenType.PERCENT) {
            const t = this.eat(TokenType.PERCENT);

            // Type guard: PERCENT tokens always have a value property
            if (!('value' in t)) {
                throw new Error('Internal error: PERCENT token missing value');
            }

            return {
                type: NodeType.value,
                valueType: 'percentage',
                value: parseFloat(t.value),
                units: '%',
                toString: () => `${parseFloat(t.value)}%`,
            };
        }

        // number-based value
        const numTok = this.eat(TokenType.NUMBER);

        // Type guard: NUMBER tokens always have a value property
        if (!('value' in numTok)) {
            throw new Error('Internal error: NUMBER token missing value');
        }

        const num = parseFloat(numTok.value);

        // angle unit?
        if (this.tokenizer.current().type === TokenType.UNITS) {
            const unitTok = this.eat(TokenType.UNITS);

            // Type guard: UNITS tokens always have a value property
            if (!('value' in unitTok)) {
                throw new Error('Internal error: UNITS token missing value');
            }

            const u = unitTok.value as Units;
            return {
                type: NodeType.value,
                valueType: 'angle',
                value: num,
                units: u,
                toString: () => `${num}${u}`,
            };
        }

        return {
            type: NodeType.value,
            valueType: 'number',
            value: num,
            toString: () => String(num),
        };
    }

    private eat(tokenType: TokenType): Token {
        const token = this.tokenizer.current();

        if (token.type !== tokenType) {
            const tokenValue = 'value' in token ? token.value : token.type;
            throw new SyntaxError(
                `Unexpected token: current token: "${tokenValue} (${token.type})", expected: "${tokenType}"`
            );
        }

        this.tokenizer.consume();
        return token;
    }
}