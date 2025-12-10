// /src/types/Tokenizer.d.ts

declare enum TokenType {
    FUNCTION = 'FUNCTION',
    NAMEDCOLOR = 'NAMEDCOLOR',
    KEYWORD = 'KEYWORD',
    IDENTIFIER = 'IDENTIFIER',
    HEXVALUE = 'HEXVALUE',
    NUMBER = 'NUMBER',
    PERCENT = 'PERCENT',
    UNITS = 'UNITS',
    COMMA = 'COMMA',
    SLASH = 'SLASH',
    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',
    DELIMITER = 'DELIMITER',
    WHITESPACE = 'WHITESPACE',
    CHAR = 'CHAR',
    EOF = 'EOF'
}

interface TokenNode<T extends TokenType> {
    type: T;
}

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
    value: string;
}

type Token =
    | TokenNode<TokenType.WHITESPACE>
    | TokenValueNode<TokenType.FUNCTION>
    | TokenValueNode<TokenType.NAMEDCOLOR>
    | TokenValueNode<TokenType.KEYWORD>
    | TokenNode<TokenType.LPAREN>
    | TokenNode<TokenType.RPAREN>
    | TokenNode<TokenType.COMMA>
    | TokenNode<TokenType.SLASH>
    | TokenValueNode<TokenType.UNITS>
    | TokenValueNode<TokenType.PERCENT>
    | TokenValueNode<TokenType.NUMBER>
    | TokenValueNode<TokenType.HEXVALUE>
    | TokenValueNode<TokenType.DELIMITER>
    | TokenValueNode<TokenType.CHAR>
    | TokenValueNode<TokenType.IDENTIFIER>
    | TokenNode<TokenType.EOF>

type TokenSpecTuple = [TokenType, RegExp];

type TokenSpec = TokenSpecTuple[];

declare class Tokenizer {
    private readonly source: string;
    private cursor: number;
    tokens: Token[];
    constructor(...args: any[]);
}
