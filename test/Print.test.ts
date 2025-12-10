import { describe, it, beforeEach, expect, vi } from "vitest";
import Print from "../src/Print";

describe("Print Utility (new version)", () => {

    beforeEach(() => {
        // Reset internal state
        Print.data = [];

        // Reset mocks
        vi.restoreAllMocks();
    });

    // -------------------------------------------------------
    // add() behavior
    // -------------------------------------------------------

    describe("add() basic behavior", () => {

        it("should add a simple message without value", () => {
            Print.add("Hello");

            expect(Print.data).toEqual([
                { message: "Hello" }
            ]);
        });

        it("should add a message with a primitive value", () => {
            Print.add("Age:", 33);

            expect(Print.data).toEqual([
                { message: "Age:", value: 33 }
            ]);
        });

        it("should handle string values", () => {
            Print.add("User:", "Dustin");

            expect(Print.data[0]).toEqual({
                message: "User:",
                value: "Dustin"
            });
        });

        it("should stringify an object", () => {
            const obj = { a: 1, b: true };

            Print.add("Obj:", obj);

            expect(Print.data[0]).toEqual({
                message: "Obj:",
                value: JSON.stringify(obj)
            });
        });

        it("should stringify nested objects", () => {
            const obj = { a: { b: 2 } };

            Print.add("Nested:", obj);

            expect(Print.data[0].value).toBe(JSON.stringify(obj));
        });

        it("should stringify arrays", () => {
            const arr = [1, 2, 3];

            Print.add("Arr:", arr);

            expect(Print.data[0].value).toBe('[1,2,3]');
        });

        it("should throw if called with no parameters", () => {
            // @ts-expect-error
            expect(() => Print.add()).toThrow(SyntaxError);
        });

        it("should treat `null` as primitive (not object)", () => {
            Print.add("Null:", null);

            expect(Print.data[0]).toStrictEqual({
                message: "Null:",
                value: null
            });
        });

        it("should treat Date objects as objects (stringified)", () => {
            const d = new Date("2025-01-01T00:00:00Z");

            Print.add("When:", d);

            expect(Print.data[0].value).toBe(JSON.stringify(d));
        });

        it("should accept empty string as message", () => {
            Print.add("", 123);

            expect(Print.data[0]).toEqual({
                message: "",
                value: 123
            });
        });

        it("should throw when message is undefined AND value is undefined", () => {
            // @ts-expect-error
            expect(() => Print.add(undefined, undefined)).toThrow(SyntaxError);
        });
    });

    // -------------------------------------------------------
    // Mixed type behavior
    // -------------------------------------------------------

    describe("mixed type handling", () => {

        it("should allow boolean values", () => {
            Print.add("Flag:", false);

            expect(Print.data[0]).toStrictEqual({
                message: "Flag:",
                value: false
            });
        });

        it("should allow zero values", () => {
            Print.add("Zero:", 0);

            expect(Print.data[0]).toEqual({
                message: "Zero:",
                value: 0
            });
        });

        it("should accept symbol values", () => {
            const sym = Symbol("test");
            Print.add("Symbol:", sym);

            expect(Print.data[0]).toEqual({
                message: "Symbol:",
                value: sym
            });
        });
    });

    // -------------------------------------------------------
    // data getter/setter
    // -------------------------------------------------------

    describe("data property", () => {

        it("should allow reading the data array", () => {
            Print.add("Hello");

            expect(Print.data.length).toBe(1);
        });

        it("should allow overwriting the data array", () => {
            Print.data = [{ message: "X", value: 1 }];

            expect(Print.data).toEqual([
                { message: "X", value: 1 }
            ]);
        });

        it("should replace data entirely, not append", () => {
            Print.add("A");
            Print.data = [{ message: "B" }];

            expect(Print.data).toEqual([{ message: "B" }]);
        });
    });

    // -------------------------------------------------------
    // Print() callable behavior
    // -------------------------------------------------------

    describe("Print() callable behavior", () => {

        it("should console.table() and clear data", () => {
            const tableMock = vi.spyOn(console, "table").mockImplementation(() => { });

            Print.add("Test:", 123);

            Print(); // invoke callable

            expect(tableMock).toHaveBeenCalledTimes(1);
            expect(Print.data).toEqual([]); // cleared
        });

        it("should log a message when no data exists", () => {
            const logMock = vi.spyOn(console, "log").mockImplementation(() => { });

            Print(); // no data

            expect(logMock).toHaveBeenCalledWith(
                "No information is currently loaded into the table."
            );
        });
    });

});
