import AbstractTagBasedViewHelper from "./AbstractTagBasedViewHelper.js";
import {Dict} from "../Types.js";

export class DefaultHTMLViewHelper extends AbstractTagBasedViewHelper<Dict<never>> {
    public getNamespace(): string {
        throw new Error("Default view helper must not be registered.");
    }

    public getName(): string {
        throw new Error("Default view helper must not be registered.");
    }

    initialize() {
        this.setTagName(this.viewHelperNode.tagName);
        super.initialize();
    }
}
