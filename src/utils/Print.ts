// /src/Print.ts

import fs from "fs";
import path from "path";

/**
 ** Print() - Print utility
 * 
 * This code defines a utility named createPrintInstance that generates a 
 * callable function, named Print, which acts as a structured logger. It 
 * allows you to log messages and data in a structured format and display 
 * them using console.table.
 * 
 * Here is how to use it in your project:
 * 
 * 1. Import the utility
 * Assuming the code provided is in a file named PrintUtil.ts (or similar), 
 * you would import the Print instance:
 * 
 **    import Print from './Print.ts';
 *
 * 2. Basic Usage (Logging Messages)
 * You can call Print directly like a function to log data. It accepts an 
 * optional message string and up to two optional values (value, value2).
 * 
 **    // Log a simple message
 **     Print.add("Application starting up."); // Use Print.add instead of direct call for consistency
 **    // Output is stored internally until you call Print.log()
 *
 * 3. Logging Data (Values and Objects)
 * The utility intelligently handles different types of inputs, 
 * automatically using JSON.stringify for objects:
 * 
 **    const user = { id: 101, name: "Alice", active: true };
 **    const details = { loginCount: 42, lastLogin: new Date() };
 **
 **    // Log with a message and a single value (number/string/object)
 **    Print.add("User logged in:", user.id);
 **    Print.add("User details object:", user); // Object is stringified
 **
 **    // Log with a message and two values (both objects are stringified)
 **    // Note: Your current 'add' only supports one value after the message.
 **    // If you need two, the 'add' method's signature would need adjustment.
 **    // For now, I've kept it to one value.
 **    // Example if 'add' was extended: Print.add("User data snapshot:", user, details);
 *
 * 4. Viewing the Logs (Print()) and Writing to File (Print.log())
 * The data logged via Print.add() is stored internally.
 * Call Print() to display to console.table and clear the internal data store.
 * Call Print.log() to write to a log file and clear the internal data store.
 * 
 **    // After logging the above messages:
 **    Print(); // Displays to console.table
 **    Print.log(); // Writes to file
 *
 * When Print() is called, your console will display a formatted table 
 * similar to this:
 * 
 **    (index)     message                                      value                                             Value2
 **    0           Application starting up.             
 **    1           User logged in: 101 
 **    2           User details object:                         {"id":101,"name":"Alice","active":true} 
 **    3           User data snapshot:                          {"id":101,"name":"Alice","active":true}      {"loginCount":42,"lastLogin":"2025-12-08T..."}
 *
 * 5. Accessing the Raw Data (Print.data) 
 * You can directly access the raw array of logged objects via the .data 
 * property. You can read from it or assign an entirely new array to it.
 * 
 **    //Read the current data array
 **    console.log(Print.data.length + " entries currently pending log.");
 **
 **    // Clear the data manually without logging
 **    Print.data = [];
 *
 * 6. Toggling Print (Print.on(), Print.off())
 * You can enable or disable the print utility globally.
 * 
 **    Print.off(); // Disable all printing
 **    Print.add("This message will not be added or displayed.");
 **    Print(); // Will say "No information..." or do nothing if no data was collected before turning off
 **    Print.log(); // Will not write to file
 **    Print.on();  // Enable printing again
 **    Print.add("This message will be added and can be displayed.");
 * 
 */

/**
 * Interface defining the structure of logged data based on the types 
 * and presence of arguments.
 */
interface PrintEntry {
    /**
     * Optional message string to include in the log entry
     */
    message?: string;

    /**
     * Optional value (objects are JSON.stringified)
     */
    value?: any;
}

/**
 * Interface defining the structure of the Print instance.
 * Combines a callable function signature with data storage and logging methods.
 */
interface PrintInstance {
    /**
     * Callable function signature for logging messages and values.
     * 
     * @param args:
     *      @param message - Optional message to log
     *      @param value   - Optional value (can be any type)
     */
    add(...args: any[]): void;

    /**
     * Array storing all logged entries until log() is called.
     * Can be read or set directly for manual data management.
     */
    data: PrintEntry[];

    /**
     * Outputs all accumulated log entries to log file and clears the data array.
     */
    log(): void;

    /**
     * Enables the Print utility.
     */
    on(): void;

    /**
     * Disables the Print utility.
     */
    off(): void;

    /**
     * Reset internal data array.
     */
    reset(): void;

    /**
     * Outputs all accumulated log entries to console.table and clears the data array.
     */
    (): void;
}

/**
 * Factory function that creates a PrintInstance with internal state management.
 * Returns a callable function that also has data and log properties.
 * 
 * @returns A PrintInstance that can be called as a function and has data/log methods
 */
