import {Dict} from "../../Types.js";

const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

export default class TagBuilder {
    public tagName: string;
    public content?: string;
    private attributes: Dict<string>;
    private ignoreEmpty: boolean;

    constructor(tagName: string = "", tagContent?: string) {
        this.tagName = tagName;
        this.content = tagContent;
    }

    public hasAttribute(attributeName: string): boolean {
        return attributeName in this.attributes;
    }

    public getAttribute(attributeName: string): string | undefined {
        return this.attributes[attributeName];
    }

    public getAttributes(): Readonly<Dict<string>> {
        return this.attributes;
    }

    public addAttribute(name: string, value: unknown): void {
        if (!/[A-Za-z0-9\-#$%]/.test(name)) {
            throw new Error(`Invalid attribute name: ${name}`);
        }

        if (typeof value === "object") {
            Object.entries(value).forEach(([key, nestedValue]) => {
                this.addAttribute(`${name}-${key}`, nestedValue);
            });

            return;
        }

        if (value == null) {
            this.removeAttribute(name);
            return;
        }

        if (value === true) {
            value = name;
        }

        const stringValue = String(value);

        if (this.ignoreEmpty && this.isEmptyValue(stringValue)) {
            return;
        }

        this.attributes[name] = stringValue;
    }

    public addAttributes(attributes: Dict<unknown>): void {
        Object.entries(attributes).forEach(([key, value]) => this.addAttribute(key, value));
    }

    public removeAttribute(name: string): void {
        delete this.attributes[name];
    }

    public render(): string {
        if (this.tagName.trim().length === 0) {
            return "";
        }

        let out = `<${this.tagName}`;

        Object.entries(this.attributes).forEach(
            ([key, value]) => (out += ` ${key}="${value.replace("\\", "\\\\").replace('"', '\\"')}"}`),
        );

        if (voidElements.includes(this.tagName)) {
            return `${out}>`;
        }

        return `${out}>${this.content}</${this.tagName}>`;
    }

    public ignoreEmptyAttributes(ignoreEmpty: boolean): void {
        this.ignoreEmpty = ignoreEmpty;
        if (this.ignoreEmpty) {
            this.filterEmptyAttributes();
        }
    }

    private isEmptyValue(value: unknown) {
        if (value == null) {
            return true;
        }

        if (typeof value === "string") {
            return value.trim().length === 0;
        }

        return false;
    }

    private filterEmptyAttributes() {
        for (const key in this.attributes) {
            if (!Object.hasOwn(this.attributes, key)) {
                continue;
            }

            if (this.isEmptyValue(this.attributes[key])) {
                delete this.attributes[key];
            }
        }
    }
}
