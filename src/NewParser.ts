// /src/NewParser.ts

/**
# CSS Color String Grammar
#--------------------------------------
# EXAMPLE: 'rgba(100, 255, 50, 0.5)'
#--------------------------------------
* TOKENS:
#--------------------------------------
# type: FUNCTION    value:  'rgba'
# type: LPAREN
# type: NUMBER      value:  '100'
# type: COMMA
# type: NUMBER      value:  '255'
# type: COMMA
# type: NUMBER      value:  '50'
# type: COMMA
# type: NUMBER      value:  '0.5'
# type: LPAREN
# type: EOF
#--------------------------------------
CONSIDER: From espree.js:

// Esprima Token Types
const Token = {
    Boolean: "Boolean",
    EOF: "<end>",
    Identifier: "Identifier",
    PrivateIdentifier: "PrivateIdentifier",
    Keyword: "Keyword",
    Null: "Null",
    Numeric: "Numeric",
    Punctuator: "Punctuator",
    String: "String",
    RegularExpression: "RegularExpression",
    Template: "Template",
    JSXIdentifier: "JSXIdentifier",
    JSXText: "JSXText"
};

Token { type: 'Identifier', value: 'rgba', start: 0, end: 4 }
Token { type: 'Punctuator', value: '(', start: 4, end: 5 }
Token { type: 'Numeric', value: '100', start: 5, end: 8 }
Token { type: 'Punctuator', value: ',', start: 8, end: 9 }
Token { type: 'Numeric', value: '255', start: 10, end: 13 }
Token { type: 'Punctuator', value: ',', start: 13, end: 14 }
Token { type: 'Numeric', value: '50', start: 15, end: 17 }
Token { type: 'Punctuator', value: ',', start: 17, end: 18 }
Token { type: 'Numeric', value: '0.5', start: 19, end: 22 }
Token { type: 'Punctuator', value: ')', start: 22, end: 23 }


CONSIDER: From acorn.js:

Token {
  type: TokenType {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: [Function (anonymous)]
  },
  value: 'rgba',
  start: 0,
  end: 4
}
Token {
  type: TokenType {
    label: '(',
    keyword: undefined,
    beforeExpr: true,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: [Function (anonymous)]
  },
  value: undefined,
  start: 4,
  end: 5
}
Token {
  type: TokenType {
    label: 'num',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: 100,
  start: 5,
  end: 8
}
Token {
  type: TokenType {
    label: ',',
    keyword: undefined,
    beforeExpr: true,
    startsExpr: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: undefined,
  start: 8,
  end: 9
}
Token {
  type: TokenType {
    label: 'num',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: 255,
  start: 10,
  end: 13
}
Token {
  type: TokenType {
    label: ',',
    keyword: undefined,
    beforeExpr: true,
    startsExpr: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: undefined,
  start: 13,
  end: 14
}
Token {
  type: TokenType {
    label: 'num',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: 50,
  start: 15,
  end: 17
}
Token {
  type: TokenType {
    label: ',',
    keyword: undefined,
    beforeExpr: true,
    startsExpr: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: undefined,
  start: 17,
  end: 18
}
Token {
  type: TokenType {
    label: 'num',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  value: 0.5,
  start: 19,
  end: 22
}
Token {
  type: TokenType {
    label: ')',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: [Function (anonymous)]
  },
  value: undefined,
  start: 22,
  end: 23
}

----------------------------------------------------------------------------------
* CSS COLOR STRING GRAMMAR:
----------------------------------------------------------------------------------
*   NODE:                       RULE:
----------------------------------------------------------------------------------
    <start>             ::=     <color>   EOF
    <color>             ::=     <hex-color> | <function-color>
    <hex-color>         ::=     <value>
    <function-color>    ::=     <function>  <channels-list>
    <function>          ::=     <value>
    <channels-list>     ::=     <comma-list> | <space-list>
    <comma-list>        ::=     <ch-1> COMMA <ch-2> COMMA <ch-3> <alpha-channel>
    <space-list>        ::=     <ch-1> <ch-2> <ch-3> <alpha-channel>
    <channel-1>         ::=     <value>
    <channel-2>         ::=     <value>
    <channel-3>         ::=     <value>
    <alpha-channel>     ::=     COMMA <alpha> RPAREN | SLASH <alpha> RPAREN
    <alpha>             ::=     <value>
    <value>             ::=     <string> | <number> | <percent> | <angle>
    <string>            ::=     HEXVALUE | FUNCTION
    <number>            ::=     NUMBER
    <percent>           ::=     NUMBER PERCENT
    <angle>             ::=     NUMBER UNITS
----------------------------------------------------------------------------------
Abstract Syntax Tree (AST) nodes represent programming language constructs, 
broadly categorized as Statements (actions like return, if, loops) and Expressions
(computations like 3 + x, function calls), with leaves often being Literals 
(numbers, strings) or Identifiers (variables) and internal nodes representing 
Operators or control flow structures, forming a hierarchy of code elements. 

//* Common Node Types:
//*-------------------------------------------------------------------------------
//* Literals (Leaves): Represent constant values.
//*     NumericLiteral (e.g., 3, 10)
//*     StringLiteral (e.g., "hello")
//*     BooleanLiteral (e.g., true, false)
//*
//* Identifiers (Leaves/Variables): Represent variable names or functions.
//*     Identifier (e.g., x, myVariable)
//*
//* Operators (Internal Nodes): Represent operations, often binary (two children) 
//* or unary (one child).
//*     BinaryExpression (e.g., +, -, *, /)
//*     Assignment (e.g., =)
//*
//* Statements (Control Flow/Structure): Control program flow or define structure, 
//* often non-typable.
//*     ReturnStatement (e.g., return value;)
//*     IfStatement / ConditionalStatement
//*     ForLoop, WhileLoop
//*     FunctionDeclaration / FunctionDef
//*     Block / Scope (groups statements)
//*
//* Expressions (Compositions): Combine literals, identifiers, and operators.
//*     CallExpression (e.g., myFunction(arg))
//*     MemberExpression (e.g., obj.prop) 
//*-------------------------------------------------------------------------------

Key Idea:
----------------------------------------------------------------------------------
Nodes abstract away syntax details (like semicolons or parentheses) to focus on 
the code's meaning, with deeper nodes representing sub-expressions or nested 
statements, forming a hierarchical representation of the program's structure. 

In an Abstract Syntax Tree (AST), nodes represent different syntactic constructs 
of the source code. While the exact types can vary depending on the programming 
language and parser, they generally fall into two main categories: Statements 
and Expressions. 

Main Categories of Nodes:
----------------------------------------------------------------------------------
    Statements: 
        These nodes typically control the flow of the program and do not 
        necessarily produce a value. Examples include if statements, for/while loops, 
        return statements, and variable declarations.
    
    Expressions: 
        These nodes are building blocks that evaluate to a value. 
        Examples include arithmetic operations, function calls, variable references, 
        and literals. 

Common Specific Node Types:
Specific node types represent the granular components of the code's structure: 
----------------------------------------------------------------------------------
    Literals/Constants: 
        Represent raw values like numbers, strings, and boolean constants.
    Identifiers/Variables: 
        Represent names assigned by the programmer, such as variable names or 
        function names.
    Binary Operations: 
        Represent operations with two operands, such as addition (+), 
        subtraction (-), multiplication (*), division (/), and logical 
        operators (&&, ||). They have attributes for the operator and 
        left/right child nodes for the operands.
    Unary Operations: 
        Represent operations with a single operand, such as negation (-), 
        logical NOT (!), or type conversions.
    Function/Method Calls: 
    Represent calls to functions and include child nodes for the function name 
    and its arguments.
    Assignments: 
        Represent the assignment of a value to a variable or property.
    Control Flow Nodes: 
        Specific nodes for control structures like IfStmt, WhileStmt, ForStmt, 
        and SwitchStmt, which manage the flow of execution.
    Function/Class Definitions: 
        Nodes that represent the structure of a function or class definition, 
        often including attributes for the name, parameters, and a list of 
        statements in the body.
    Root Node: 
        Every AST has a root node (often called a CompilationUnit or Module node) 
        that represents the entire source file or program. 

Each node generally has a type attribute, may contain child nodes representing nested 
elements, and includes metadata such as line and column numbers to relate the node back 
to the original source code. 

//*-------------------------------------------------------------------------------

EXAMPLE AST (from token example above):

Node {
    type: 'Program',
    start: 0,
    end: 23,
    body: [
        Node {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            expression: Node {
                type: 'CallExpression',
                start: 0,
                end: 23,
                callee: Node { type: 'Identifier', start: 0, end: 4, name: 'rgba' },
                arguments: [
                    Node {
                        type: 'Literal',
                        start: 5,
                        end: 8,
                        value: 100,
                        raw: '100'
                    },
                    Node {
                        type: 'Literal',
                        start: 10,
                        end: 13,
                        value: 255,
                        raw: '255'
                    },
                    Node {
                        type: 'Literal',
                        start: 15,
                        end: 17,
                        value: 50,
                        raw: '50'
                    },
                    Node {
                        type: 'Literal',
                        start: 19,
                        end: 22,
                        value: 0.5,
                        raw: '0.5'
                    }
                ],
                optional: false
            }
        }
    ],
    sourceType: 'script'
}
//*-------------------------------------------------------------------------------

Literal

A Literal node represents a literal value in JavaScript. Literal values are:

    Boolean values - true and false
    Numeric values such as 1 and 10.0
    String values such as "foo"
    Regular expressions such as /foo/g.

Literal AST nodes have the following properties:

    type - always "Literal"
    value - the JavaScript representation of the literal if it's possible to create. For instance, this will be a JavaScript number if the literal represents a number, a regular expression if the literal represents a regular expression and the current engine can properly create the regular expression object, and so on.
    regex - only present for regular expression literals and has the following properties:
        pattern - the regular expression pattern.
        flags - any flags applied to the pattern.

Note: The regex property is a custom property and is not present in the SpiderMonkey Parser API.

Additionally, literal AST nodes have all the standard properties of nodes. Here's a complete example:

{
    "range": [
        10,
        16
    ],
    "loc": {
        "start": {
            "line": 1,
            "column": 10
        },
        "end": {
            "line": 1,
            "column": 16
        }
    },
    "type": "Literal",
    "value": null,
    "regex": {
        "pattern": "foo",
        "flags": "y"
    },
    "raw": "/foo/y"
}

*/

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

