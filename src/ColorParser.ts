import Colors from "./Colors.ts";

const __PRINT_DEBUG__ = true;
const __DEBUG__ = false;

export class ColorChannels<T extends TColorModel> {
    model: T;
    channels: Array<string | number>;

    constructor(
        model: T,
        channels: Array<string | number>,
    ) {
        this.model = model;
        this.channels = channels;
    }
}

export class RGBAColor {
    model: TColorModel = 'rgba';
    r: number = 255.0;
    g: number = 255.0;
    b: number = 255.0;
    alpha: number = 1.0;
    constructor(r: number, g: number, b: number, alpha: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.alpha = alpha;
    }
}

// Color Models
export const MODEL: TColorModel[] = ['hex', 'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'hwba', 'lab', 'lch', 'oklab', 'oklch', 'hsv', 'hsva', 'cmyk'];

/* Regular Expressions */
export const RX = {
    ALPHA: /[a-zA-Z]+/i,
    NUMBER: /[\d]/i,
    HEX: /[#]/i,
    EXPONENT: /e/i,
    KEYWORD: /(#|rgba?|hsla?|hwba?|lab|lch|oklab|oklch)/i,
    IDENTIFIER: /(deg|grad|rad|turn)/i,
    OPERATOR: /[%.\-]/i,
    DELIMITER: /[\(\),\/]/i,
    INTEGER: /[-+]?\d+/i,
    FLOAT: /[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/i,
    DOUBLEQUOTE: /"(?:[^"\\]|\\.)*"/i,
    SINGLEQUOTE: /'(?:[^'\\]|\\.)*'/i,
    BOOLEAN: /\b(true|false)\b/i,
    WHITESPACE: /\s+/i,
    COMMENTS: /\/\*[^]*?\*\/|\/\/[^\n]*/i,
    EOL: /\n|$/i
} as const;

export default class ColorParser {
    private readonly data: any[] = [];
    private readonly source: string = '';
    private index = 0.0;
    tokens: Token[];
    //model: TColorModel | null;
    //channels: Array<string | number> | null;
    //rawColor: ColorChannels<TColorModel> | null;
    color: RGBAColor | null = null;

    //
    // 1. COLORPARSER CONSTRUCTOR()
    //
    constructor(...args: any[]) {
        this.print('1. ColorParser - Constructor():');
        this.source = this.checkInput(args);
        this.print('1.A. Constructor Args:', this.source);

        this.tokens = this.tokenize();

        /*
        this.model = this.detectModel();
        this.channels = this.createChannels();

        this.rawColor =
            (this.model !== null && this.channels !== null)
                ? new ColorChannels(this.model, this.channels)
                : null;
        if (this.rawColor === null) return;
        this.color = this.parse();
        */

        if (__PRINT_DEBUG__) console.log('\n\n')
        if (__PRINT_DEBUG__) console.table(this.data);
        if (__PRINT_DEBUG__) console.log('\n\n');
    }



    private print(msg: string, variable?: any): void {
        if (!variable) {
            this.data.push({ Message: msg });
        } else if (variable !== null && typeof variable === 'object') {
            this.data.push({ Message: msg, Value: JSON.stringify(variable) });
        } else {
            this.data.push({ Message: msg, Value: variable });
        }
    }

    private checkInput(args: any) {
        const [result] = [...args];
        if (__DEBUG__) console.log('*** DEBUG: ColorParser: checkInput():', result);

        if (typeof result !== 'string')
            throw new Error('ColorParser Constructor: Class expects a string...');
        return result;
    }

    private peek(offset: number = 0): string {
        return this.source[this.index + offset] ?? '';
    }

    private next(): string {
        return this.source[this.index++] ?? '';
    }





