import AbstractFragmentBasedViewHelper from "../../ViewHelper/AbstractFragmentBasedViewHelper.js";
import {Dict} from "../../Types.js";
import CONSTANTS from "../CONSTANTS.js";

export default class ThenViewHelper extends AbstractFragmentBasedViewHelper<Dict<never>> {
    public getNamespace(): string {
        return CONSTANTS.viewhelper.coreNamespace;
    }

    public getName(): string {
        return "then";
    }
}
