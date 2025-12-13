//// <reference types='./types/Parser.d.ts' />
/// <reference types='./types/Tokenizer.d.ts' />
// /src/Parser.ts

import Tokenizer, { TokenType } from "./Tokenizer.ts";
import { Print } from './Print.ts';

export const parsePercent = (percentString: string): number => {
    // Regex to find a sequence of digits and optional decimal point
    const match = percentString.match(/(-?[\d.]+)/);

    if (match && match[1]) {
        // The captured group match[1] is the number string (e.g., '50')
        return parseFloat(match[1]);
    }

    // Throw an error if the format is invalid
    throw new SyntaxError(`parsePercent(): Invalid input: ${percentString}.`)
}

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

export const NodeSpec: NodeSpec = [
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
        Print.add('1. Parser - Constructor()');
        Print.add('1.A. Constructor source:', source);
        this.tokenizer = new Tokenizer(source);
    }

    /**
     * Parse a CSS color string into an Abstract Syntax Tree
     * @param string - CSS color string (e.g., "rgb(255, 0, 0)", "#fff", "hsl(120 100% 50%)")
     * @returns AST representing the parsed color
     */
    parse(source?: string): ASTNode {
        Print.add('2. Parser - parse()');
        if (source) {
            Print.add('2.A. parse() source:', source);
            this.tokenizer = new Tokenizer(source);
        }

        const AST: ASTNode = this.Start();

        Print(); // Output log to console

        return AST;
    }

    // <start> ::= <color> EOF
    private Start(): ASTNode {
        const color = this.Color();
        this.consume(TokenType.EOF);
        return {
            type: NodeType.start,
            name: NodeType.start,
            children: color,
        };
    }

    // <color> ::= <hex-color> | <function-color>
    private Color(): ASTNode {
        const currentToken = this.tokenizer.current();

        if (currentToken.type === TokenType.HEXVALUE) {
            return {
                type: NodeType.color,
                name: NodeType.hex,
                children: this.HexColor(),
            };
        }

        if (currentToken.type === TokenType.FUNCTION) {
            return {
                type: NodeType.color,
                name: NodeType.color,
                children: this.FunctionColor(),
            };
        }

        const tokenValue = JSON.stringify(currentToken, null, 2);
        throw new SyntaxError(
            `Unexpected token:\n"${tokenValue}"\nExpected a HEXVALUE or a FUNCTION.`
        );
    }

    // <hexcolor> ::= HEXVALUE
    private HexColor(): ASTNode {
        const hexToken = this.consume(TokenType.HEXVALUE);

        // Type guard: HEXVALUE tokens always have a value property
        if (!('value' in hexToken)) {
            throw new Error('Internal error: HEXVALUE token missing value');
        }

        return {
            type: NodeType.hex,
            name: TokenType.HEXVALUE,
            value: hexToken.value as HexValue,
            toString: () => hexToken.value,
        };
    }

    // <function-color> ::= FUNCTION LPAREN <channels> RPAREN
    private FunctionColor(): ASTNode {

        const functionToken = this.consume(TokenType.FUNCTION);

        // Type guard: FUNCTION tokens always have a value property
        if (!('value' in functionToken)) {
            throw new Error('Internal error: FUNCTION token missing value');
        }

        this.consume(TokenType.LPAREN);

        const channels = this.ChannelsList();

        this.consume(TokenType.RPAREN);

        return {
            type: NodeType.function,
            name: functionToken.value as ColorModel,
            children: channels,
            toString: () => `${functionToken.value}(${channels.toString()})`,
        };
    }

    // <channels-list> ::= <space-separated-list> | <comma-separated-list>
    private ChannelsList(): ASTNode {
        const tokenType = this.tokenizer.current().type;

        let children: ASTNode; //* <-- MIGHT WANT TO CONSIDER ASTNode[] !!! */

        // Special handling for color() function with color space identifier
        // Accept both IDENTIFIER and KEYWORD tokens (like 'display-p3')
        if (tokenType === TokenType.IDENTIFIER || tokenType === TokenType.KEYWORD) {
            this.tokenizer.consume();
        }

        // Parse the first value
        const firstChannel = this.Value();

        if (tokenType === TokenType.COMMA) {
            children = this.CommaList(firstChannel);
            return {
                type: NodeType.channels,
                name: NodeType.comma,
                children: children,
                toString: () => children.toString(),
            };
        } else {
            children = this.SpaceList(firstChannel);
            return {
                type: NodeType.channels,
                name: NodeType.space,
                children: children,
                toString: () => children.toString(),
            };
        }
    }

    // <space-separated-list> ::= <value> <value> <value> [<alpha-channel>]
    private SpaceList(firstChannel: ASTNode): ASTNode {
        const tokenType = this.tokenizer.current().type;

        const secondChannel = this.Value();
        const thirdChannel = this.Value();

        if (
            tokenType === TokenType.SLASH ||
            tokenType === TokenType.NUMBER ||
            tokenType === TokenType.PERCENT
        ) {
            const alpha = this.AlphaChannel();
            return {
                type: NodeType.space,
                name: NodeType.alpha,
                children: [firstChannel, secondChannel, thirdChannel],
                alpha: alpha,
                toString: () => {
                    const vals = [firstChannel, secondChannel, thirdChannel]
                        .map(v => v.toString?.() || String(v.value))
                        .join(' ');
                    return alpha ? `${vals} / ${alpha.toString?.() || String(alpha.value)}` : vals;
                },
            };
        }

        return {
            type: NodeType.space,
            name: NodeType.channels,
            children: [firstChannel, secondChannel, thirdChannel],
            toString: () => [firstChannel, secondChannel, thirdChannel]
                .map(v => v.toString?.() || String(v.value))
                .join(' '),
        };
    }

    // <comma-separated-list> ::= <value> COMMA <value> COMMA <value> [<alpha>]
    private CommaList(firstChannel: ASTNode): ASTNode {
        const tokenType = this.tokenizer.current().type;

        this.consume(TokenType.COMMA);
        const secondChannel = this.Value();

        this.consume(TokenType.COMMA);
        const thirdChannel = this.Value();

        if (
            tokenType === TokenType.COMMA ||
            tokenType === TokenType.NUMBER ||
            tokenType === TokenType.PERCENT
        ) {
            const alpha = this.AlphaChannel();
            return {
                type: NodeType.comma,
                name: NodeType.alpha,
                children: [firstChannel, secondChannel, thirdChannel, alpha],
                alpha: alpha,
                toString: () => [firstChannel, secondChannel, thirdChannel, alpha]
                    .map(v => v.toString?.() || String(v.value))
                    .join(', '),
            };
        }

        return {
            type: NodeType.comma,
            name: NodeType.channels,
            children: [firstChannel, secondChannel, thirdChannel],
            toString: () => {
                return [firstChannel, secondChannel, thirdChannel]
                    .map(v => v.toString?.() || String(v.value))
                    .join(', ');
            },
        };
    }

    // <alpha-channel> ::= SLASH <value>
    private AlphaChannel(): ASTNode {
        const tokenType = this.tokenizer.current().type;

        if (tokenType === TokenType.SLASH) {
            this.consume(TokenType.SLASH);
        }

        if (tokenType === TokenType.COMMA) {
            this.consume(TokenType.COMMA);
        }

        const valueNode = this.Value();

        // Type guard
        const alphaValue = (valueNode.value)
            ? (typeof valueNode.value === 'number')
                ? valueNode.value
                : parseFloat(valueNode.value)
            : 0.0;

        return {
            type: NodeType.alpha,
            name: NodeType.alpha,
            children: valueNode,
            value: alphaValue,
            toString: () => valueNode.toString() || String(alphaValue),
        };
    }

    //<value> ::= NUMBER | PERCENT | NUMBER UNITS
    private Value(): ASTNode {
        const tokenType = this.tokenizer.current().type;

        // Percentage
        if (tokenType === TokenType.PERCENT) {
            const percentToken = this.consume(TokenType.PERCENT);

            // Type guard: PERCENT tokens always have a value property
            if (!('value' in percentToken)) {
                throw new Error('Internal error: PERCENT token missing value');
            }

            const percentValue = parsePercent(percentToken.value) as number;

            return {
                type: NodeType.value,
                name: TokenType.PERCENT,
                value: percentValue,
                units: '%',
                toString: () => `${parseFloat(percentToken.value)}%`,
            };
        }

        // angle unit?
        if (tokenType === TokenType.UNITS) {
            const unitToken = this.consume(TokenType.UNITS);

            // Type guard: UNITS tokens always have a value property
            if (!('value' in unitToken)) {
                throw new Error('Internal error: UNITS token missing value');
            }

            return {
                type: NodeType.value,
                name: TokenType.UNITS,
                value: parseFloat(unitToken.value),
                units: unitToken.value,
                toString: () => `${numberValue}${unitToken.value}`,
            };
        }

        // number-based value -> (tokenType === TokenType.NUMBER)
        const numberToken = this.consume(TokenType.NUMBER);

        // Type guard: NUMBER tokens always have a value property
        if (!('value' in numberToken)) {
            throw new Error('Internal error: NUMBER token missing value');
        }

        const numberValue = parseFloat(numberToken.value);

        return {
            type: NodeType.value,
            name: TokenType.NUMBER,
            value: numberValue,
            toString: () => String(numberValue),
        };
    }

    // Consume a token
    private consume(tokenType: TokenType): Token {
        const currentToken = this.tokenizer.current();

        if (currentToken.type === tokenType) {
            this.tokenizer.consume();
            return currentToken;
        }

        const tokenValue = JSON.stringify(currentToken, null, 2);
        throw new SyntaxError(
            `Unexpected token: current token:\n"${tokenValue}"\nExpected: "${tokenType}"`
        );
    }
}