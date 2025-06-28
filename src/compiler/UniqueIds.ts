export default class {
    private ids = new Map<string, number>();

    constructor() {}

    nextID(name: string) {
        if (!this.ids.has(name)) {
            this.ids.set(name, 0);
        }
        const idSuffix = this.ids.get(name);
        this.ids.set(name, idSuffix + 1);

        return name + idSuffix;
    }
}
