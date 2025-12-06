//*************************************************************************************************
//*
//* Bottom - Up Parsing Process(Shift - Reduce)
//*
//* A bottom - up parser uses a stack and performs "shift"(push token to stack) and 
//* "reduce"(replace a sequence of symbols on the stack with a single non - terminal) 
//* actions.
//*
//*************************************************************************************************
//*
//* CSS COLOR STRING GRAMMAR
//*
//* # Start symbol
//* <start>                 ::=     <color> EOF
//*
//* # Top-level color formats
//* <color>                 ::=     <hexcolor>
//* <color>                 ::=     <function-color>
//* 
//* # Hexadecimal colors
//* <hexcolor>              ::=     HASH HEXVALUE
//* 
//* # Functional notation (rgb/rgba, hsl/hsla, hwb, etc.)
//* <function-color>        ::=     FUNCTION <channels-list> RPAREN
//* 
//* # Channel lists (modern: space separated or legacy: comma separated)
//* <channels-list>         ::=     <space-separated-list>
//* <channels-list>         ::=     <comma-separated-list>
//* 
//* # Space separated channels (modern syntax: r g b / a)
//* <space-separated-list>  ::=     <value> <value> <value> <alpha-channel>
//* <alpha-channel>         ::=     SLASH <value>
//* <alpha-channel>         ::=     # empty (epsilon)
//* 
//* # Comma separated channels (legacy syntax: r, g, b, a)
//* <comma-separated-list>  ::=     <value> COMMA <value> COMMA <value> <optional-alpha>
//* <optional-alpha>        ::=     COMMA <value>
//* <optional-alpha>        ::=     # empty (epsilon)
//* 
//* # Values (numbers, percentages, angles)
//* <value>     ::= NUMBER
//* <value>     ::= PERCENT
//* <value>     ::= ANGLE
//*
//*************************************************************************************************
//*
//* Example Input: rgb(0 0 0 / 1)
//*
//* Tokenize: 
//* FUNCTION(rgb) NUMBER(0) NUMBER(0) NUMBER(0) SLASH NUMBER(1) RPAREN EOF
//*
//* Parse(Shift - Reduce):
//*
//* Stack                               Input                           Action
//* []	                            FUNC NUMBER NUMBER                  Shift
//*                                 NUMBER SLASH NUMBER 
//*                                 RPAREN EOF
//*
//* [FUNC]	                        NUMBER NUMBER NUMBER                Shift
//*                                 SLASH NUMBER 
//*                                 RPAREN EOF
//*
//* [FUNC NUMBER]	                NUMBER NUMBER SLASH                 Shift
//*                                 NUMBER RPAREN EOF	
//*
//* [FUNC NUMBER NUMBER]	        NUMBER SLASH NUMBER                 Shift
//*                                 RPAREN EOF
//*	
//* [FUNC NUMBER NUMBER             SLASH NUMBER RPAREN 	            Shift
//*     NUMBER]	                    EOF
//*
//* [FUNC NUMBER NUMBER             NUMBER RPAREN EOF	                Shift
//*     NUMBER SLASH}
//*
//* [FUNC NUMBER NUMBER             RPAREN EOF	                        Reduce NUMBER 
//*     NUMBER SLASH NUMBER]                                            to <value>
//*	
//* [FUNC NUMBER NUMBER             RPAREN EOF	                        Reduce SLASH <value>
//*     NUMBER SLASH<value>]	                                        to <alpha-channel>
//*
//* [FUNC NUMBER NUMBER             RPAREN EOF	                        Reduce NUMBER to
//*     NUMBER <alpha-channel>]	                                        <value>(multiple steps)
//*
//* [FUNC <value><value>            RPAREN EOF	                        Reduce <value><value>
//*     <value><alpha-channel>] 	                                    <value><alpha-channel> to
//*                                                                     <space-separated-list>
//*
//* [FUNC <space-separated-list>]   RPAREN EOF	                        Shift
//*
//* [FUNC <space-separated-list>    EOF	                                Reduce FUNC <args> RPAREN
//*     RPAREN]	                                                        to <function-color>
//*
//* [<function-color>]	            EOF	                                Reduce <function-color>
//*                                                                     to <color>
//*
//* [<color>]	                    EOF	                                Reduce <color> EOF 
//*                                                                     to <start> (Accept)
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
    UNIT: 'UNIT',
    PERCENT: 'PERCENT',
    ANGLE: 'ANGLE',
    SLASH: 'SLASH',
    RPAREN: 'RPAREN',
    EOF: 'EOF'
} as const;

