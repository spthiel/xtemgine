import {DOMWindow, JSDOM} from "jsdom";
import VariableProvider from "./ViewHelper/VariableProvider.js";
import {Dict} from "./Types.js";
import {DefaultHTMLViewHelper} from "./ViewHelper/DefaultHTMLViewHelper.js";
import CONSTANTS from "./core/CONSTANTS.js";
import * as StringParser from "./StringParser.js";
import AbstractViewHelper from "./ViewHelper/AbstractViewHelper.js";
import {getViewHelper} from "./ViewHelpers.js";

export class Renderer {
    private readonly outDom: JSDOM = new JSDOM(undefined, {
        includeNodeLocations: false,
        storageQuota: 0,
        pretendToBeVisual: false,
    });
    private readonly outWindow: DOMWindow = this.outDom.window;
    private readonly outDocument: Document = this.outWindow.document;

    private readonly inDom: JSDOM;
    private readonly inWindow: DOMWindow;
    private readonly inDocument: Document;

    private readonly variableProvider: VariableProvider;
    private readonly nodes: [Node, Node][] = [];

    constructor(template: JSDOM, initialData: Dict<unknown>) {
        this.variableProvider = new VariableProvider(initialData);
        this.inDom = template;
        this.inWindow = this.inDom.window;
        this.inDocument = this.inWindow.document;
    }

    public async render() {
        if (this.inDocument.doctype) {
            this.outDocument.insertBefore(this.inDocument.doctype, this.outDocument.childNodes[0]);
        }

        this.nodes.push([undefined, this.inDocument.documentElement]);
        let element: [Node, Node];

        while ((element = this.nodes.shift()) !== undefined) {
            await this.renderNode(...element);
        }

        const output = this.outDom.serialize();
        this.outDom.window.close();
        return output;
    }

    public getVariableProvider() {
        return this.variableProvider;
    }

    public async renderNode(parent: Node, node: Node) {
        if (node.nodeName === "#text") {
            this.renderText(parent, node as Text);

            return;
        }

        if (node.nodeName === "HTML") {
            this.renderDocument(node as HTMLHtmlElement);

            return;
        }

        if (node.nodeName === "HEAD" || node.nodeName === "BODY") {
            this.overwriteElement(node as Element);

            return;
        }

        if (node.nodeName.includes(":")) {
            await this.renderViewHelper(parent, node as HTMLElement);
            return;
        }

        await this.renderElement(parent, node as HTMLElement);
    }

    private renderText(parent: Node, node: Text) {
        const content = this.processString(node.textContent);
        if (content.match(/^\s*$/)) {
            return;
        }
        const element = this.outDocument.createTextNode(content);

        parent.appendChild(element);
    }

    private async renderElement(parent: Node, element: HTMLElement) {
        const viewHelper = this.initViewHelper(DefaultHTMLViewHelper, element);

        const newElement = await viewHelper.initializeArgumentsAndRender();

        await this.renderViewHelperOutput(parent, newElement);
    }

    private async renderViewHelperOutput(parent: Node, element: HTMLElement) {
        if (!element) {
            return;
        }

        if (
            element.hasAttribute(CONSTANTS.tag.attributes.type) &&
            element.getAttribute(CONSTANTS.tag.attributes.type) === "fragment"
        ) {
            for (const node of element.childNodes) {
                parent.appendChild(node);
            }
        } else {
            parent.appendChild(element);
        }
    }

    private renderDocument(document: HTMLHtmlElement) {
        this.copyAttributes(document, this.outDocument.documentElement);

        for (const node of document.childNodes) {
            this.nodes.push([this.outDocument.documentElement, node]);
        }
    }

    private overwriteElement(node: Element) {
        const existing = this.outDocument.documentElement.getElementsByTagName(node.nodeName)[0];

        this.copyAttributes(node, existing);

        for (const child of node.childNodes) {
            this.nodes.push([existing, child]);
        }
    }

    private processString(template: string): string {
        const parsed = StringParser.parse(template);
        let out = "";

        for (const part of parsed) {
            if (part.type === "text") {
                out += part.content;
            } else {
                out += this.processStringTemplateContent(part.content);
            }
        }

        return out;
    }

    private copyAttributes(from: Element, to: Element) {
        for (const key of from.getAttributeNames()) {
            to.setAttribute(key, from.getAttribute(key));
        }
    }

    private obtainAttributes(from: Element) {
        const out: Record<string, unknown> = {};

        for (const key of from.getAttributeNames()) {
            out[key] = from.getAttribute(key);
        }

        return out;
    }

    private processStringTemplateContent(content: string): string {
        return this.variableProvider.get(content).toString();
    }

    private initViewHelper<V extends AbstractViewHelper<Dict<unknown>>>(ViewHelper: new () => V, node: HTMLElement): V {
        const helper = new ViewHelper();
        helper.setContext(undefined, this, this.outDocument);
        helper.setViewHelperNode(node);

        const attributes = this.obtainAttributes(node);
        helper.applyElementAttributes(attributes);

        return helper;
    }

    private async renderViewHelper(parent: Node, node: HTMLElement) {
        const viewHelper = getViewHelper(node.tagName.toLowerCase());
        if (!viewHelper) {
            throw new Error(
                `Attempted to call ViewHelper ${node.tagName.toLowerCase()} but the ViewHelper was not defined.`,
            );
        }

        const helper = this.initViewHelper(viewHelper, node);

        await this.renderViewHelperOutput(parent, await helper.initializeArgumentsAndRender());
    }
}
