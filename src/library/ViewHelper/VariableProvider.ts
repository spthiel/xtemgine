import {Dict} from "../Types.js";

export default class VariableProvider {
    public constructor(protected variables: Dict<unknown> = {}) {}

    public getAll() {
        return this.variables;
    }

    public add(key: string, value: unknown) {
        this.variables[key] = value;
    }

    public get(identifier: string) {
        return this.getByPath(identifier);
    }

    public getByPath(identifier: string) {
        let subject: unknown = this.variables;
        const path = identifier.split(".");
        for (const segment of path) {
            if (Array.isArray(subject)) {
                subject = subject[Number.parseInt(segment)];
                continue;
            }

            if (typeof subject === "object") {
                const ucFirst = segment.charAt(0).toUpperCase() + segment.substring(1);
                if (this.hasKey(subject, segment)) {
                    subject = subject[segment];
                } else if (this.methodExists(subject, `has${ucFirst}`)) {
                    subject = subject[`has${ucFirst}`]();
                } else if (this.methodExists(subject, `is${ucFirst}`)) {
                    subject = subject[`is${ucFirst}`]();
                } else if (this.methodExists(subject, `get${ucFirst}`)) {
                    subject = subject[`get${ucFirst}`]();
                }
                continue;
            }

            return undefined;
        }
        return subject;
    }

    public methodExists<S extends string>(subject: object, functionName: S): subject is {[k in S]: CallableFunction} {
        if (!this.hasKey(subject, functionName)) {
            return false;
        }

        return typeof subject[functionName] === "function";
    }

    private hasKey<S extends string>(subject: object, key: S): subject is {[k in S]: unknown} {
        return key in subject;
    }
}
