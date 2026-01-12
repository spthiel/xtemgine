import ParserTextNode from "./parser/ParserTextNode.js";
import Node from "./parser/Node.js";
import ParserNode from "./parser/ParserNode.js";
import UniqueIds from "./UniqueIds.js";
import Value from "./parser/Value.js";

function printTree(rootNode: ParserNode) {
    const nodesToPrint: [string, Node][] = rootNode.children.map((node) => ["root", node]);
    const uniqueID = new UniqueIds();
    let out = `const root = api.root();\n`;

    while (nodesToPrint.length > 0) {
        const [parentVar, currentNode] = nodesToPrint.shift();
        let nodeName: string = undefined;

        if (currentNode instanceof ParserNode) {
            nodeName = uniqueID.nextID("el");
            currentNode.children.forEach((child) => {
                nodesToPrint.push([nodeName, child]);
            });
        }

        let node: string;

        if (currentNode instanceof ParserNode) {
            node = createElement(currentNode.name, currentNode.attributes);
        } else if (currentNode instanceof ParserTextNode) {
            node = createText(currentNode.value);
        } else {
            continue;
        }

        out += createAppendStore(nodeName, parentVar, node);
        out += "\n";
    }

    out += "return root;";

    return out;
}

function createFunction(templateName: string, content: string) {
    return `export function ${templateName}(api) {\n${content}\n}`;
}

function createElement(type: string, attributes: Map<string, Value> = new Map()): string {
    let out = `api.createElement("${type}"`;

    let hasAny = false;

    for (const key of attributes.keys()) {
        if (!hasAny) {
            out += ", {";
        } else {
            out += ", ";
        }
        hasAny = true;

        const value = attributes.get(key);

        out += `"${key}": ${createAttribute(value)}`;
    }

    if (hasAny) {
        out += "}";
    }

    out += ")";

    return out;
}

function createAttribute(text: Value) {
    if (text.isSimpleString()) {
        return `api.createAttribute(${text.asArray()[0]})`;
    }
    return `api.createAttribute(${text.asArray().join(", ")})`;
}

function createText(text: Value) {
    return `api.createText(${text.asArray().join(", ")})`;
}

function createAppend(appendTo: string, append: string) {
    return `${appendTo}.appendChild(${append});`;
}

function createAppendStore(outVariableName: string | undefined, appendTo: string, append: string) {
    if (!outVariableName) {
        return createAppend(appendTo, append);
    }
    return `const ${outVariableName} = ${createAppend(appendTo, append)}`;
}

export default {
    createFunction,
    createAppend,
    createElement,
    createText,
    createAppendStore,
    printTree,
};
