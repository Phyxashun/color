// /test/NewPrint.test.ts
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { Print } from "../src/NewPrint";
import fs from "fs";
import path from "path";
import Counter from "../src/utils/Counter";

vi.mock("fs");
vi.mock("path");

const letter = new Counter().auto().alpha();

describe("TEST: NewPrint Utility", () => {

    beforeEach(() => {
        Print.reset();
        Print.on();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        Print.reset();
        Print.on();
        vi.restoreAllMocks();
    });

    // -------------------------------------------------------
    // A: add()
    // -------------------------------------------------------
    describe(`TEST: ${letter}. add() basic behavior`, () => {
        letter.set("A");
        const num = new Counter();

        it(`${letter}.${num}. should add a simple message`, () => {
            Print.add("Hello");
            expect(Print.data).toEqual([{ message: "Hello" }]);
        });

        it(`${letter}.${num}. should add primitive value`, () => {
            Print.add("Age:", 33);
            expect(Print.data).toEqual([{ message: "Age:", value: 33 }]);
        });

        it(`${letter}.${num}. should handle string`, () => {
            Print.add("User:", "Dustin");
            expect(Print.data).toEqual([{ message: "User:", value: "Dustin" }]);
        });

        it(`${letter}.${num}. should stringify object`, () => {
            const obj = { a: 1, b: true };
            Print.add("Obj:", obj);
            expect(Print.data[0]).toEqual({
                message: "Obj:",
                value: JSON.stringify(obj),
            });
        });

        it(`${letter}.${num}. should stringify nested objects`, () => {
            const obj = { a: { b: 2 } };
            Print.add("Nested:", obj);
            expect(Print.data[0].value).toBe(JSON.stringify(obj));
        });

        it(`${letter}.${num}. should stringify arrays`, () => {
            Print.add("Arr:", [1, 2, 3]);
            expect(Print.data[0].value).toBe("[1,2,3]");
        });

        it(`${letter}.${num}. should throw with no args`, () => {
            expect(() => Print.add()).toThrow(SyntaxError);
        });

        it(`${letter}.${num}. should treat null as primitive`, () => {
            Print.add("Null:", null);
            expect(Print.data[0]).toEqual({ message: "Null:", value: null });
        });

        it(`${letter}.${num}. should stringify Date`, () => {
            const d = new Date("2025-01-01T00:00:00Z");
            Print.add("When:", d);
            expect(Print.data[0].value).toBe(JSON.stringify(d));
        });

        it(`${letter}.${num}. should accept empty string`, () => {
            Print.add("", 123);
            expect(Print.data[0]).toEqual({ message: "", value: 123 });
        });

        it(`${letter}.${num}. undefined + undefined throws`, () => {
            expect(() => Print.add(undefined, undefined)).toThrow(SyntaxError);
        });
    });

    // -------------------------------------------------------
    // B: mixed types
    // -------------------------------------------------------
    letter.set("B");

    describe(`TEST: ${letter}. mixed type handling`, () => {

        letter.set("B");
        const num = new Counter();

        it(`${letter}.${num}. should allow booleans`, () => {
            Print.add("Flag:", false);
            expect(Print.data[0]).toEqual({ message: "Flag:", value: false });
        });

        it(`${letter}.${num}. should allow zero`, () => {
            Print.add("Zero:", 0);
            expect(Print.data[0]).toEqual({ message: "Zero:", value: 0 });
        });

        it(`${letter}.${num}. should accept symbols`, () => {
            const sym = Symbol("test");
            Print.add("Symbol:", sym);
            expect(Print.data[0]).toEqual({ message: "Symbol:", value: sym });
        });
    });

    // -------------------------------------------------------
    // C: data property
    // -------------------------------------------------------
    letter.set("C");

    describe(`TEST: ${letter}. data property`, () => {

        letter.set("C");
        const num = new Counter();

        it(`${letter}.${num}. should allow reading`, () => {
            Print.add("Hello");
            expect(Print.data.length).toBe(1);
        });

        it(`${letter}.${num}. should allow overwriting`, () => {
            Print.data = [{ message: "X", value: 1 }];
            expect(Print.data).toEqual([{ message: "X", value: 1 }]);
        });

        it(`${letter}.${num}. should replace data`, () => {
            Print.add("A");
            Print.data = [{ message: "B" }];
            expect(Print.data).toEqual([{ message: "B" }]);
        });
    });

    // -------------------------------------------------------
    // D: execute()/callable behavior
    // -------------------------------------------------------
    letter.set("D");

    describe(`TEST: ${letter}. execute() & callable behavior`, () => {

        letter.set("D");
        const num = new Counter();

        it(`${letter}.${num}. should execute and display table`, () => {
            const tableMock = vi.spyOn(console, "table").mockImplementation(() => { });
            Print.add("X", 123);
            Print();
            expect(tableMock).toHaveBeenCalled();
            expect(Print.data).toEqual([
                {
                    "message": "X",
                    "value": 123,
                }
            ]);
        });

        it(`${letter}.${num}. should log when empty`, () => {
            const logMock = vi.spyOn(console, "log").mockImplementation(() => { });
            Print();
            expect(logMock).toHaveBeenCalledWith(
                "No information is currently loaded into the table."
            );
        });
    });

    // -------------------------------------------------------
    // E: enable/disable/reset
    // -------------------------------------------------------
    letter.set("E");

    describe(`TEST: ${letter}. on/off/reset behavior`, () => {

        letter.set("E");
        const num = new Counter();

        it(`${letter}.${num}. should not add when off`, () => {
            Print.off();
            Print.add("Hello");
            expect(Print.data).toEqual([]);
        });

        it(`${letter}.${num}. should add when on`, () => {
            Print.on();
            Print.add("Hello");
            expect(Print.data).toEqual([{ message: "Hello" }]);
        });

        it(`${letter}.${num}. should reset data`, () => {
            Print.add("X");
            Print.reset();
            expect(Print.data).toEqual([]);
        });
    });
});
