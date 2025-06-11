class StringWalker {
    private index: number = -1;
    private readonly chars: string[];
    private readonly stack: number[] = [];

    constructor(private readonly text: string) {
        this.chars = Array.from(text);
    }

    peek() {
        if (this.last() || this.done()) {
            return undefined;
        }
        return this.chars[this.index + 1];
    }

    peekBehind(): string {
        return this.chars[this.index - 1];
    }

    eat() {
        if (this.last() || this.done()) {
            return undefined;
        }
        return this.chars[++this.index];
    }

    eatTo(char: string) {
        if (this.last() || this.done()) {
            return undefined;
        }
        let out = "";
        let current = "";
        while (!this.done() && (current = this.eat()) !== char) {
            out += current;
        }
        return out;
    }

    rest() {
        if (this.last() || this.done()) {
            return undefined;
        }
        this.index = this.chars.length;
        return this.text.substring(this.index);
    }

    step() {
        this.index++;
    }

    reverse() {
        return this.chars[--this.index];
    }

    last() {
        return this.index == this.chars.length - 1;
    }

    done() {
        return this.index >= this.chars.length;
    }

    push() {
        this.stack.push(this.index);
    }

    pop() {
        this.index = this.stack.pop();
    }
}

interface ParseFragment {
    type: "text" | "template";
    content: string;
}

export function parse(text: string): ParseFragment[] {
    if (!text.includes("{{")) {
        return [{type: "text", content: text}];
    }

    const walker = new StringWalker(text);
    const result: ParseFragment[] = [];
    let current = "";
    let char: string;

    while ((char = walker.eat())) {
        switch (char) {
            case "{":
                if (walker.peek() === "{") {
                    walker.push();
                    try {
                        walker.eat();
                        const template = parseTemplate(walker);
                        if (current) {
                            result.push({type: "text", content: current});
                        }
                        current = "";
                        result.push({type: "template", content: template});
                    } catch (ignored) {
                        current += "{";
                        current += this.rest();
                        walker.pop();
                    }
                } else {
                    current += char;
                }
                break;
            case "\\":
                current += walker.eat() || "\\";
                break;
            default:
                current += char;
        }
    }

    if (current) {
        result.push({type: "text", content: current});
    }

    return result;
}

/**
 *
 * @param walker
 * @throws Error
 */
function parseTemplate(walker: StringWalker): string {
    let current = "";
    let char: string;

    while ((char = walker.eat())) {
        switch (char) {
            case "}":
                if (walker.peek() === "}") {
                    walker.eat();
                    return current.trim();
                }
                current += "}";
                break;
            case "\\":
                current += walker.eat() || "\\";
                break;
            default:
                current += char;
        }
    }

    throw new Error("Reached end of string");
}