declare enum NodeType {
    start = '<start>',
    color = '<color> ',
    hexColor = '<hex-color>',
    functionColor = '<function-color>',
    function = '<function>',
    channelsList = '<channels-list>',
    commaList = '<comma-list>',
    spaceList = '<space-list>',
    channel1 = '<channel-1>',
    channel2 = '<channel-2>',
    channel3 = '<channel-3>',
    alphaChannel = '<alpha-channel>',
    alpha = '<alpha>',
    value = '<value>',
    stringValue = '<string>',
    numberValue = '<number>',
    percentValue = '<percent>',
    angleValue = '<angle>',
}

declare type ASTNode =
    | ChildrenNode<NodeType.start>
    | ChildrenNode<NodeType.color>
    | ChildrenNode<NodeType.hexColor>
    | ChildrenNode<NodeType.functionColor>
    | ChildrenNode<NodeType.function>
    | ChildrenNode<NodeType.channelsList>
    | ChildrenNode<NodeType.commaList>
    | ChildrenNode<NodeType.spaceList>
    | ChildrenNode<NodeType.channel1>
    | ChildrenNode<NodeType.channel2>
    | ChildrenNode<NodeType.channel3>
    | ChildrenNode<NodeType.alphaChannel>
    | ChildrenNode<NodeType.alpha>
    | ChildrenNode<NodeType.value>
    | ChildrenNode<NodeType.stringValue>
    | ChildrenNode<NodeType.numberValue>
    | ChildrenNode<NodeType.percentValue>
    | ChildrenNode<NodeType.angleValue>

declare interface BaseNode<T extends NodeType | TokenType | ColorModel> {
    type: T;
    start: number;
    end: number;
}

declare interface ChildrenNode<T extends NodeType | TokenType | ColorModel> extends BaseNode<T> {
    value: ASTNode | ASTNode[];
}


declare interface ValueNode<T extends TokenType> extends BaseNode<T> {
    type: T;
    value: T extends string ? string : T extends number ? number : null;
    units?: string;
}

