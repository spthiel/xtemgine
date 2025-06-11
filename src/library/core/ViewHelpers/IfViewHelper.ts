import {Dict} from "../../Types.js";
import AbstractFragmentBasedViewHelper from "../../ViewHelper/AbstractFragmentBasedViewHelper.js";
import CONSTANTS from "../CONSTANTS.js";

interface Arguments {
    condition: boolean;
}

export default class IfViewHelper<A extends Dict<unknown>> extends AbstractFragmentBasedViewHelper<A & Arguments> {
    public getNamespace(): string {
        return CONSTANTS.viewhelper.coreNamespace;
    }

    public getName(): string {
        return "if";
    }

    initializeArguments() {
        super.initializeArguments();
        this.registerArgument("condition", "string", "Whether to render output.", true);
    }

    async render(): Promise<HTMLElement> {
        const value: boolean = this.hasArgument("condition") && this.arguments["condition"];

        if (value) {
            for (const element of this.viewHelperNode.children) {
                if (element.tagName === "F:THEN") {
                    await this.renderer.renderNode(this.tag, element);
                    return this.tag;
                }
            }
            return super.render();
        }

        for (const element of this.viewHelperNode.children) {
            if (element.tagName === "F:ELSE") {
                await this.renderer.renderNode(this.tag, element);
                return this.tag;
            }
        }

        return undefined;
    }
}
