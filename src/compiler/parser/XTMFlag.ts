export enum WhitespaceMode {
    COLLAPSE = "collapse",
    LINEBREAK = "linebreak",
    PRESERVE = "pre",
}

const flags = {
    whitespace: WhitespaceMode.COLLAPSE,
};

export type XTMFlags = typeof flags;

export default {
    new() {
        return structuredClone(flags);
    },
};
