import VariableProvider from "./VariableProvider.js";
import Renderer from "../Renderer.js";

export default class RenderContext {
    constructor(
        private templateVariableProvider: VariableProvider,
        private sharedVariableProvider: VariableProvider,
        private renderer: Renderer,
    ) {}

    getTemplateVariableProvider() {
        return this.templateVariableProvider;
    }

    getSharedVariableProvider() {
        return this.sharedVariableProvider;
    }

    getRenderer() {
        return this.renderer;
    }
}