type TokenType = typeof TokenType[keyof typeof TokenType];

interface Token {
    type: TokenType;
    value: string;
}

export const NodeType = {
    start: '<start>',
    color: '<color>',
    hexcolor: '<hex-color>',
    function: '<function-color>',
    channels: '<channels-list>',
    space: '<space-separated-list>',
    comma: '<comma-separated-list>',
    value: '<value>',
    number: '<number>',
    percentage: '<percentage>',
    angle: '<angle>',
    alpha: '<alpha-channel>',
    optional_alpha: '<optional-alpha>'
} as const;

type NodeType = typeof NodeType[keyof typeof NodeType];

type Node =
    | StartNode
    | ColorNode
    | HexNode
    | FunctionNode
    | ChannelsListNode
    | SpaceSeparatedNode
    | CommaSeparatedNode
    | AlphaNode
    | ValueNode

type StartNode = {
    type: '<start>';
    value: ColorNode;
}

type ColorNode = {
    type: '<color>';
    value: HexNode | FunctionNode;
}

type HexValue = `#${string}`;

type HexNode = {
    type: '<hex-color>';
    value: HexValue;
}

type FunctionNode = {
    type: '<function-color>';
    name: ColorModel;
    value: ChannelsListNode;
}

type ChannelsListNode = {
    type: '<channels-list>';
    value: SpaceSeparatedNode | CommaSeparatedNode;
}

type SpaceSeparatedNode = {
    type: '<space-separated-list>';
    value: [ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode;
}

type CommaSeparatedNode = {
    type: '<comma-separated-list>';
    value: [ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode;
}

type AlphaNode = {
    type: '<alpha-channel>' | '<optional-alpha>';
    value: ValueNode | null;
}

type ValueNode = {
    type: '<value>';
} & NumericValue;

type Units = 'deg' | 'rad' | 'grad' | 'turn';

type NumericValue =
    | { name: '<number>'; value: number; }
    | { name: '<percentage>'; value: number; units: '%'; }
    | { name: '<angle>'; value: number; units: Units; }

type ColorModel =
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
    | 'cmyk'

type LexerRule = [RegExp, TokenType];

const Spec: LexerRule[] = [
    // ----------------------------------------
    // Functions:

    [/^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk)\b/i, TokenType.FUNCTION]
]

export class Parser {
    private string: string;
    private tokenizer: Lexer;
    private lookahead: Token | null = null;

    constructor() {
        this.string = '';
        this.tokenizer = new Lexer();
    }
    /**
     * Parse a string into an Abstract Syntax Tree
     */
    parse(string: string) {
        this.string = string;
        this.tokenizer.init(this.string);

        // Prime the tokenizer to obtain the first
        // token which is out lookahead. The lookahead is
        // used for predictive parsing.

        this.lookahead = this.tokenizer.getNextToken();

        // Parse recursively starting from the
        // main entry point, ColorString:

        return this.ColorString();
    }

    /**
     * Main entry point.
     * 
     * ColorString
     *      : FunctionNotation
     *      ;
     */
    ColorString(): Node {
        return {
            type: 'ColorString',
            value: this.FunctionNotation()
        };
    }

    /**
     * FunctionNotation
     *      : STRING
     *      ;
     */
    FunctionNotation(): Node | null {
        const token = this.eat('FUNCTION');
        if (token === null) return null;
        return {
            type: 'FunctionNotation',
            value: token.value,
        }
    }

    /**
     * Expects a token of a given type.
     */
    eat(tokenType: string): Token | null {
        const token = this.lookahead;

        if (token === null) {
            return null; // TEMP
            //throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected: "${tokenType}"`)
        }

        // Advance to the next token.
        this.lookahead = this.tokenizer.getNextToken();

        return token;
    }
}

export default class Lexer {
    private string: string = '';
    private cursor: number = 0;
    //spec: Specification;

    init(string: string) {
        this.string = string;
        this.cursor = 0;
    }

    /**
     * Whether the tokenizer has reached the EOF.
     */
    isEOF() {
        return this.cursor === this.string.length;
    }

    /**
     * Whether we still have more tokens
     */
    hasMoreTokens(): boolean {
        return this.cursor < this.string.length;
    }

    /**
     * Obtains next token.
     */
    getNextToken(): Token | null {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this.string.slice(this.cursor);

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this.match(regexp, string);

            // No match
            if (tokenValue === null) {
                continue;
            }

            return {
                type: tokenType,
                value: tokenValue,
            };
        }
        return null; // throw new SyntaxError(`Unexpected token: "${string[0]}"`);
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
        return matched[0]
    }
}