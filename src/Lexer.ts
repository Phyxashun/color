// Recursive Decent Parser

type Specification = [RegExp, string];

const Spec: Specification[] = [
    // ----------------------------------------
    // Functions:

    [/^(rgba?|hsla?|hwba?|lab|lch|oklab|oklch)+\b/i, 'FUNCTION']
]

interface ASTNode {
    type: string;
    value: any;
}

interface Token {
    type: string;
    value: string;
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
    ColorString(): ASTNode {
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
    FunctionNotation(): ASTNode | null {
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