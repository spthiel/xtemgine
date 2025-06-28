import Node from "./Node.js";
import Value from "./Value.js";
import ParserNode from "./ParserNode.js";

export default class ParserTextNode extends Node {
    public value: Value;
    private justWhitespace: boolean;

    constructor(parent: ParserNode) {
        super(parent);
    }

    isJustWhitespace(): boolean {
        return this.justWhitespace;
    }

    setText(text: string) {
        this.value = new Value(text);
        this.justWhitespace = text.trim().length === 0;
    }

    trim() {
        const firstSegment = this.value.segments[0];
        const lastSegment = this.value.segments[this.value.segments.length - 1];
        firstSegment.content = firstSegment.content.trimStart();
        lastSegment.content = lastSegment.content.trimEnd();
    }

    toJSON() {
        return {
            value: this.value,
            justWhitespace: this.justWhitespace,
            flags: this.flags,
        };
    }
}
