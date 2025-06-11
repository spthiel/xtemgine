import AbstractViewHelper from "./AbstractViewHelper.js";
import {Dict} from "../Types.js";
import CONSTANTS from "../core/CONSTANTS.js";

interface Arguments extends Dict<unknown> {}

export default abstract class AbstractFragmentBasedViewHelper<A extends Dict<unknown>> extends AbstractViewHelper<
    A & Arguments
> {
    protected escapeOutput: boolean = false;
    protected tag: HTMLElement;
    protected tagName: string = "div";
    protected additionalArguments: Dict<unknown> = {};

    public initializeArguments(): void {}

    public initialize(): void {
        super.initialize();
        this.tag = this.document.createElement("div");
        this.tag.setAttribute(CONSTANTS.tag.attributes.type, "fragment");
    }

    public async render(): Promise<HTMLElement> {
        await this.renderChildren(this.tag);
        return this.tag;
    }
}
