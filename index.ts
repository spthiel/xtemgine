import * as engine from "./src/library/Engine.js";
import IfViewHelper from "./src/library/core/ViewHelpers/IfViewHelper.js";
import {registerViewHelper} from "./src/library/ViewHelpers.js";
import ThenViewHelper from "./src/library/core/ViewHelpers/ThenViewHelper.js";
import ElseViewHelper from "./src/library/core/ViewHelpers/ElseViewHelper.js";
import {JSDOM} from "jsdom";

registerViewHelper(IfViewHelper);
registerViewHelper(ThenViewHelper);
registerViewHelper(ElseViewHelper);

let start: number;

async function run() {
    const dom: JSDOM = await JSDOM.fromFile("test.html");
    start = Date.now();
    for (let i = 0; i < 10000; i++) {
        await engine.renderDom(dom, {foo: "bar"});
    }
}

setTimeout(() => {
    run().then(() => {
        const end = Date.now();
        console.log(end - start);
    });
}, 5000);
