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

interface BaseNode<T extends NodeType> {
    type: T;
    name: string;
    toString: () => string;
}

interface ChildrenNode<N extends NodeType> extends BaseNode<N> {
    children: ASTNode | ASTNode[];
}

interface HexNode<N extends NodeType> extends BaseNode<N> {
    value: HexValue;
}

interface AlphaNode<N extends NodeType> extends BaseNode<N>, ChildrenNode<N> {
    alpha: ValueNode<N>;
}

interface ValueNode<N extends NodeType> extends BaseNode<N> {
    value: number;
    units?: string;
}

type ASTNode =
    | ChildrenNode<NodeType.start>
    | ChildrenNode<NodeType.color>
    | HexNode<NodeType.hex>
    | ChildrenNode<NodeType.function>
    | ChildrenNode<NodeType.channels>
    | ChildrenNode<NodeType.space>
    | ChildrenNode<NodeType.comma>
    //| ASTValueNode<NodeType.alpha>
    | AlphaNode<NodeType.alpha>
    | ValueNode<NodeType.value>






/*

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

interface ASTNode<T extends NodeType> {
    type: T;
}

interface ASTValueNode<T extends NodeType> extends ASTNode<T> {
    value: ASTNode<T> | ASTValueNode<T>;
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
}

//declare class ASTNode implements BaseNode {
//    type: NodeTypeValue;
//    value: NodeValue;
//}

interface StartNode extends ASTNode {
    type: '<start>';
    value: ColorNode;
}

interface ColorNode extends ASTNode {
    type: '<color>';
    value: HexNode | FunctionNode;
}

interface HexNode extends ASTNode {
    type: '<hex-color>';
    value: HexValue;
}

interface FunctionNode extends ASTNode {
    type: '<function-color>';
    name: ColorModel;
    value: ChannelsNode;
}

interface ChannelsNode extends ASTNode {
    type: '<channels-list>';
    value: SpaceNode | CommaNode;
}

interface SpaceNode extends ASTNode {
    type: '<space-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
}

interface CommaNode extends ASTNode {
    type: '<comma-list>';
    value: [ValueNode, ValueNode, ValueNode] | [ValueNode, ValueNode, ValueNode, ValueNode];
    alpha?: AlphaNode | undefined;
}

interface AlphaNode extends Partial<ASTNode>, Partial<ValueNode> {
    type?: '<alpha>';
    valueType?: 'number' | 'percentage';
    value?: ValueNode;
}

interface ValueNode extends Partial<ASTNode> {
    type?: '<value>' | '<alpha>';
    valueType?: 'number' | 'percentage' | 'angle';
    value?: number | ValueNode;
    units?: '%' | Units | undefined;
}

declare class Parser {
    private tokenizer: Tokenizer;
    constructor(source: string);
}
*/