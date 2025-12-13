// /test/Counter.ts

//******************************************************************************************/
//*                                                                                        */
//*                               Abstract BaseCounter Class                               */
//*                                                                                        */
//******************************************************************************************/

/**
 * Abstract base class defining shared counter behavior.
 * 
 * This class provides the core counter lifecycle:
 * initialization, auto-increment control, value access,
 * and a deterministic `next()` operation.
 *
 * @template T The counter value type (e.g., number or string)
 */
abstract class BaseCounter<T> {
    /**
     * Internal counter value.
     * Must be initialized by subclasses.
     */
    protected count!: T;

    /**
     * Controls whether `next()` automatically increments the counter.
     */
    public isAuto: boolean;

    /**
     * @param auto If true, `next()` automatically increments the counter.
     */
    constructor(auto: boolean = true) {
        this.isAuto = auto;
    }

    /**
     * Increases the current count by one unit.
     * @returns The current instance for method chaining.
     */
    abstract add(): this;

    /**
     * Decreases the current count by one unit.
     * @returns The current instance for method chaining.
     */
    abstract sub(): this;

    /**
     * Resets the counter to its initial starting value.
     * @returns The current instance for method chaining.
     */
    abstract reset(): this;

    /**
     * Enables or disables automatic incrementing.
     *
     * If no argument is provided, the current `isAuto` state is toggled.
     *
     * @param enable Explicit auto state override
     * @returns The current instance for method chaining.
     */
    public auto(enable?: boolean): this {
        this.isAuto = enable ?? !this.isAuto;
        return this;
    }

    /**
     * Returns the current counter value without mutating state.
     * @returns The current counter value
     */
    public get(): T {
        return this.count;
    }

    /**
     * Sets the counter to a specific value.
     *
     * @param value New counter value
     * @returns The current instance for method chaining.
     */
    public set(value: T): this {
        this.count = value;
        return this;
    }

    /**
     * Returns the current value and conditionally increments the counter.
     *
     * @throws Error if the counter has not been initialized
     * @returns The current counter value
     */
    public next(): T {
        if (this.count === undefined) {
            throw new Error('Counter(): Counter not initialized.');
        }

        const current = this.count;
        if (this.isAuto) this.add();
        return current;
    }
} // End Class BaseCounter

//******************************************************************************************/
//*                                                                                        */
//*                                   AlphaCounter Class                                   */
//*                                                                                        */
//******************************************************************************************/

/**
 * Alphabetic counter implementation.
 *
 * Cycles through uppercase letters A–Z with wraparound.
 */
class AlphaCounter extends BaseCounter<string> {
    /**
     * @param auto If true, `next()` automatically increments the counter.
     */
    constructor(auto: boolean = true) {
        super(auto);
        this.count = 'A';
    }

    /**
     * Advances the counter forward alphabetically.
     * @returns The current instance for method chaining.
     */
    public add(): this {
        this.count = this.handleAlpha('+');
        return this;
    }

    /**
     * Moves the counter backward alphabetically.
     * @returns The current instance for method chaining.
     */
    public sub(): this {
        this.count = this.handleAlpha('-');
        return this;
    }

    /**
     * Resets the counter to 'A'.
     * @returns The current instance for method chaining.
     */
    public reset(): this {
        this.count = 'A';
        return this;
    }

    /**
     * Performs alphabetic increment/decrement with wraparound.
     *
     * @param math '+' to increment, '-' to decrement
     * @returns The resulting uppercase letter
     */
    private handleAlpha(math: '+' | '-'): string {
        const code = this.count.charCodeAt(0) - 65;
        const next =
            math === '+'
                ? (code + 1) % 26
                : (code - 1 + 26) % 26;

        return String.fromCharCode(next + 65);
    }
} // End Class AlphaCounter

//******************************************************************************************/
//*                                                                                        */
//*                                  NumberCounter Class                                   */
//*                                                                                        */
//******************************************************************************************/

/**
 * Numeric counter implementation.
 */
class NumberCounter extends BaseCounter<number> {
    /**
     * @param auto If true, `next()` automatically increments the counter.
     */
    constructor(auto: boolean = true) {
        super(auto);
        this.count = 1;
    }

