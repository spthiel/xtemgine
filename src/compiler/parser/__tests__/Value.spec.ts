import {describe, expect, it} from "vitest";
import Value, {ValueSegment} from "../Value.js";

function test(string: string, ...expected: ValueSegment[]) {
    it(string, () => {
        const value = new Value(string);

        expect(value.segments).toStrictEqual(expected);
    });
}

describe("String value test", () => {
    test("", new ValueSegment(false, ""));
    test("simple string", new ValueSegment(false, "simple string"));
    test("simple {{with template}}", new ValueSegment(false, "simple "), new ValueSegment(true, "with template"));
    test(
        "simple {{ with space in template }}",
        new ValueSegment(false, "simple "),
        new ValueSegment(true, "with space in template"),
    );
    test(
        "simple {{ template }} string",
        new ValueSegment(false, "simple "),
        new ValueSegment(true, "template"),
        new ValueSegment(false, " string"),
    );
    test(
        "simple string with space and{{ template }} ",
        new ValueSegment(false, "simple string with space and"),
        new ValueSegment(true, "template"),
        new ValueSegment(false, " "),
    );
    test("{{ just template }}", new ValueSegment(true, "just template"));
});
