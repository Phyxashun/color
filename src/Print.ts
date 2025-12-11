// /src/Print.ts

/**
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
 **     import Print from './Print.ts';
 *
 * 2. Basic Usage (Logging Messages)
 * You can call Print directly like a function to log data. It accepts an 
 * optional message string and up to two optional values (value, value2).
 * 
 **     // Log a simple message
 **     Print("Application starting up.");
 **     // Output is stored internally until you call Print.log()
 *
 * 3. Logging Data (Values and Objects)
 * The utility intelligently handles different types of inputs, 
 * automatically using JSON.stringify for objects:
 * 
 **     const user = { id: 101, name: "Alice", active: true };
 **     const details = { loginCount: 42, lastLogin: new Date() };
 **
 **     // Log with a message and a single value (number/string/object)
 **     Print("User logged in:", user.id);
 **     Print("User details object:", user); // Object is stringified
 **
 **     // Log with a message and two values (both objects are stringified)
 **     Print("User data snapshot:", user, details);
 *
 * 4. Viewing the Logs (Print.log())
 * The data logged via the callable function is stored internally in an 
 * array until you explicitly call the .log() method. This method outputs 
 * the collected data using console.table and then clears the internal data 
 * store.
 * 
 **     // After logging the above messages:
 **     Print.log();
 *
 * When Print.log() is called, your console will display a formatted table 
 * similar to this:
 * 
 **     (index)     message	                            value	                                    Value2
 **     0	        Application starting up.		
 **     1	        User logged in:	101	
 **     2	        User details object:	            {"id":101,"name":"Alice","active":true}	
 **     3	        User data snapshot:	                {"id":101,"name":"Alice","active":true}     {"loginCount":42,"lastLogin":"2025-12-08T..."}
 *
 * 5. Accessing the Raw Data (Print.data) 
 * You can directly access the raw array of logged objects via the .data 
 * property. You can read from it or assign an entirely new array to it.
 * 
 **     // Read the current data array
 **     console.log(Print.data.length + " entries currently pending log.");
 **
 **     // Clear the data manually without logging
 **     Print.data = [];
 *
 */

interface PrintEntry {
    message: string;
    value?: any;
}

/**
 * Interface defining the structure of the Print instance.
 * Combines a callable function signature with data storage and logging methods.
 */
interface PrintInstance {
    /**
     * Callable function signature for logging messages and values.
     * @param message - Optional message to log
     * @param value - Optional first value (can be any type)
     * @param value2 - Optional second value (can be any type)
     */
    add(message?: string, value?: any, value2?: any): void;

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
    let internalData: PrintEntry[] = [];

    /**
     * Attach the log method to the callable function.
     * Outputs the accumulated data to console.table and clears the internal array.
     */
    const callableFunction = () => {
        if (internalData.length > 0) {
            // Display all log entries in a formatted table
            console.table(internalData);
            // Clear the internal data after displaying
            internalData = [];
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
    callableFunction.add = (message: string, value?: any): void => {
        // Not needed, but just in case
        if (!message && message !== '') {
            throw new SyntaxError('Print.add() utility expects a message string.');
        }

        // Case 1: No values provided, only message
        if (value === undefined) {
            internalData.push({
                message: message,
            });
        }
        // Case 2: Single object value provided
        else if (value !== null && typeof value === "object") {
            internalData.push({
                message: message,
                value: JSON.stringify(value),
            });
        }
        // Case 3: Single primitive value
        else {
            internalData.push({
                message: message,
                value: value,
            });
        }
    };

    /**
     * Outputs all accumulated log entries to log file and clears the data array.
     */
    callableFunction.log = (): void => {
        if (internalData.length === 0) {
            console.log("No information is currently loaded into the table.");
            return;
        }

        const fs = require("fs");
        const path = require("path");

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
        internalData = [];
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
            internalData = newData;
        },
        enumerable: true,
        configurable: true,
    });

    // Cast and return the enhanced function as a PrintInstance
    return callableFunction as PrintInstance;
};

/**
 * The singleton Print instance, ready to use throughout your application.
 * Import and use this instance for structured logging.
 * 
 * @example
 * ```typescript
 * import Print from './Print';
 * 
 * Print.add("Starting process");
 * Print.add("User ID:", 123);
 * Print.add("User data:", { name: "Alice", age: 30 });
 * Print(); // Displays all entries in console.table
 * ```
 */
export const Print: PrintInstance = createPrintInstance();