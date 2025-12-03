import ColorParser from "./ColorParser.ts";

const __DEBUG__ = false;

/**
 * @constant EPSILON
 *
 * @default     0.04045
 * @description The value 0.04045 is a more precise standard value used in some
 *              specifications.
 *
 * @variation   0.03928
 * @description  The value 0.03928 is the linear threshold for the sRGB piecewise
 *              function, corresponding to an 8-bit value of 10.
 *
 * @summary However, for a 0-255 RGB range, this difference is almost negligible.
 *          Choosing one and sticking to it consistently is the best approach.
 */
export const EPSILON: number = 0.04045; 0.03928
export const ALPHA: boolean = true;

export default class Color {
    #input: any;
    #parsed: ColorParser | null = null;

    #r: number = 255.0;
    #g: number = 255.0;
    #b: number = 255.0;
    #alpha?: number = 1.0;

    // Flag for lazy luminance calculation
    #isDirty: boolean = true;
    #luminance: number | null = null;

    // Pre-defined internal common colors
    //static white: Color = new Color(255, 255, 255, 1.0);
    //static black: Color = new Color(0, 0, 0, 1.0);
    //static red: Color = new Color(255, 0, 0, 1.0);
    //static green: Color = new Color(0, 255, 0, 1.0);
    //static blue: Color = new Color(0, 0, 255, 1.0);
    //static yellow: Color = new Color(255, 255, 0, 1.0);
    //static cyan: Color = new Color(0, 255, 255, 1.0);
    //static magenta: Color = new Color(255, 0, 255, 1.0);
    //static transparent: Color = new Color(0, 0, 0, 0.0);

    constructor(...args: any[]) {
        this.#input = args;

        if (__DEBUG__) console.log("DEBUG: COLOR CONSTRUCTOR ARGS:", args);
        if (args.length === 0) {
            args = ['rgba(255.0 255.0 255.0 1.0)'];
        }
        if (args.length === 3) {
            args = [`rgb(${args[0]},${args[1]},${args[2]})`];
        }
        if (args.length === 4) {
            args = [`rgba(${args[0]},${args[1]},${args[2]},${args[3]})`];
        }
        this.#parseInput(args);
        this.#luminance = this.getLuminance();
    }

    #parseInput(args: any[]) {
        this.parsed = new ColorParser(...args);


