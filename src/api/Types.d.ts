export interface IAttributeArray {
    raw(): string[];
    int(): number[];
    number(): number[];
    boolean(): boolean[];
}

export interface IAttribute {
    name(): string;
    raw(): string;
    int(): number;
    number(): number;
    boolean(): boolean;
    array(): IAttributeArray;
}

export interface IExpression {
    name(): string;
    raw(): string;
    int(): number;
    number(): number;
    boolean(): boolean;
    array(): IAttributeArray;
}

export interface ITextElement {}

export interface IElement {
    appendChild(child: IElement): IElement;
}

export interface IBuilder<T> {
    build(root: IRootElement): T;
}

export interface IRootElement extends IElement {
    build<T>(build: IBuilder<T>): T;
}

export interface IAPI {
    root(): IRootElement;
    createText(...segments: (string | IExpression)[]): ITextElement;
    createElement(tag: string, attributes: Record<string, IAttribute>): IElement;
    createAttribute(...segments: (string | IExpression)[]): IAttribute;
}

export interface ITemplateContainer {
    getTemplate(filename: string): IRootElement;
}
