
   // 3. ColorParser detectModel()
    private detectModel(): TColorModel | null {
    this.print('3. ColorParser - detectModel():');
    for (const token of this.tokens) {
        switch (token.type) {
            case 'HEXVALUE':
            case 'CHAR':
                if (token.value === '#' || token.type === 'HEXVALUE') {
                    this.print('3.A. Detected Model:', 'hex');
                    return 'hex';
                }
                break;

            case 'IDENTIFIER':
                if (Object.keys(Colors).includes(token.value as string)) {
                    const hexValue = Colors[token.value] as string;// as keyof typeof Colors];
                    token.type = 'HEXVALUE';
                    token.value = hexValue;
                    this.print('3.A. Detected Model:', 'hex');
                    return 'hex';
                }

                if (MODEL.includes(token.value as TColorModel)) {
                    this.print('3.A. Detected Model:', token.value);
                    return token.value as TColorModel; // Return immediately
                }
                break;
        }
    }
    this.print('3.A. Detected Model:', 'null');
    return null;
}

    // 4. ColorParser createChannels():
    private createChannels(): Array<string | number> | null {
    this.print('4. ColorParser - createChannels():');

    let result: Array<string | number> = [];
    for (const token of this.tokens) {
        switch (token.type) {
            case 'HEXVALUE':
                if (typeof token.value === 'string')
                    result.push(token.value);
                break;
            case 'NUMBER':
                if (this.isDefinitelyNotANumber(token.value)) {
                    return null;
                } else if (typeof token.value === 'number') {
                    result.push(token.value * 1.0);
                    continue;
                } else if (typeof token.value === 'string') {
                    result.push(parseFloat(token.value.trim()));
                    continue;
                }
                break;
        }
    }

    this.print('4.A. Created Channels:', result);

    return result;
}

    // 5. ColorParser parse() - All colors are stored as RGBA internally
    private parse(): RGBAColor | null {
    this.print('5. ColorParser - parse():');

    let result: RGBAColor | null = null;
    const rawColor = this.rawColor;
    if (rawColor === null) return null;

    switch (rawColor.model) {
        case 'hex':
            result = ColorParser.fromHex(rawColor);
            break;
        case 'rgb':
        case 'rgba':
            result = ColorParser.fromRGB(rawColor);
            break;
        case 'hsl':
        case 'hsla':
            result = ColorParser.fromHSL(rawColor);
            break;
        case 'hsv':
        case 'hsva':
            result = ColorParser.fromHSV(rawColor);
            break;
        case 'hwb':
        case 'hwba':
            result = ColorParser.fromHWB(rawColor);
            break;
        case 'lab':
            result = ColorParser.fromLAB(rawColor);
            break;
        case 'lch':
            result = ColorParser.fromLCH(rawColor);
            break;
        case 'oklab':
            result = ColorParser.fromOKLAB(rawColor);
            break;
        case 'oklch':
            result = ColorParser.fromOKLCH(rawColor);
            break;
        case 'cmyk':
            result = ColorParser.fromCMYK(rawColor);
            break;
        default:
            result = null;
            break;
    }

    this.print('5.A. Parsed Color:', result);

    return result;
}