    //
    // 2. ColorParser tokenize()
    //
    private tokenize(): Token[] {
        this.print('2. ColorParser - tokenize():');
        const tokens: Token[] = [];

        // Create tokens
        while (!this.isEOL) {
            const char = this.next();
            let token: Token;

            // WHITESPACE TOKENS
            if (this.isWhitespace(char)) {
                // Collect all whitespace
                const whitespaceString = this.scanWhitespace(char);
                token = { type: 'WHITESPACE', value: JSON.stringify(whitespaceString) };

                this.print('2.A. Whitespace:', token);

                tokens.push(token);
                continue;
            }

            // HEXVALUE TOKENS
            else if (this.isHex(char)) {
                // Collect everything to the end of the hex string
                const hexString = this.scanHexValue(char);
                token = { type: 'HEXVALUE', value: hexString }

                this.print('2.B. HexValue:', token);

                tokens.push(token);
                continue;
            }

            // NUMBER TOKENS
            else if (this.isNumber(char) || char === '-' || char === '+') {
                // Collect all numbers
                const numberString = this.scanNumber(char);
                token = { type: 'NUMBER', value: numberString };

                this.print('2.C. Number:', token);

                tokens.push(token);
                continue;
            }

            // IDENTIFIER TOKENS
            else if (this.isAlpha(char)) {
                // Collect all characters
                const identifierString = this.scanIdentifier(char);
                token = { type: 'IDENTIFIER', value: identifierString };

                this.print('2.D. Identifier:', token);

                tokens.push(token);
                continue;
            }

            // DELIMITER TOKENS
            else if (this.isDelimiter(char)) {
                token = { type: 'DELIMITER', value: char };

                this.print('2.E. Delimiter:', token);

                tokens.push(token);
                continue;
            }

            // ANY CHAR TOKEN NOT RECOGNIZED ABOVE
            else {
                token = { type: 'CHAR', value: char };

                this.print('2.F. Character:', token);

                tokens.push(token);
            }
        }
        return tokens;
    }

    private get isEOL(): boolean {
        return this.index >= this.source.length;
    }

    private isWhitespace(char: string): boolean {
        return RX.WHITESPACE.test(char);
    }

    private isHex(char: string): boolean {
        return RX.HEX.test(char);
    }

    private isNumber(char: string): boolean {
        return RX.NUMBER.test(char);
    }

    private isAlpha(char: string): boolean {
        return RX.ALPHA.test(char);
    }

    private isKeyword(identifier: string): boolean {
        return RX.KEYWORD.test(identifier);
    }

    private isDelimiter(char: string): boolean {
        return RX.DELIMITER.test(char);
    }





    private isDefinitelyNotANumber(input: any): boolean {
        // Check if the type is explicitly the 'number' primitive and also check for NaN
        if (typeof input === 'number') {
            return isNaN(input);
        }

        // Check if the input is null or an empty string, which Number() handles differently
        if (input === null || input === "") {
            // null or "" are not valid numbers in this strict sense
            return true;
        }

        // Attempt to parse the input using the global Number() function.
        const parsedValue = Number(input);

        // Check if the result of the parsing is NaN
        // isNaN() correctly handles cases where the input was things like 'abc', undefined, or objects.
        return isNaN(parsedValue);
    }

    private toNumber(token: Token): number | null {
        let value: string = token.value;
        let result: number | null = null;
        if (typeof value === "string" && this.isDefinitelyNotANumber(value)) {
            value = value.trim();

            // Percentage (convert to decimal)
            if (value.endsWith("%")) {
                result = parseFloat(value.slice(0, -1)) / 100;
            } else {
                result = parseFloat(value);
            }
        }
        return result;
    }

    private scanIdentifier(initial: string): string {
        let value = initial;
        while (!this.isEOL && this.isAlpha(this.peek())) value += this.next();
        return value;
    }

    private scanNumber(initial: string): string {
        let value = initial;

        // Integer
        while (!this.isEOL && this.isDigit(this.peek())) value += this.next();

        // Decimal
        if (this.peek() === '.') {
            // Consume the decimal
            value += this.next();

            // Fractional digits
            while (!this.isEOL && this.isDigit(this.peek())) value += this.next();
        }

        // Exponent
        if (RX.EXPONENT.test(this.peek())) {
            // consume 'e' or 'E'
            const e = this.next();
            value += e;

            // Optional sign
            if (this.peek() === '+' || this.peek() === '-') value += this.next();

            // Exponent digits
            while (!this.isEOL && this.isDigit(this.peek())) value += this.next();
        }

        // Percentage
        if (this.peek() === '%') {
            value += this.next();
            // Convert Percentage to Decimal ? or keep as string?
            //return parseFloat(value.slice(0, -1)) / 100.0;
        }

        // Units (deg, rad, turn, grad)
        while (!this.isEOL && this.isAlpha(this.peek())) value += this.next();

        // return string or a number?
        return value;
        //return parseFloat(value);
    }

    private scanWhitespace(char: string): string {
        let value = char;
        while (!this.isEOL && RX.WHITESPACE.test(this.peek())) value += this.next();
        return value;
    }

    private scanHexValue(char: string): string {
        let value = char;
        while (!this.isEOL) value += this.next();
        return value;
    }



}


