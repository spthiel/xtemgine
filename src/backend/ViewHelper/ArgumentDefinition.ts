export default class ArgumentDefinition {
    constructor(
        protected name: string,
        protected type: string,
        protected description: string,
        protected required = false,
        protected defaultValue: unknown = undefined,
    ) {}

    public getName() {
        return this.name;
    }

    public getType() {
        return this.type;
    }

    public getDescription() {
        return this.description;
    }

    public isRequired() {
        return this.required;
    }

    public getDefaultValue() {
        return this.defaultValue;
    }
}