    /**
     * Increments the numeric counter.
     * @returns The current instance for method chaining.
     */
    public add(): this {
        this.count++;
        return this;
    }

    /**
     * Decrements the numeric counter.
     * @returns The current instance for method chaining.
     */
    public sub(): this {
        this.count--;
        return this;
    }

    /**
     * Resets the counter to 1.
     * @returns The current instance for method chaining.
     */
    public reset(): this {
        this.count = 1;
        return this;
    }
} // End Class NumberCounter

//******************************************************************************************/
//*                                                                                        */
//*                                 Exported Counter Class                                 */
//*                                                                                        */
//******************************************************************************************/

/**
 * Union type representing all supported counter values.
 */
type CounterType = ReturnType<BaseCounter<any>['get']>;

/**
 * Public counter facade supporting numeric and alphabetic modes.
 *
 * Designed for deterministic, snapshot-safe test numbering.
 */
class Counter {
    private alphaCounter: AlphaCounter;
    private numberCounter: NumberCounter;
    private instance: BaseCounter<CounterType>;
    private mode: 'alpha' | 'number';

    /**
     * @param auto If true, `next()` automatically increments the counter.
     * @param alpha If true, initializes in alphabetic mode.
     */
    constructor(auto: boolean = true, alpha: boolean = false) {
        this.alphaCounter = new AlphaCounter(auto);
        this.numberCounter = new NumberCounter(auto);
        this.instance = alpha ? this.alphaCounter : this.numberCounter;
        this.mode = alpha ? 'alpha' : 'number';
    }

    /**
     * Enables or disables alphabetic mode.
     *
     * Switching modes preserves auto-increment behavior
     * and resets the active counter.
     *
     * @param enable If true, use alphabetic counting
     * @returns The current instance for method chaining.
     */
    public alpha(enable: boolean = true): this {
        const auto = this.instance.isAuto;
        this.instance = enable ? this.alphaCounter : this.numberCounter;
        this.instance.isAuto = auto;
        this.instance.reset();
        this.mode = enable ? 'alpha' : 'number';
        return this;
    }

    /**
     * Indicates whether the counter is currently alphabetic.
     */
    public get isAlpha(): boolean {
        return this.mode === 'alpha';
    }

    /**
     * Enables or disables automatic incrementing.
     *
     * If no argument is provided, the current state is toggled.
     *
     * @param enable Explicit auto state override
     * @returns The current instance for method chaining.
     */
    public auto(enable?: boolean): this {
        this.instance.isAuto = enable ?? !this.instance.isAuto;
        return this;
    }

    /**
     * Returns the current counter value without mutation.
     * @returns The current counter value
     */
    public get(): CounterType {
        return this.instance.get();
    }

    /**
     * Sets the counter value with strict type validation.
     *
     * Prevents silent corruption of test numbering.
     *
     * @param value New counter value
     * @throws TypeError if the value type does not match the active counter mode
     * @returns The current instance for method chaining.
     */
    public set(value: CounterType): this {
        const expected = typeof this.instance.get();
        if (expected !== typeof value) {
            throw new TypeError(
                `Counter(): Type Mismatch error. Expected: ${expected}. But value: ${value} is ${typeof value}`
            );
        }

        this.instance.set(value as never);
        return this;
    }

    /**
     * Increments the counter.
     * @returns The current instance for method chaining.
     */
    public add(): this {
        this.instance.add();
        return this;
    }

    /**
     * Decrements the counter.
     * @returns The current instance for method chaining.
     */
    public sub(): this {
        this.instance.sub();
        return this;
    }

    /**
     * Returns the current value and conditionally increments the counter.
     * @returns The current counter value
     */
    public next(): CounterType {
        return this.instance.next();
    }

    /**
     * Resets the active counter to its initial value.
     * @returns The current instance for method chaining.
     */
    public reset(): this {
        this.instance.reset();
        return this;
    }

    /**
     * Returns a string representation of the current counter value.
     *
     * This method always delegates to `next()` to guarantee
     * deterministic auto-increment behavior.
     *
     * @returns The counter value as a string
     */
    public toString(): string {
        return String(this.next());
    }
} // End Class Counter

// Exports
export default Counter;
