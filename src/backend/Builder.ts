import {IBuilder, IRootElement} from "../api/Types.js";

export default {
    build(root: IRootElement): string {
        throw new Error("Method not implemented.");
    },
} satisfies IBuilder<string>;
