import {Dict} from "./Types.js";
import AbstractViewHelper from "./ViewHelper/AbstractViewHelper.js";

export type ViewHelperType = AbstractViewHelper<Dict<unknown>>;

const viewHelpers: Dict<Dict<new () => AbstractViewHelper<Dict<unknown>>>> = {};

export function registerViewHelper(ViewHelper: new () => AbstractViewHelper<Dict<unknown>>) {
    const instance = new ViewHelper();

    if (!(instance.getNamespace() in viewHelpers)) {
        viewHelpers[instance.getNamespace()] = {};
    }

    if (instance.getName() in viewHelpers[instance.getNamespace()]) {
        throw new Error(`View helper ${instance.getNamespace()}:${instance.getName()} is already defined`);
    }

    viewHelpers[instance.getNamespace()][instance.getName()] = ViewHelper;
}

export function getViewHelper(namespacedName: string): new () => AbstractViewHelper<Dict<unknown>>;
export function getViewHelper(namespace: string, name: string): new () => AbstractViewHelper<Dict<unknown>>;
export function getViewHelper(
    namespace: string,
    name: string = undefined,
): new () => AbstractViewHelper<Dict<unknown>> {
    if (name === undefined) {
        const [space, name] = namespace.split(":", 2).map((str) => str.toLowerCase());
        return getViewHelper(space, name);
    }

    return viewHelpers[namespace][name];
}