const createPrintInstance = (): PrintInstance => {
    /**
     * Internal array storing log entries.
     * Each entry is an object with message, value, and/or Value2 properties.
     */
    const internalData: PrintEntry[] = [];
    let isEnabled = true; // State to track if printing is on or off

    /**
     * Attach the console.table method to the callable Print() function.
     * Outputs the accumulated data to console.table and clears the internal array.
     */
    const callableFunction = () => {
        if (!isEnabled) return; // Do nothing if turned off

        if (internalData.length > 0) {
            // Display all log entries in a formatted table
            console.table(internalData);
            // Clear the internal data after displaying
            callableFunction.reset();
        } else {
            // Inform the user that there's no data to display
            console.log("No information is currently loaded into the table.");
        }
    };

    /**
     * The main callable function that handles logging logic.
     * Determines the structure of logged data based on the types and presence of arguments.
     * 
     * @param message - Optional message string to include in the log entry
     * @param value - Optional first value (objects are JSON.stringified)
     */
    callableFunction.add = (...args: any[]): void => {
        if (!isEnabled) return; // Do nothing if turned off

        const [currentMessage, currentValue] = [...args];

        // Not needed, but just in case
        if (currentMessage === undefined && currentMessage !== '') {
            throw new SyntaxError('Print.add() utility expects a message string.');
        }

        // Case 1: No values provided, only message
        if (currentValue === undefined) {
            internalData.push({
                message: currentMessage,
            });
        }
        // Case 2: Single object value provided
        else if (currentValue !== null && typeof currentValue === "object") {
            internalData.push({
                message: currentMessage,
                value: JSON.stringify(currentValue),
            });
        }
        // Case 3: Single primitive value
        else {
            internalData.push({
                message: currentMessage,
                value: currentValue,
            });
        }
    };

    /**
     * Outputs all accumulated log entries to log file and clears the data array.
     */
    callableFunction.log = (): void => {
        if (!isEnabled) return; // Do nothing if turned off

        console.log("INTERNALDATA.LENGTH:", internalData.length);
        if (internalData.length === 0) {
            console.log("No information is currently loaded into the table.");
            return;
        }

        // Create date string YYYY-MM-DD
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;

        // Build log directory & file path
        const logDir = path.resolve("./test/log");
        const logFile = path.join(logDir, `${dateString}-print.log`);

        // Ensure directory exists
        fs.mkdirSync(logDir, { recursive: true });

        // Build log text lines
        const now = () => new Date().toISOString().replace("T", " ").split(".")[0];

        const lines = internalData.map(entry => {
            const v = entry.value !== undefined ? entry.value : "";
            return `${now()} | ${entry.message}${v !== "" ? " | " + v : ""}`;
        });

        // Append to file
        fs.appendFileSync(logFile, lines.join("\n") + "\n", "utf8");

        // Confirm to console
        console.log(`Wrote ${internalData.length} entries to ${logFile}`);

        // Clear internal data after writing
        callableFunction.reset();
    };

    /**
     * Enables the Print utility.
     */
    callableFunction.on = (): void => {
        isEnabled = true;
    };

    /**
     * Disables the Print utility.
     */
    callableFunction.off = (): void => {
        isEnabled = false;
    };

    /**
     * Reset the internal data array
     */
    callableFunction.reset = (): void => {
        internalData.length = 0;
    };

    /**
     * Define a getter/setter property 'data' on the callable function.
     * Allows external access to read or replace the internal data array.
     */
    Object.defineProperty(callableFunction, "data", {
        /**
         * Getter: Returns the current internal data array
         */
        get() {
            return internalData;
        },
        /**
         * Setter: Replaces the internal data array with a new array
         * @param newData - The new array to set as internal data
         */
        set(newData: any[]) {
            internalData.length = 0;
            internalData.push(...newData);
        },
        enumerable: true,
        configurable: true,
    });

    // Cast and return the enhanced function as a PrintInstance
    return callableFunction as PrintInstance;
};

/**
 * The singleton Print instance, ready to use throughout your application.
 * 
 * @example
 * ```typescript
 * import { Print } from './Print';
 * 
 * Print.on(); // Ensure printing is enabled
 * Print.add("Starting process");
 * Print.add("User ID:", 123);
 * 
 * Print.off(); // Disable printing
 * Print.add("This will not be logged because Print is off"); // This call does nothing
 * 
 * Print.on(); // Re-enable printing
 * Print.add("User data:", { name: "Alice", age: 30 });
 * 
 * Print(); // Displays "Starting process", "User ID: 123", and "User data: {name...}" to console.table
 * Print.log(); // Writes the same to the log file.
 * ```
 */
export const Print: PrintInstance = createPrintInstance();