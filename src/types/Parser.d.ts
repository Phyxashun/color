// /src/types/Parser.d.ts

type HexValue = `#${string}`;
type Units = 'deg' | 'grad' | 'rad' | 'turn';

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

type NodeTypeKey =
    | 'start'
    | 'color'
    | 'hex'
    | 'function'
    | 'channels'
    | 'space'
    | 'comma'
    | 'alpha'
    | 'value'

type NodeTypeValue = NodeType[keyof NodeType];

type NodeValue =
    | StartNode
    | ColorNode
    | HexNode
    | HexValue
    | FunctionNode
    | ChannelsNode
    | SpaceNode
    | CommaNode
    | AlphaNode
    | ValueNode
    | ValueNode[]
    | number

declare abstract class BaseNode {
    abstract type: NodeTypeValue;
    abstract value: NodeValue;
    abstract toString(): string;
}

declare class ASTNode implements BaseNode {
    type: NodeTypeValue;
    value: NodeValue;
    toString: () => string;
}

interface StartNode extends ASTNode {
    type: '<start>';
    value: ColorNode;
    toString: () => string;
}

interface ColorNode extends ASTNode {
    type: '<color>';
    value: HexNode | FunctionNode;
    toString: () => string;
}

interface HexNode extends ASTNode {
    type: '<hex-color>';
    value: HexValue;
    toString: () => string;
}

interface FunctionNode extends ASTNode {
    type: '<function-color>';
    name: ColorModel;
    value: ChannelsNode;
    toString: () => string;
}

interface ChannelsNode extends ASTNode {
    type: '<channels-list>';
    value: SpaceNode | CommaNode;
    toString: () => string;
}

interface SpaceNode extends ASTNode {
    type: '<space-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
    toString: () => string;
}

interface CommaNode extends ASTNode {
    type: '<comma-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
    toString: () => string;
}

interface AlphaNode extends Partial<ASTNode>, Partial<ValueNode> {
    type?: '<alpha>';
    valueType?: 'number' | 'percentage';
    value?: ValueNode;
    toString?: () => string;
}

interface ValueNode extends Partial<ASTNode> {
    type?: '<value>' | '<alpha>';
    valueType?: 'number' | 'percentage' | 'angle';
    value?: number | ValueNode;
    units?: '%' | Units | undefined;
    toString?: () => string;
}

declare class Parser {
    private tokenizer: Tokenizer;
    constructor(source: string);
}