//
// FROM
//


    static wrapHue(h: number): number {
    return ((h % 360) + 360) % 360;
}

    static checkRange(r: number, g: number, b: number, a: number = 1.0): boolean {
    // Return true if any value is NaN
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) {
        return true;
    }
    // Return true if any value is out of the valid range
    return (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) || (a < 0 || a > 1);
}

    static fromHex(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== 'hex') return null;
    let r: number, g: number, b: number, a: number = 1.0;
    let hex = (input.channels[0] as string).replace(/^#/, "").toLowerCase();

    if (!/^[0-9a-f]+$/.test(hex)) return null;

    // Expand #RGB or #RGBA
    if (hex.length === 3 || hex.length === 4) {
        hex = hex.replace(/./g, c => c + c);
    }

    // Now hex must be 6 or 8 chars
    if (hex.length === 6) hex += "ff";
    if (hex.length !== 8) return null;

    const parts = hex.match(/.{2}/g);
    if (!parts) return null;

    if (__DEBUG__) console.log('DEBUG: ColorParser.toHex parts:', parts);

    // force float: / 1.0 ensures non-integer representation
    r = parseInt(parts[0] as string, 16) / 1.0;
    g = parseInt(parts[1] as string, 16) / 1.0;
    b = parseInt(parts[2] as string, 16) / 1.0;

    a = parts[3] ? parseInt(parts[3], 16) / 255 : 1.0;

    return new RGBAColor(r, g, b, a);
}



    static fromRGB(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== 'rgb' && input.model !== 'rgba') return null;

    const r = this.toNumber(input.channels[0]!);
    const g = this.toNumber(input.channels[1]!);
    const b = this.toNumber(input.channels[2]!);

    // Alpha conversion is optional
    let a: number = 1.0;
    if (input.channels.length > 3) {
        a = this.toNumber(input.channels[3]!);
    }

    // Check RGB ranges (0 to 255) or Alpha (0 to 1) using the improved checkRange
    if (this.checkRange(r, g, b, a)) {
        console.error(`ColorParser.fromRGB: Value out of range detected: (${r}, ${g}, ${b}, ${a})`);
        return null;
    }

    // Clamp values (if still needed, though validation above handles ranges)
    const r_clamped = ColorParser.clamp(r);
    const g_clamped = ColorParser.clamp(g);
    const b_clamped = ColorParser.clamp(b);
    const a_clamped = ColorParser.clamp(a, true);

    return new RGBAColor(r_clamped, g_clamped, b_clamped, a_clamped);
}

    static fromHSL(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== 'hsl' && input.model !== 'hsla') return null;

    let h = this.toNumber(input.channels[0]!);
    let s = this.toNumber(input.channels[1]!);
    let l = this.toNumber(input.channels[2]!);

    let a = 1.0;
    if (input.channels.length > 3) {
        a = this.toNumber(input.channels[3]!);
    }

    // Normalize & clamp
    h = ((h % 360) + 360) % 360; // wrap negative
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    a = Math.max(0, Math.min(1, a));

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const huePrime = h / 60;
    const x = c * (1 - Math.abs((huePrime % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= huePrime && huePrime < 1) { r = c; g = x; b = 0; }
    else if (1 <= huePrime && huePrime < 2) { r = x; g = c; b = 0; }
    else if (2 <= huePrime && huePrime < 3) { r = 0; g = c; b = x; }
    else if (3 <= huePrime && huePrime < 4) { r = 0; g = x; b = c; }
    else if (4 <= huePrime && huePrime < 5) { r = x; g = 0; b = c; }
    else if (5 <= huePrime && huePrime < 6) { r = c; g = 0; b = x; }

    return new RGBAColor(
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
        a
    );
}

    static fromHSV(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== 'hsv' && input.model !== 'hsva') return null;

    // Convert input
    let h = this.toNumber(input.channels[0]!);
    let s = this.toNumber(input.channels[1]!);
    let v = this.toNumber(input.channels[2]!);

    // Alpha
    let a = 1.0;
    if (input.channels.length > 3) {
        a = this.toNumber(input.channels[3]!);
    }

    // Normalize values
    h = ((h % 360) + 360) % 360;  // ensure positive
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));
    a = Math.max(0, Math.min(1, a));

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return new RGBAColor(
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
        a
    );
}

    static fromHWB(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "hwb" && input.model !== "hwba") return null;

    let h = this.toNumber(input.channels[0]!);
    let w = this.toNumber(input.channels[1]!); // white
    let b = this.toNumber(input.channels[2]!); // black

    let a = 1.0;
    if (input.channels.length > 3) {
        a = this.toNumber(input.channels[3]!);
    }

    h = this.wrapHue(h);
    w = Math.max(0, Math.min(1, w));
    b = Math.max(0, Math.min(1, b));
    a = Math.max(0, Math.min(1, a));

    const ratio = w + b;
    if (ratio > 1) {
        w /= ratio;
        b /= ratio;
    }

    const v = 1 - b;
    const s = (v === 0) ? 0 : 1 - (w / v);

    // Convert HSV(v,s) to RGB
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, bl = 0;
    const hp = h / 60;

    if (hp < 1) { r = c; g = x; bl = 0; }
    else if (hp < 2) { r = x; g = c; bl = 0; }
    else if (hp < 3) { r = 0; g = c; bl = x; }
    else if (hp < 4) { r = 0; g = x; bl = c; }
    else if (hp < 5) { r = x; g = 0; bl = c; }
    else { r = c; g = 0; bl = x; }

    return new RGBAColor(
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((bl + m) * 255),
        a
    );
}

    static fromCMYK(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "cmyk") return null;

    const c = Math.max(0, Math.min(1, this.toNumber(input.channels[0]!)));
    const m = Math.max(0, Math.min(1, this.toNumber(input.channels[1]!)));
    const y = Math.max(0, Math.min(1, this.toNumber(input.channels[2]!)));
    const k = Math.max(0, Math.min(1, this.toNumber(input.channels[3]!)));

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return new RGBAColor(
        Math.round(r),
        Math.round(g),
        Math.round(b),
        1.0
    );
}

    static fromLAB(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "lab") return null;

    let L = this.toNumber(input.channels[0]!);
    let a = this.toNumber(input.channels[1]!);
    let b = this.toNumber(input.channels[2]!);

    L = Math.max(0, Math.min(100, L));

    // Reference white (D65)
    const fy = (L + 16) / 116;
    const fx = fy + (a / 500);
    const fz = fy - (b / 200);

    const f3 = (t: number) => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;

    const X = 0.95047 * f3(fx);
    const Y = 1.00000 * f3(fy);
    const Z = 1.08883 * f3(fz);

    // XYZ → RGB
    let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let bl = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    // Linear → sRGB
    const gamma = (u: number) =>
        u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;

    r = gamma(r);
    g = gamma(g);
    bl = gamma(bl);

    return new RGBAColor(
        Math.round(ColorParser.clamp(r * 255)),
        Math.round(ColorParser.clamp(g * 255)),
        Math.round(ColorParser.clamp(bl * 255)),
        1.0
    );
}

    static fromLCH(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "lch") return null;

    let L = this.toNumber(input.channels[0]!);
    let C = this.toNumber(input.channels[1]!);
    let H = this.wrapHue(this.toNumber(input.channels[2]!));

    const hr = H * (Math.PI / 180);

    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);

    // Convert using LAB method above
    return this.fromLAB({
        model: "lab",
        channels: [L, a, b],
        channelCount: 3
    } as ColorChannels<TColorModel>);
}

    static fromOKLAB(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "oklab") return null;

    const L = this.toNumber(input.channels[0]!);
    const a = this.toNumber(input.channels[1]!);
    const b = this.toNumber(input.channels[2]!);

    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;

    let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

    r = Math.round(ColorParser.clamp(r * 255));
    g = Math.round(ColorParser.clamp(g * 255));
    bl = Math.round(ColorParser.clamp(bl * 255));

    return new RGBAColor(r, g, bl, 1.0);
}

    static fromOKLCH(input: ColorChannels<TColorModel>): RGBAColor | null {
    if (input.model !== "oklch") return null;

    const L = this.toNumber(input.channels[0]!);
    const C = this.toNumber(input.channels[1]!);
    const H = this.wrapHue(this.toNumber(input.channels[2]!));

    const hr = H * (Math.PI / 180);

    const a = C * Math.cos(hr);
    const b = C * Math.sin(hr);

    return this.fromOKLAB({
        model: "oklab",
        channels: [L, a, b],
        channelCount: 3
    } as ColorChannels<TColorModel>);
}

    /**
     * Clamps a given number to be within the valid RGB range [0.0, 255.0].
     * If isAlpha is true, clamp to [0.0, 1.0]
     * Non-numeric inputs will result in a runtime error if strict checks are on,
     * but JavaScript's loose typing will convert them if necessary.
     */
    static clamp = (arg: number, isAlpha?: boolean, min?: number, max?: number): number => {
    min = min ?? 0.0;
    max = (isAlpha && max === undefined) ? 1.0 : (max ?? 255.0);

    const num: number = (
        typeof arg === 'number' &&
        !Number.isNaN(arg) &&
        Number.isFinite(arg)
    ) ? arg : min;

    return Math.max(min, Math.min(max, num));
}





