import * as fsPromise from "node:fs/promises";
import {JSDOM} from "jsdom";
import {Dict} from "./Types.js";
import {Renderer} from "./Renderer.js";

async function readFile(path: string, encoding: BufferEncoding = "utf-8") {
    return await fsPromise.readFile(path, {encoding});
}

async function readTemplate(template: string): Promise<JSDOM> {
    return new JSDOM(template);
}

export async function renderDom(template: JSDOM, data: Dict<unknown>) {
    const engine = new Engine(template);

    return await engine.render(data);
}

export async function renderString(template: string, data: Dict<unknown>) {
    const dom = await readTemplate(template);

    return await renderDom(dom, data);
}

export async function renderFile(path: string, data: Dict<unknown>, encoding: BufferEncoding = "utf8") {
    const template = await readFile(path, encoding);

    return await renderString(template, data);
}

export class Engine {
    constructor(private template: JSDOM) {}

    render(data: Dict<unknown>) {
        const renderer = new Renderer(this.template, data);

        return renderer.render();
    }
}
