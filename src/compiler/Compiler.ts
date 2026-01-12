import {PathLike} from "node:fs";
import UniqueIds from "./UniqueIds.js";
import * as fs from "node:fs/promises";
import {parse} from "node-html-parser";
import Parser from "./Parser.js";
import Printer from "./Printer.js";
import * as path from "node:path";

export default class {
    private uniqueID = new UniqueIds();

    constructor(private infile: PathLike) {}

    async compile(): Promise<string> {
        const file = await fs.readFile(this.infile, "utf-8");
        const dom = parse(file);

        const parser = new Parser(dom);

        const rootNode = parser.parse();

        const javascript = Printer.printTree(rootNode);

        const fullFunction = Printer.createFunction(path.basename("" + this.infile, ".html"), javascript);
        console.log(fullFunction);

        return "";
    }
}
