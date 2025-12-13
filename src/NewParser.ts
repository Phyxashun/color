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
}

declare interface ChildrenNode<T extends NodeType | TokenType | ColorModel> extends BaseNode<T> {
    value: ASTNode | ASTNode[];
}


declare interface ValueNode<T extends TokenType> extends BaseNode<T> {
    type: T;
    value: T extends string ? string : T extends number ? number : null;
    units?: string;
}

