import AbstractViewHelper from "./AbstractViewHelper.js";
import {Dict} from "../Types.js";

interface Arguments extends Dict<unknown> {
    data: Dict<unknown>;
    aria: Dict<unknown>;
}

export default abstract class AbstractTagBasedViewHelper<A extends Dict<unknown>> extends AbstractViewHelper<
    A & Arguments
> {
    protected escapeOutput: boolean = false;
    protected tag: HTMLElement;
    protected tagName: string = "div";
    protected additionalArguments: Dict<unknown> = {};

    public initializeArguments(): void {}

    public initialize(): void {
        super.initialize();
        this.tag = this.document.createElement(this.tagName);

        Object.entries(this.additionalArguments).forEach(([key, value]) =>
            this.tag.setAttribute(key, value.toString()),
        );

        if (this.hasArgument("data")) {
            Object.entries(this.arguments["data"]).forEach(([key, value]) =>
                this.tag.setAttribute(`data-${key}`, value.toString()),
            );
        }

        if (this.hasArgument("aria")) {
            Object.entries(this.arguments["aria"]).forEach(([key, value]) =>
                this.tag.setAttribute(`data-${key}`, value.toString()),
            );
        }
    }

    public handleAdditionalArguments(args: Dict<unknown>) {
        this.additionalArguments = args;
    }

    public setTagName(tagName: string) {
        this.tagName = tagName;
    }

    public validateAdditionalArguments() {
        // Skip validation of additional arguments since we want to pass all arguments to the tag
    }

    public async render(): Promise<HTMLElement> {
        await this.renderChildren(this.tag);
        return this.tag;
    }
}
