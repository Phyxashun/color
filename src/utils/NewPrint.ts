// /src/NewPrint.ts

import fs from 'fs';
import path from 'path';

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
 * Type defining the structure of arguments.
 */
type PrintArguments = PrintEntry[];

/**
 * Class defining the structure of a Print instance. Combines 
 * a callable function signature with data storage and logging methods.
 */
class PrintInstance {
    /**
     * Array storing all logged entries until log() is called.
     * Can be read or set directly for manual data management.
     */
    private readonly internalData: PrintArguments = [];

    /**
     * State to track if printing is on or off
     */
    private isEnabled: boolean = true;

    constructor() { }

    /**
     * Define a getter/setter property 'data' on the callable function.
     * Allows external access to read or replace the internal data array.
     */

    /**
     * Getter:
     * @returns The current internal data array
     */
    public get data(): PrintArguments { return this.internalData; };

    /**
     * Setter: Replaces the internal data array with a new array
     * @param newData - The new array to set as internal data
     */
    public set data(newData: PrintArguments) {
        this.internalData.length = 0;
        this.internalData.push(...newData);
    }

    /**
     * The main callable function that handles logging logic.
     * Determines the structure of logged data based on the types and presence of arguments.
     * 
     * @param message - Optional message string to include in the log entry
     * @param value - Optional first value (objects are JSON.stringified)
     */
    public add(...args: any[]): void {
        if (!this.isEnabled) return; // Do nothing if turned off

        const [currentMessage, currentValue] = [...args];

        // Not needed, but just in case
        if (currentMessage === undefined && currentMessage !== '') {
            throw new SyntaxError('Print.add() utility expects a message string.');
        }

        // Case 1: No values provided, only message
        if (currentValue === undefined) {
            this.internalData.push({
                message: currentMessage,
            });
        }
        // Case 2: Single object value provided
        else if (currentValue !== null && typeof currentValue === "object") {
            this.internalData.push({
                message: currentMessage,
                value: JSON.stringify(currentValue),
            });
        }
        // Case 3: Single primitive value
        else {
            this.internalData.push({
                message: currentMessage,
                value: currentValue,
            });
        }
    };

    /**
     * Outputs all accumulated log entries to log file and clears the data array.
     */
    public log(): void {
        if (!this.isEnabled) return; // Do nothing if turned off

        console.log("INTERNALDATA.LENGTH:", this.internalData.length);
        if (this.internalData.length === 0) {
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

        const lines = this.internalData.map(entry => {
            const v = entry.value !== undefined ? entry.value : "";
            return `${now()} | ${entry.message}${v !== "" ? " | " + v : ""}`;
        });

        // Append to file
        fs.appendFileSync(logFile, lines.join("\n") + "\n", "utf8");

        // Confirm to console
        console.log(`Wrote ${this.internalData.length} entries to ${logFile}`);

        // Intentionally clearing internal data after writing to prevent double logging
        this.reset();
    };

    /**
     * Enables the Print utility.
     */
    public on(): void {
        this.isEnabled = true;
    }

    /**
     * Disables the Print utility.
     */
    public off(): void {
        this.isEnabled = false;
    }

    /**
     * Reset the internal data array
     */
    public reset(): void {
        this.internalData.length = 0;
    }

    /**
     * Attach the console.table method to the callable Print() function.
     * Outputs the accumulated data to console.table and clears the internal array.
     */
    public execute(): void {
        if (!this.isEnabled) return; // Do nothing if turned off

        if (this.internalData.length > 0) {
            // Display all log entries in a formatted table
            const result = JSON.stringify(this.internalData, null, 2);
            console.table(result);

            // User should envoke the reset() method to
            // clear the internal data after displaying.
            //this.reset();
        } else {
            // Inform the user that there's no data to display
            console.log("No information is currently loaded into the table.");
        }
    }
}

type Callable = (() => any);
type PrintCallable = Callable & PrintInstance;
type PrintProxy = () => PrintCallable;
type PrintProps = keyof PrintCallable;

/**
 * Factory function to create a proxy for a PrintInstance object
 * 
 * @returns proxy
 */
const createPrintProxy: PrintProxy = (): PrintCallable => {
    const INSTANCE: PrintInstance = new PrintInstance();

    const CALLABLE: Callable = (): void => {
        return INSTANCE.execute();
    };

    /** 
     ** var Proxy: ProxyConstructor
     *  
     *      new <any>(target: any, handler: {
     *          apply?(target: any, thisArg: any, argArray: any[]): any;
     *          construct?(target: any, argArray: any[], newTarget: Function): object;
     *          defineProperty?(target: any, property: string | symbol, attributes: PropertyDescriptor): boolean;
     *          deleteProperty?(target: any, p: string | symbol): boolean;
     *          get?(target: any, p: string | symbol, receiver: any): any;
     *          getOwnPropertyDescriptor?(target: any, p: string | symbol): PropertyDescriptor | undefined;
     *          getPrototypeOf?(target: any): object | null;
     *          has?(target: any, p: string | symbol): boolean;
     *          ... 4 more ...;
     *          setPrototypeOf?(target: any, v: object | null): boolean;
     *      }) => any
     *  
     * Creates a Proxy object. The Proxy object allows you to create an 
     * object that can be used in place of the original object, but which 
     * may redefine fundamental Object operations like getting, setting, 
     * and defining properties. Proxy objects are commonly used to log 
     * property accesses, validate, format, or sanitize inputs.
     *  
     * @param _target A target object to wrap with Proxy.
     * @param _handler An object whose properties define the behavior 
     *                of Proxy when an operation is attempted on it.
     */
    const proxy = new Proxy(CALLABLE as any, {
        /**
         * The 'apply' trap intercepts calls to the proxy as a function (e.g., Print()).
         * 
         * @param target — The original callable object which is being proxied.
         * @param _thisArg The this object within the proxy.
         * @param _args The arguments to be passed to the proxied function.
         * @returns Any return value from the new function.
         */
        apply: (_target: PrintInstance, _thisArg: PrintInstance, _args: any[]): void => {
            // Make Print() run the execute() method
            return INSTANCE.execute();
        },

        /**
         * The 'get' trap intercepts calls to proxy properties.
         * 
         * @param _target The original object which is being proxied.
         * @param _prop The name or Symbol of the property to get.
         * @param _receiver The proxy or an object that inherits from the proxy.
         * @returns Any return value from the new function.
         */
        get: (_target: PrintInstance, _prop: PrintProps, _receiver: any): any => {
            // Forward everything to the instance
            return INSTANCE[_prop];
        },

        /**
         * The 'set' trap intercepts calls to proxy properties.
         * 
         * @param _target The original object which is being proxied.
         * @param _prop The name or Symbol of the property to set.
         * @param _value The value to set the property to.
         * @param _receiver The object to which the assignment was originally directed.
         * @returns Returns true if successful.
         */
        set: (_target: PrintInstance, _prop: PrintProps, _value: any, _receiver: any) => {
            INSTANCE[_prop] = _value;
            return true;
        },

        /**
         * The 'construct' trap intercepts calls using the 'new' operator (e.g., new Print())
         * 
         * @param _target The original object which is being proxied.
         * @param _args The arguments to be passed to the proxied function.
         * @param _newTarget The constructor that was originally called.
         * @returns The singleton PrintInstance object.
         */
        construct: (_target: PrintInstance, _args: any[], _newTarget: Function): PrintInstance => {
            // 
            return _target;
        }
    });

    return proxy as PrintCallable;
};

export const Print: PrintCallable = createPrintProxy();