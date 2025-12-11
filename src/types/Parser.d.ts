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