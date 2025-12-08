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

export type TokenType = typeof TokenType[keyof typeof TokenType];

export interface Token {
    type: TokenType;
    value: string;
}

export type TokenRules = [TokenType, RegExp];

export const Spec: TokenRules[] = [
    [TokenType.WHITESPACE, /\s+/],
    [TokenType.HEXVALUE, /^#([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})+$/i],
    [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)/i],
    [TokenType.NUMBER, /^-?\d*\.?\d+\b|^-?\d*\.?\d+/],
    [TokenType.UNITS, /(deg|g?rad|turn)+\b/i],
    [TokenType.PERCENT, /[%]+/],
    [TokenType.COMMA, /[,]/],
    [TokenType.SLASH, /[\/]/],
    [TokenType.LPAREN, /[\(]/],
    [TokenType.RPAREN, /[\)]/],
    //[TokenType.IDENTIFIER, /^[a-z][\w-]*/i],
] as const;

export default class Tokenizer {
    private readonly string: string = '';
    private cursor: number = 0;
    tokens: Token[] = [];
    lookahead: Token | null = null;

    constructor(...args: any[]) {
        const [source] = [...args];
        this.string = source;
        console.log("TOKENIZER.SOURCE:", this.string);
        this.reset();
        this.tokens = this.tokenize();

        if (this.tokens) console.log(JSON.stringify(this.tokens, null, 2));
    }

    reset() {
        this.cursor = 0;
    }

    // Has the tokenizer reached the EOF
    isEOF(): boolean {
        return this.cursor >= this.string.length;
    }

    // Determine if there are more tokens
    hasMoreTokens(): boolean {
        return this.cursor <= this.string.length;
    }

    // Obtain the next token
    tokenize(): Token[] {
        let tokens: Token[] = [];
        const string = this.string.slice(this.cursor);

        // Match our token spec to the string
        for (const [tokenType, regexp] of Spec) {
            const tokenValue = this.match(regexp, string);

            // If no match, continue to the next rule in the token spec
            if (tokenValue === null) continue;

            // If the current token is whitespace, skip it
            if (tokenType === TokenType.WHITESPACE) continue;

            // Create a token and return it
            if (tokenType && tokenValue) tokens.push(this.createToken(tokenType, tokenValue));
        }
        tokens.push(this.createToken(TokenType.EOF, 'EOF'));
        if (tokens.length === 1) {
            throw new SyntaxError(`Unexpected token: "${string[0]}" at position ${this.cursor}`);
        }
        return tokens;
    }

    // Matches a token for a regular expression
    private match(regexp: RegExp, string: string): string | null {
        const matched = regexp.exec(string);
        if (matched) {
            this.cursor += matched[0].length;
            return matched[0];
        } else {
            return null;
        }
    }

    // Create a token
    private createToken(tokenType: TokenType, tokenValue: string): Token {
        return {
            type: tokenType,
            value: tokenValue,
        }
    }
} // End Class Tokenizer