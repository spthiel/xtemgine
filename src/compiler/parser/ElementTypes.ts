import Node from "./Node.js";
import ParserNode from "./ParserNode.js";
import ParserTextNode from "./ParserTextNode.js";

const inlineElementNames = [
    "a",
    "abbr",
    "acronym",
    "b",
    "bdo",
    "big",
    "br",
    "button",
    "cite",
    "code",
    "dfn",
    "em",
    "i",
    "img",
    "input",
    "kbd",
    "label",
    "map",
    "object",
    "output",
    "q",
    "samp",
    "script",
    "select",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "textarea",
    "time",
    "tt",
    "var",
];

function isElementNode(node: Node): node is ParserNode {
    return node instanceof ParserNode;
}

function isTextNode(node: Node): node is ParserTextNode {
    return node instanceof ParserTextNode;
}

function isInlineElement(node: Node) {
    return isElementNode(node) && inlineElementNames.includes(node.name);
}

export default {
    isInlineElement,
    isElementNode,
    isTextNode,
};
