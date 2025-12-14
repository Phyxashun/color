// /src/types/Tokenizer.d.ts

/*
    From espree.js
*/
declare enum NewTokenTypes {
    WHITESPACE = 'WHITESPACE',
    IDENTIFIER = 'IDENTIFIER',
    STRING = 'STRING',
    NUMERIC = 'NUMERIC',
    DELIMITER = 'DELIMITER',
    CHAR = 'CHAR',
    EOF = '<end>',
}

declare enum TokenType {
    FUNCTION = 'FUNCTION',      // Identifier
    NAMEDCOLOR = 'NAMEDCOLOR',  // Identifier
    KEYWORD = 'KEYWORD',        // Identifier
    IDENTIFIER = 'IDENTIFIER',  // Identifier
    HEXVALUE = 'HEXVALUE',      // StringLiteral
    NUMBER = 'NUMBER',          // NumericLiteral
    PERCENT = 'PERCENT',        // NumericLiteral...with units
    ANGLE = 'ANGLE',            // NumericLiteral...with units
    COMMA = 'COMMA',            // Delimiter
    SLASH = 'SLASH',            // Delimiter
    LPAREN = 'LPAREN',          // Delimiter
    RPAREN = 'RPAREN',          // Delimiter
    DELIMITER = 'DELIMITER',    // Delimiter
    WHITESPACE = 'WHITESPACE',  // Whitespace...Ignored
    CHAR = 'CHAR',              // CharacterLiteral...Any single character to already captured
    EOF = 'EOF'               // End of File/Line
}

type TokenNode<T extends TokenType> = { type: T; }

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
    value: string;
}

interface StartEndNode<T extends TokenType> extends TokenNode<T>, TokenValueNode<T> {
    start: number;
    end: number;
}

type Token =
    | TokenNode<TokenType.WHITESPACE>
    | StartEndNode<TokenType.FUNCTION>
    | StartEndNode<TokenType.NAMEDCOLOR>
    | StartEndNode<TokenType.KEYWORD>
    | StartEndNode<TokenType.LPAREN>
    | StartEndNode<TokenType.RPAREN>
    | StartEndNode<TokenType.COMMA>
    | StartEndNode<TokenType.SLASH>
    | StartEndNode<TokenType.ANGLE>
    | StartEndNode<TokenType.PERCENT>
    | StartEndNode<TokenType.NUMBER>
    | StartEndNode<TokenType.HEXVALUE>
    | StartEndNode<TokenType.DELIMITER>
    | StartEndNode<TokenType.CHAR>
    | StartEndNode<TokenType.IDENTIFIER>
    | TokenValueNode<TokenType.EOF>

type TokenSpecTuple = [TokenType, RegExp];
type TokenSpec = TokenSpecTuple[];

declare class Tokenizer {
    private readonly source: string;
    private cursor: number;
    tokens: Token[];
    constructor(...args: any[]);
}