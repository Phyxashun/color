// Print.ts

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
 * optional message string and up to two optional values (value1, value2).
 * 
 **     // Log a simple message
 **     Print.add("Application starting up.");
 **     // Output is stored internally until you call Print()
 *
 * 3. Logging Data (Values and Objects)
 * The utility intelligently handles different types of inputs, 
 * automatically using JSON.stringify for objects:
 * 
 **     const user = { id: 101, name: "Alice", active: true };
 **     const details = { loginCount: 42, lastLogin: new Date() };
 **
 **     // Log with a message and a single value (number/string/object)
 **     Print.add("User logged in:", user.id);
 **     Print.add("User details object:", user); // Object is stringified
 *
 * 4. Viewing the Logs (Print())
 * The data logged via the callable function is stored internally in an 
 * array until you explicitly call the Print() method. This method outputs 
 * the collected data using console.table and then clears the internal data 
 * store.
 * 
 **     // After logging the above messages:
 **     Print();
 *
 * When Print() is called, your console will display a formatted table 
 * similar to this:
 * 
 **     (index)     Message	                            Value1	                                    Value2
 **     0	        Application starting up.		
 **     1	        User logged in:	101	
 **     2	        User details object:	            {"id":101,"name":"Alice","active":true}	
 **     3	        User data snapshot:	                {"id":101,"name":"Alice","active":true}     {"loginCount":42,"lastLogin":"2025-12-08T..."}
 *
 * 5. Accessing the Raw Data (Print.data) 
 * You can directly access the raw array of logged objects via the .data 
 * property. You can read from it or assign an entirely new array to it.
 * and reset/clear the internal buffer if needed.
 * 
 **     // Read the current data array
 **     console.log(Print.data.length + " entries currently pending log.");
 **
 **     // Clear the data manually without logging
 **     Print.data = [];
 **
 **     // Clear the internal buffer without logging
 **     Print.reset();
 *
 */

// Type defining the data entries and input values
type PrintEntry = { message: string, value?: any; };

/**
 * Interface defining the structure of the Print instance.
 * Combines a callable function signature with data storage and logging methods.
 */
interface PrintInstance {
    /**
     * Callable function that outputs accumulated log entries via console.table.
     * Calling Print() displays the table and clears the data.
     */
    (): PrintEntry[] | void;

    /**
     * Adds a message/value entry to the internal log buffer.
     */
    add(message: string, value?: any): void;

    /**
     * Resets the internal log buffer without outputting data.
     */
    reset(): void;

    /**
     * Raw log data array. Can be read or replaced.
     */
    data: PrintEntry[];
}

class PrintClass {
    private internalData: PrintEntry[] = [];

    constructor() {
        // @ts-expect-error PrintInstance is not PrintClass
        return new Proxy(this.callable.bind(this), {
            get: (_, prop) => {
                // Expose class methods/properties through the callable
                if (prop in this) {
                    // @ts-ignore dynamic access
                    return this[prop];
                }
            },
            set: (_, prop, value) => {
                if (prop === "data") {
                    this.internalData = value;
                    return true;
                }
                // @ts-ignore dynamic access
                this[prop] = value;
                return true;
            }
        }) as unknown as PrintInstance;
    }

    /** Callable: Print the table and clear it */
    private callable(): PrintEntry[] | void {
        if (this.internalData.length === 0) {
            console.log("No information is currently loaded into the table.");
            return;
        }
        const temp = [...this.internalData];
        this.internalData = [];
        console.table(temp);
        return temp;
    }

    /** Add an entry */
    public add(message: string, value?: any): void {
        if (!message && !value)
            throw new SyntaxError("Print.add() requires 1 to 2 parameters.");

        // Only message
        if (message && value === undefined) {
            this.internalData.push({ message });
            return;
        }

        // Object → stringify
        if (value !== null && typeof value === "object") {
            this.internalData.push({
                message,
                value: JSON.stringify(value),
            });
            return;
        }

        // Primitive values
        this.internalData.push({ message, value });
    }

    /** Reset internal store */
    public reset(): void {
        this.internalData = [];
    }

    /** Raw data accessor */
    public get data(): PrintEntry[] {
        return this.internalData;
    }

    public set data(value: PrintEntry[]) {
        this.internalData = value;
    }
}

// Singleton instance (callable)
// @ts-expect-error PrintInstance is not PrintClass
const Print: PrintInstance = new PrintClass();

export default Print;
