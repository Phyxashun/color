/// <reference types='./Color.d.ts' />
/// <reference types='./Tokenizer.d.ts' />
// /src/types/Parser.d.ts

type HexValue = `#${string}`;
type Units = 'deg' | 'grad' | 'rad' | 'turn';

type GrammarRuleRightSide = readonly (TokenType | NodeType | ColorModel)[];
type GrammarRule = readonly [NodeType, GrammarRuleRightSide];
type NodeSpec = readonly GrammarRule[];

declare enum NodeType {
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

interface BaseNode<T extends NodeType> {
    type: T;
    name: NodeType | TokenType | ColorModel;
    value?: string | number;
    toString: () => string;
}

interface ChildrenNode<N extends NodeType> extends BaseNode<N> {
    children: ASTNode | ASTNode[];
}

interface ValueNode<N extends NodeType> extends BaseNode<N> {
    value: number;
    units?: string;
}

interface HexNode<N extends NodeType> extends BaseNode<N> {
    value: HexValue;
}

interface ChannelsNode<N extends NodeType> extends BaseNode<N>, ChildrenNode<N> {
    alpha?: ASTNode | undefined;
}

type ASTNode =
    | ChildrenNode<NodeType.start>
    | ChildrenNode<NodeType.color>
    | HexNode<NodeType.hex>
    | ChildrenNode<NodeType.function>
    | ChildrenNode<NodeType.channels>
    | ChannelsNode<NodeType.space>
    | ChannelsNode<NodeType.comma>
    | ChannelsNode<NodeType.alpha>
    | ValueNode<NodeType.value>

declare const parsePercent: (percentString: string) => number;

declare class Parser {
    private readonly tokenizer: Tokenizer;
    constructor(source: string);
}


