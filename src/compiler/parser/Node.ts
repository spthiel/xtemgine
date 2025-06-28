import type ParserNode from "./ParserNode.js";
import XTMFlag, {XTMFlags} from "./XTMFlag.js";

export default abstract class Node {
    public readonly flags: XTMFlags;
    public readonly parent?: ParserNode;

    protected constructor(parent?: ParserNode) {
        this.parent = parent;
        this.flags = structuredClone(parent?.flags) || XTMFlag.new();
    }

    public remove() {
        if (!this.parent) {
            return;
        }

        this.parent.removeChild(this);
    }
}