//
// TO
//
static toHex(color: RGBAColor): string {
    const r = Math.round(color.r).toString(16).padStart(2, '0');
    const g = Math.round(color.g).toString(16).padStart(2, '0');
    const b = Math.round(color.b).toString(16).padStart(2, '0');
    const a = Math.round(color.alpha * 255).toString(16).padStart(2, '0');

    return a === 'ff' ? `#${r}${g}${b}` : `#${r}${g}${b}${a}`;
}

    static toRGB(color: RGBAColor): string {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
}

    static toRGBA(color: RGBAColor): string {
    return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${color.alpha})`;
}

    static toHSL(color: RGBAColor): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

    static toHSLA(color: RGBAColor): TParsedColor {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    const hsla: TParsedColor = {
        model: 'hsla',
        h: Math.round(h),
        s: Math.round(s * 100), // Percentage
        l: Math.round(l * 100), // Percentage
        alpha: color.alpha
    } as TModelParsedColor<'hsla'>
    return hsla;
}

    static toHWB(color: RGBAColor): string {
    const hsl = this.toHSL(color);
    const match = /hsl\((\d+), (\d+)%, (\d+)%\)/.exec(hsl);
    if (!match) return '';

    const h = parseInt(match[1]!);
    const l = parseInt(match[3]!) / 100;
    const s = parseInt(match[2]!) / 100;

    const w = l * (1 - s);
    const b = 1 - l;

    return `hwb(${h}, ${Math.round(w * 100)}%, ${Math.round(b * 100)}%)`;
}

    static toHSV(color: RGBAColor): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
        if (max === r) h = 60 * (((g - b) / delta) % 6);
        else if (max === g) h = 60 * (((b - r) / delta) + 2);
        else h = 60 * (((r - g) / delta) + 4);
    }
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return `hsv(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
}

    static toCMYK(color: RGBAColor): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

    static toLAB(color: RGBAColor): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    // Linearize RGB
    const lin = (u: number) => u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
    const R = lin(r);
    const G = lin(g);
    const B = lin(b);

    // sRGB → XYZ
    const X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B;
    const Y = 0.2126729 * R + 0.7151522 * G + 0.0721750 * B;
    const Z = 0.0193339 * R + 0.1191920 * G + 0.9503041 * B;

    // Normalize by reference white (D65)
    const refX = 0.95047, refY = 1.00000, refZ = 1.08883;
    const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);

    const fx = f(X / refX);
    const fy = f(Y / refY);
    const fz = f(Z / refZ);

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b_ = 200 * (fy - fz);

    return `lab(${L.toFixed(2)}, ${a.toFixed(2)}, ${b_.toFixed(2)})`;
}

    static toLCH(color: RGBAColor): string {
    const lab = this.toLAB(color);
    const match = /lab\(([^,]+), ([^,]+), ([^,]+)\)/.exec(lab);
    if (!match) return '';

    const L = parseFloat(match[1]!);
    const a = parseFloat(match[2]!);
    const b = parseFloat(match[3]!);

    const C = Math.sqrt(a * a + b * b);
    const H = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;

    return `lch(${L.toFixed(2)}, ${C.toFixed(2)}, ${H.toFixed(2)})`;
}

    static toOKLAB(color: RGBAColor): string {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const L = Math.cbrt(l_);
    const M = Math.cbrt(m_);
    const S = Math.cbrt(s_);

    const l = 0.2104542553 * L + 0.7936177850 * M - 0.0040720468 * S;
    const a = 1.9779984951 * L - 2.4285922050 * M + 0.4505937099 * S;
    const b_ = 0.0259040371 * L + 0.7827717662 * M - 0.8086757660 * S;

    return `oklab(${l.toFixed(4)}, ${a.toFixed(4)}, ${b_.toFixed(4)})`;
}

    static toOKLCH(color: RGBAColor): string {
    const oklab = this.toOKLAB(color);
    const match = /oklab\(([^,]+), ([^,]+), ([^,]+)\)/.exec(oklab);
    if (!match) return '';

    const L = parseFloat(match[1]!);
    const a = parseFloat(match[2]!);
    const b = parseFloat(match[3]!);

    const C = Math.sqrt(a * a + b * b);
    const H = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;

    return `oklch(${L.toFixed(4)}, ${C.toFixed(4)}, ${H.toFixed(4)})`;
}