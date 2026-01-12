import ArgumentDefinition from "./ArgumentDefinition.js";
import {type Dict} from "../../Types.d.js";
import RenderContext from "./RenderContext.js";

interface Arguments {}

type ArgumentsType<A extends Dict<unknown>> = Partial<A & Arguments>;

export default abstract class AbstractViewHelper<A extends Dict<unknown>> {
    private static argumentDefinitionCache: Dict<Dict<ArgumentDefinition>> = {};
    protected argumentDefinitions: Dict<ArgumentDefinition> = {};
    protected viewHelperNode: HTMLElement;
    protected arguments: ArgumentsType<A> = {};
    protected escapeChildren: boolean = false;
    protected escapeOutput: boolean = false;

    protected renderingContext: RenderContext;

    public abstract getNamespace(): string;

    public abstract getName(): string;

    public setArguments(args: ArgumentsType<A>) {
        this.arguments = args;
    }

    public setContext(renderingContext: RenderContext) {
        this.renderingContext = renderingContext;
    }

    /**
     * @internal
     */
    public setViewHelperNode(viewHelperNode: HTMLElement) {
        this.viewHelperNode = viewHelperNode;
    }

    public initializeArgumentsAndRender() {
        this.validateArguments();
        this.initialize();
        return this.render();
    }

    public initialize() {}

    public async renderChildren(parent: HTMLElement) {
        for (const node of this.viewHelperNode.childNodes) {
            await this.renderer.renderNode(parent, node);
        }
    }

    public prepareArguments() {
        if (this.constructor.name in AbstractViewHelper.argumentDefinitionCache) {
            this.argumentDefinitions = AbstractViewHelper.argumentDefinitionCache[this.constructor.name];
        } else {
            this.initializeArguments();
            AbstractViewHelper.argumentDefinitionCache[this.constructor.name] = this.argumentDefinitions;
        }
        return this.argumentDefinitions;
    }

    public validateArguments() {
        const argumentDefinitions = this.prepareArguments();
        for (const argumentName in argumentDefinitions) {
            if (this.hasArgument(argumentName)) {
                const argumentDefinition = argumentDefinitions[argumentName];

                const value = this.arguments[argumentName];
                const type = argumentDefinition.getType();
                if (value !== argumentDefinition.getDefaultValue()) {
                    if (!this.isValidType(type, value)) {
                        throw new Error(`Argument ${argumentDefinition.getName()} is of invalid type.`);
                    }
                }
            }
        }
    }

    public initializeArguments() {}

    public handleAdditionalArguments(args: Dict<unknown>) {
        throw new Error(`Tried to handle additional arguments ${Object.keys(args).toString()} without a handler.`);
    }

    public validateAdditionalArguments(_args: Dict<unknown>) {
        throw new Error("Tried to handle additional arguments without a handler.");
    }

    /**
     * @internal
     * @readonly
     * @constant
     */
    public applyElementAttributes(args: Dict<unknown>) {
        this.prepareArguments();
        const additionalArguments: Dict<unknown> = {};
        let hasAdditionalArguments: boolean = false;

        for (const key in args) {
            if (key in this.argumentDefinitions) {
                // @ts-expect-error Typescript error is incorrect.
                this.arguments[key] = args[key];
            } else {
                additionalArguments[key] = args[key];
                hasAdditionalArguments = true;
            }
        }

        if (hasAdditionalArguments) {
            this.handleAdditionalArguments(additionalArguments);
        }
    }

    protected registerArgument(
        name: string,
        type: string,
        description: string,
        required: boolean = false,
        defaultValue: unknown = undefined,
    ) {
        if (this.hasArgument(name)) {
            throw new Error(`Argument "${name}" has already been defined, this it should not be defined again.`);
        }
        this.argumentDefinitions[name] = new ArgumentDefinition(name, type, description, required, defaultValue);
        return this;
    }

    protected overrideArgument(
        name: string,
        type: string,
        description: string,
        required: false,
        defaultValue: undefined,
    ) {
        if (!this.hasArgument(name)) {
            throw new Error(`Argument "${name}" has not been defined, this it can't be overridden.`);
        }
        this.argumentDefinitions[name] = new ArgumentDefinition(name, type, description, required, defaultValue);
    }

    protected isValidType(type: string, value: unknown): boolean {
        switch (type) {
            case "object":
                return typeof value === "object";
            case "array":
                return Array.isArray(value) || (typeof value === "object" && Symbol.iterator in value);
            case "string":
            case "boolean":
            case "number":
                return typeof value === type;
            default:
                if (type.endsWith("[]")) {
                    if (!this.isValidType("array", value)) {
                        return false;
                    }

                    const firstElement = this.getFirstElement(value as Array<unknown> | Iterable<unknown>);
                    if (firstElement === undefined) {
                        return true;
                    }

                    return this.isValidType(type.slice(0, -2), firstElement);
                }
        }
        return true;
    }

    protected getFirstElement(value: Array<unknown> | Iterable<unknown>) {
        if (Array.isArray(value)) {
            return value[0];
        }

        // noinspection LoopStatementThatDoesntLoopJS
        for (const element of value) {
            return element;
        }

        return undefined;
    }

    protected hasArgument(argumentName: keyof A): boolean {
        return argumentName in this.arguments;
    }

    protected abstract render(): Promise<string>;
}
