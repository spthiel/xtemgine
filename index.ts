import * as engine from "./src/library/Engine.js";
import IfViewHelper from "./src/library/core/ViewHelpers/IfViewHelper.js";
import {registerViewHelper} from "./src/library/ViewHelpers.js";
import ThenViewHelper from "./src/library/core/ViewHelpers/ThenViewHelper.js";
import ElseViewHelper from "./src/library/core/ViewHelpers/ElseViewHelper.js";

registerViewHelper(IfViewHelper);
registerViewHelper(ThenViewHelper);
registerViewHelper(ElseViewHelper);

let start: number;
