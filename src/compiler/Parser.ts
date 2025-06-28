import {HTMLElement, Node, NodeType, TextNode} from "node-html-parser";
import ParserNode from "./parser/ParserNode.js";
import ParserTextNode from "./parser/ParserTextNode.js";
import {WhitespaceMode} from "./parser/XTMFlag.js";
import ElementTypes from "./parser/ElementTypes.js";

export default class Parser {
    constructor(private dom: HTMLElement) {}

    public parse() {
        const root = new ParserNode(undefined, "#root");
        const nodes: Array<[ParserNode, Node]> = this.dom.childNodes.map((child: Node) => [root, child]);

        while (nodes.length > 0) {
            const [parent, node] = nodes.shift();

            if (node.nodeType === NodeType.COMMENT_NODE) {
                continue;
            }

            if (node.nodeType === NodeType.TEXT_NODE) {
                const textNode = this.buildTextNode(parent, node as TextNode);

                if (textNode) {
                    parent.addChild(textNode);
                }

                continue;
            }

            const parserNode = this.buildElementNode(parent, node as HTMLElement);

            parent.addChild(parserNode);
            for (const child of node.childNodes) {
                nodes.push([parserNode, child]);
            }
        }

        this.pruneCollapsedTextNodes(root);

        return root;
    }

    private pruneCollapsedTextNodes(root: ParserNode) {
        const nodes = [root];

        while (nodes.length > 0) {
            const node = nodes.pop();

            for (let i = node.children.length - 1; i >= 0; i--) {
                const child = node.children[i];
                if (child instanceof ParserNode) {
                    if (child.children.length > 0) {
                        nodes.push(child);
                    }

                    continue;
                }

                if (!(child instanceof ParserTextNode)) {
                    continue;
                }

                if (child.flags.whitespace === WhitespaceMode.PRESERVE) {
                    continue;
                }

                if (i === 0 || i === node.children.length - 1) {
                    this.trimNodeToNothing(child);
                    continue;
                }

                const previousSibling = node.children[i - 1];
                const nextSibling = node.children[i + 1];

                if (!ElementTypes.isInlineElement(previousSibling)) {
                    this.trimNodeToNothing(child);
                    continue;
                }

                if (!ElementTypes.isInlineElement(nextSibling)) {
                    this.trimNodeToNothing(child);
                    continue;
                }
            }
        }
    }

    private trimNodeToNothing(node: ParserTextNode) {
        if (node.isJustWhitespace()) {
            node.remove();
            return;
        }

        node.trim();
    }

    private buildTextNode(parent: ParserNode, node: TextNode): ParserTextNode | undefined {
        const parserTextNode = new ParserTextNode(parent);

        const whitespaceMode = parent.flags.whitespace;

        let text;

        switch (whitespaceMode) {
            case WhitespaceMode.PRESERVE:
                text = node.textContent;
                break;
            case WhitespaceMode.COLLAPSE:
                text = node.textContent.replaceAll(/\s+/g, " ");
                break;
            case WhitespaceMode.LINEBREAK:
                text = node.textContent.replaceAll(/[ \t\f]*(\n)\s*/g, "\n");
                text = text.replaceAll(/[ \t\f]+/g, " ");
                break;
        }

        parserTextNode.setText(text);

        return parserTextNode;
    }

    private buildElementNode(parent: ParserNode, node: HTMLElement): ParserNode {
        const parserNode = new ParserNode(parent, node.tagName);

        parserNode.processAttributes(node.attributes);

        return parserNode;
    }
}
