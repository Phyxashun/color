// Print.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Print from '../src/Print.ts';

describe('Print Utility', () => {
    // Store original console methods
    let consoleTableSpy: any;
    let consoleLogSpy: any;

    beforeEach(() => {
        // Clear any existing data before each test
        Print.data = [];
        // Spy on console methods
        consoleTableSpy = vi.spyOn(console, 'table').mockImplementation(() => { });
        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restore console methods after each test
        consoleTableSpy.mockRestore();
        consoleLogSpy.mockRestore();
    });

    describe('Basic Logging', () => {
        it('should log a message without values', () => {
            Print("Test message");

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Test message"
            });
        });

        it('should log a message with a primitive value', () => {
            Print("User ID:", 123);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "User ID:",
                Value1: 123
            });
        });

        it('should log a message with a string value', () => {
            Print("Username:", "Alice");

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Username:",
                Value1: "Alice"
            });
        });

        it('should log a message with two primitive values', () => {
            Print("Coordinates:", 10, 20);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Coordinates:",
                Value1: 10,
                Value2: 20
            });
        });

        it('should handle undefined message', () => {
            Print(undefined, 42);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: undefined,
                Value1: 42
            });
        });
    });

    describe('Object Handling', () => {
        it('should stringify a single object value', () => {
            const user = { id: 101, name: "Alice" };
            Print("User data:", user);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "User data:",
                Value1: JSON.stringify(user)
            });
        });

        it('should stringify two object values', () => {
            const user = { id: 101, name: "Alice" };
            const details = { loginCount: 42 };
            Print("User snapshot:", user, details);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "User snapshot:",
                Value1: JSON.stringify(user),
                Value2: JSON.stringify(details)
            });
        });

        it('should handle nested objects', () => {
            const nested = {
                user: { id: 1, profile: { name: "Bob" } },
                settings: { theme: "dark" }
            };
            Print("Nested data:", nested);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0].Value1).toBe(JSON.stringify(nested));
        });

        it('should handle arrays as objects', () => {
            const arr = [1, 2, 3];
            Print("Array data:", arr);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Array data:",
                Value1: JSON.stringify(arr)
            });
        });
    });

    describe('Mixed Type Handling', () => {
        it('should handle primitive value1 and object value2', () => {
            const obj = { key: "value" };
            Print("Mixed:", 42, obj);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Mixed:",
                Value1: 42,
                Value2: obj
            });
        });

        it('should handle object value1 and primitive value2', () => {
            const obj = { key: "value" };
            Print("Mixed:", obj, 42);

            expect(Print.data).toHaveLength(1);
            // When value1 is object and value2 exists (not in the "both objects" case),
            // it falls through to the final else, so value1 is NOT stringified
            expect(Print.data[0]).toEqual({
                Message: "Mixed:",
                Value1: obj,
                Value2: 42
            });
        });

        it('should handle boolean values', () => {
            Print("Flag:", true, false);

            expect(Print.data).toHaveLength(1);
            // false is falsy, so !value2 is true, falls into the "no value2" case
            expect(Print.data[0]).toEqual({
                Message: "Flag:",
                Value1: true
            });
        });
    });

    describe('Multiple Entries', () => {
        it('should accumulate multiple log entries', () => {
            Print("First entry");
            Print("Second entry", 123);
            Print("Third entry", { key: "value" });

            expect(Print.data).toHaveLength(3);
            expect(Print.data[0].Message).toBe("First entry");
            expect(Print.data[1].Message).toBe("Second entry");
            expect(Print.data[2].Message).toBe("Third entry");
        });
    });

    describe('Print.log() Method', () => {
        it('should call console.table with data and clear the array', () => {
            Print("Test message");
            Print("Another message", 42);

            expect(Print.data).toHaveLength(2);

            Print.log();

            expect(consoleTableSpy).toHaveBeenCalledWith([
                { Message: "Test message" },
                { Message: "Another message", Value1: 42 }
            ]);
            expect(Print.data).toHaveLength(0);
        });

        it('should display message when no data is present', () => {
            Print.log();

            expect(consoleLogSpy).toHaveBeenCalledWith(
                "No information is currently loaded into the table."
            );
            expect(consoleTableSpy).not.toHaveBeenCalled();
        });

        it('should clear data after logging', () => {
            Print("Message 1");
            Print("Message 2");

            expect(Print.data).toHaveLength(2);

            Print.log();

            expect(Print.data).toHaveLength(0);
        });

        it('should allow logging again after clear', () => {
            Print("First batch");
            Print.log();

            Print("Second batch");
            expect(Print.data).toHaveLength(1);
            expect(Print.data[0].Message).toBe("Second batch");
        });
    });

    describe('Print.data Property', () => {
        it('should allow direct read access to data', () => {
            Print("Test");

            const data = Print.data;
            expect(data).toHaveLength(1);
            expect(data[0].Message).toBe("Test");
        });

        it('should allow direct write access to data', () => {
            Print("Original");
            expect(Print.data).toHaveLength(1);

            Print.data = [];
            expect(Print.data).toHaveLength(0);
        });

        it('should allow setting custom data array', () => {
            const customData = [
                { Message: "Custom 1", Value1: 100 },
                { Message: "Custom 2", Value1: 200 }
            ];

            Print.data = customData;

            expect(Print.data).toHaveLength(2);
            expect(Print.data).toEqual(customData);
        });

        it('should maintain reference after setting', () => {
            Print("Test");
            const originalData = Print.data;

            Print("Another test");

            // Should still reference the same internal array
            expect(originalData).toHaveLength(2);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null values', () => {
            Print("Null test:", null);

            expect(Print.data).toHaveLength(1);
            // null is falsy, so !value1 is true, falls into the "no values" case
            expect(Print.data[0]).toEqual({
                Message: "Null test:"
            });
        });

        it('should handle empty string', () => {
            Print("");

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: ""
            });
        });

        it('should handle zero values', () => {
            Print("Zero:", 0, 0);

            expect(Print.data).toHaveLength(1);
            // 0 is falsy, so !value1 is true, falls into the "no values" case
            expect(Print.data[0]).toEqual({
                Message: "Zero:"
            });
        });

        it('should handle Date objects', () => {
            const date = new Date('2025-12-08');
            Print("Date:", date);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0].Value1).toBe(JSON.stringify(date));
        });

        it('should handle empty object', () => {
            Print("Empty:", {});

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Empty:",
                Value1: "{}"
            });
        });

        it('should handle empty array', () => {
            Print("Empty array:", []);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0]).toEqual({
                Message: "Empty array:",
                Value1: "[]"
            });
        });
    });

    describe('Type Safety', () => {
        it('should work with TypeScript types', () => {
            interface User {
                id: number;
                name: string;
            }

            const user: User = { id: 1, name: "Alice" };
            Print("Typed user:", user);

            expect(Print.data).toHaveLength(1);
            expect(Print.data[0].Value1).toBe(JSON.stringify(user));
        });
    });
});