        if (this.parsed.tokens && this.parsed.color) {
            if (__DEBUG__) console.log("DEBUG: COLOR TOKENS:", this.parsed.tokens);
            if (__DEBUG__) console.log("DEBUG: COLOR COLOR:", this.parsed.color);
            this.r = this.parsed.color.r;
            this.g = this.parsed.color.g;
            this.b = this.parsed.color.b;
            this.alpha = this.parsed.color.alpha;
        }
        if (__DEBUG__) console.log("DEBUG: COLOR THIS:", this);
        if (__DEBUG__) console.log(`\n\n`);
    }

    static isColor = (arg: any): boolean => arg instanceof Color;

    static validNumber = (arg: any): number => {
        return (
            typeof arg === 'number' &&
            !Number.isNaN(arg) &&
            Number.isFinite(arg)
        ) ? arg : 0.0;
    }

    static clamp = (arg: number, isAlpha?: typeof ALPHA, min?: number, max?: number): number => {
        min = min ?? 0.0;
        max = (isAlpha && max === undefined) ? 1.0 : (max ?? 255.0);

        const num: number = (
            typeof arg === 'number' &&
            !Number.isNaN(arg) &&
            Number.isFinite(arg)
        ) ? arg : min;

        return Math.max(min, Math.min(max, num));
    }

    /* Getters and setters */
    public get r(): number { return this.#r; }
    public set r(value: number) { this.#r = Color.clamp(Color.validNumber(value)); this.#isDirty = true; }

    public get g(): number { return this.#g; }
    public set g(value: number) { this.#g = Color.clamp(Color.validNumber(value)); this.#isDirty = true; }

    public get b(): number { return this.#b; }
    public set b(value: number) { this.#b = Color.clamp(Color.validNumber(value)); this.#isDirty = true; }

    public get alpha(): number | undefined { return this.#alpha ? this.#alpha : undefined; }
    public set alpha(value: number) { this.#alpha = Color.clamp(Color.validNumber(value), ALPHA); this.#isDirty = true; }

    public get input() { return this.#input; };
    public set input(value: any) { this.#input = value; }

    public get parsed() { return this.#parsed; }
    public set parsed(value: any) { this.#parsed = value; }

    public set(color: Color): this;
    public set(css: string): this;
    public set(color: { r: number, g: number, b: number, a?: number }): this;
    public set(r: number, g: number, b: number, a?: number): this;
    public set(...args: any[]): this {
        this.#parseInput(args);
        return this;
    }

    toString(): string {
        return this.toCSS();
    }

    toCSS(): string {
        if (this.alpha && this.alpha < 1.0) {
            return `rgba(${this.r} ${this.g} ${this.b} / ${this.alpha})`;
        }
        return `rgb(${this.r} ${this.g} ${this.b})`;
    }

    clone(): Color {
        return new Color(this.r, this.g, this.b, this.alpha);
    }

    copy(): Color {
        return this.clone();
    }

    getLuminance(): number {
        if (!this.#isDirty) return this.#luminance as number;
        const [r, g, b] = [this.r, this.g, this.b].map(c => {
            c = c / 255.0;
            return c <= EPSILON ? c / 12.92 : Math.pow((c + 0.055)
                / 1.055, 2.4);
        });

        this.#luminance = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
        this.#isDirty = false;
        return this.#luminance;
    }

    /**
     * Adjust opacity
     * @param {number} alpha - New alpha value (0-1)
     * @returns {Color} New color with adjusted opacity
     */
    withAlpha(alpha: number): Color {
        return new Color(this.r, this.g, this.b, alpha);
    }

    /**
     * Create random color
     * @param {boolean} includeAlpha - Whether to randomize alpha
     * @returns {Color}
     */
    static random(includeAlpha: boolean = !ALPHA): Color {
        const r = Math.floor(Math.random() * 256.0);
        const g = Math.floor(Math.random() * 256.0);
        const b = Math.floor(Math.random() * 256.0);
        const a = includeAlpha ? Math.random() : 1.0;
        return new Color(r, g, b, a);
    }

    /**
     * Lerp between two colors
     * @param {Color} color1 - Start color
     * @param {Color} color2 - End color
     * @param {number} t - Interpolation factor (0-1)
     * @returns {Color}
     */
    static lerp(color1: Color, color2: Color, t: number): Color {
        t = Math.max(0.0, Math.min(1.0, t));
        return new Color(
            color1.r + (color2.r - color1.r) * t,
            color1.g + (color2.g - color1.g) * t,
            color1.b + (color2.b - color1.b) * t,
            (color1.alpha ?? 1) + ((color2.alpha ?? 1) - (color1.alpha ?? 1)) * t
        );
    }

    /**
     * Mix this color with another
     * @param {Color} other - Other color
     * @param {number} ratio - Mix ratio (0 = this color, 1 = other color)
     * @returns {Color} New mixed color
     */
    mix(other: Color, ratio: number = 0.5): Color {
        return Color.lerp(this, other, ratio);
    }

    /**
     * Brighten the color
     * @param {number} amount - Amount to brighten (0-1)
     * @returns {Color} New brightened color
     */
    brighten(amount: number = 0.1): Color {
        return new Color(
            Math.min(255.0, this.r + (255.0 - this.r) * amount),
            Math.min(255.0, this.g + (255.0 - this.g) * amount),
            Math.min(255.0, this.b + (255.0 - this.b) * amount),
            this.alpha
        );
    }

    /**
     * Darken the color
     * @param {number} amount - Amount to darken (0-1)
     * @returns {Color} New darkened color
     */
    darken(amount: number = 0.1): Color {
        return new Color(
            Math.max(0.0, this.r - this.r * amount),
            Math.max(0.0, this.g - this.g * amount),
            Math.max(0.0, this.b - this.b * amount),
            this.alpha
        );
    }

    /**
     * Get complementary color
     * @returns {Color}
     */
    complement(): Color {
        const hsla: TParsedColor = ColorParser.toHSLA(this.parsed.color) as TModelParsedColor<'hsla'>;
        hsla.h = (hsla.h + 180) % 360;
        return new Color(`hsla(${hsla.h}, ${hsla.s}, ${hsla.l}, ${hsla.alpha})`);
    }

    /**
     * Check if colors are equal
     * @param {Color} other - Other color
     * @returns {boolean}
     */
    equals(other: Color): boolean {
        if (!(other instanceof Color)) return false;
        return this.r === other.r &&
            this.g === other.g &&
            this.b === other.b &&
            Math.abs((this.alpha ?? 1.0) - (other.alpha ?? 1.0)) < 0.001;
    }

    /**
     * Check if color is dark
     * @param {number} threshold - Luminance threshold (0-1)
     * @returns {boolean}
     */
    isDark(threshold: number = 0.5): boolean {
        return this.getLuminance() < threshold;
    }
}

