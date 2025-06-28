import Node from "./Node.js";
import Value from "./Value.js";

export default class ParserNode extends Node {
    public children: Node[] = [];
    public attributes = new Map<string, Value>();
    public name: string;

    constructor(parent: ParserNode | undefined, name: string) {
        super(parent);
        this.name = name.toLowerCase();
    }

    public addChild(child: Node) {
        this.children.push(child);
    }

    public removeChild(child: Node) {
        const index = this.children.indexOf(child);

        if (index < 0) {
            return;
        }

        this.children.splice(index, 1);
    }

    public processAttributes(attributes: Record<string, string>) {
        for (const attributeName in attributes) {
            const value = attributes[attributeName];

            if (attributeName.startsWith("xtm:")) {
                // @ts-expect-error We allow arbitrary flags to set but type hinting is only for initially defined.
                this.flags[attributeName.substring("xtm:".length)] = value;
                continue;
            }
            
            this.attributes.set(attributeName, new Value(value));
        }
    }

    toJSON() {
        return {
            name: this.name,
            flags: this.flags,
            attributes: Array.from(this.attributes.keys()).reduce(
                (p, c) => {
                    p[c] = this.attributes.get(c);
                    return p;
                },
                {} as Record<string, Value>,
            ),
            children: this.children
        };
    }
}
