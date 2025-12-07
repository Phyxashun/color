export default class ColorRegex {
    // ========================================
    // TOKENIZING PATTERNS (for lexical analysis)
    // ========================================
    static WHITESPACE: RegExp = /^\s+/;
    static FUNCTION: RegExp = /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)(?=\s*\()/i;
    static HASH: RegExp = /^#/;
    static HEXVALUE: RegExp = /^[a-f\d]+/i;
    static LPAREN: RegExp = /^\(/;
    static NUMBER: RegExp = /^\d+(?:\.\d+)?/;
    static COMMA: RegExp = /^,/;
    static UNITS: RegExp = /^(?:px|em|rem|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex)/i;
    static PERCENT: RegExp = /^%/;
    static ANGLE: RegExp = /^(?:deg|grad|rad|turn)/i;
    static SLASH: RegExp = /^\//;
    static RPAREN: RegExp = /^\)/;

    // ========================================
    // VALIDATION PATTERNS (full color matching)
    // ========================================

    // 1. Hex colors (3 or 4 digits)
    static hex3or4: RegExp = /^#([a-f\d]{3,4})$/i;

    // 2. Hex colors (6 or 8 digits)
    static hex6or8: RegExp = /^#([a-f\d]{6}|[a-f\d]{8})$/i;

    // 3. RGB/RGBA functions
    static rgb: RegExp = /^rgb\((?:\s*\d+%?(?:,\s*|\s+)){2}\s*\d+%?\s*\)$/i;
    static rgba: RegExp = /^rgba?\((?:\s*\d+%?(?:,\s*|\s+)){2}\s*\d+%?(?:\s*,\s*(?:\d+%?|0?\.\d+|1)|(?:\s*\/\s*(?:\d+%?|0?\.\d+|1)))?\s*\)$/i;

    // 4. HSL/HSLA functions
    static hsl: RegExp = /^hsl\((?:\s*[\d.]+(?:deg|g?rad|turn)?(?:,\s*|\s+))\s*\d+%?(?:,\s*|\s+)\s*\d+%?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;
    static hsla: RegExp = /^hsla?\((?:\s*[\d.]+(?:deg|g?rad|turn)?(?:,\s*|\s+))\s*\d+%?(?:,\s*|\s+)\s*\d+%?(?:\s*,\s*(?:\d+%?|0?\.\d+|1)|(?:\s*\/\s*(?:\d+%?|0?\.\d+|1)))?\s*\)$/i;

    // 5. HWB/HWBA functions (Hue-Whiteness-Blackness)
    static hwb: RegExp = /^hwb\(\s*[\d.]+(?:deg|g?rad|turn)?\s+\d+%?\s+\d+%?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;
    static hwba: RegExp = /^hwba?\(\s*[\d.]+(?:deg|g?rad|turn)?\s+\d+%?\s+\d+%?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 6. HSV/HSVA functions (Hue-Saturation-Value)
    static hsv: RegExp = /^hsv\((?:\s*[\d.]+(?:deg|g?rad|turn)?(?:,\s*|\s+))\s*\d+%?(?:,\s*|\s+)\s*\d+%?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;
    static hsva: RegExp = /^hsva?\((?:\s*[\d.]+(?:deg|g?rad|turn)?(?:,\s*|\s+))\s*\d+%?(?:,\s*|\s+)\s*\d+%?(?:\s*,\s*(?:\d+%?|0?\.\d+|1)|(?:\s*\/\s*(?:\d+%?|0?\.\d+|1)))?\s*\)$/i;

    // 7. LAB function (Lab color space)
    static lab: RegExp = /^lab\(\s*\d+%?\s+-?[\d.]+\s+-?[\d.]+(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 8. OKLAB function (Oklab color space)
    static oklab: RegExp = /^oklab\(\s*\d+%?\s+-?[\d.]+\s+-?[\d.]+(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 9. LCH function (Lightness-Chroma-Hue)
    static lch: RegExp = /^lch\(\s*\d+%?\s+[\d.]+\s+\d+(?:\.\d+)?(?:deg|g?rad|turn)?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 10. OKLCH function (Oklch color space)
    static oklch: RegExp = /^oklch\(\s*\d+%?\s+[\d.]+\s+\d+(?:\.\d+)?(?:deg|g?rad|turn)?(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 11. CMYK function (Cyan-Magenta-Yellow-Black)
    static cmyk: RegExp = /^cmyk\((?:\s*\d+%?(?:,\s*|\s+)){3}\s*\d+%?\s*\)$/i;

    // 12. Color function (generic color space)
    static color: RegExp = /^color\(\s*[\w-]+(?:\s+[\d.]+%?)+(?:\s*\/\s*(?:\d+%?|0?\.\d+|1))?\s*\)$/i;

    // 13. Named colors and keywords
    static namedColors: RegExp = /^(?:inherit|initial|unset|revert|red|blue|green|yellow|black|white|orange|purple|transparent|currentColor|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen)$/i;

    // ========================================
    // SUB-PATTERNS (for validation helpers)
    // ========================================
    static whitespace: RegExp = /^\s*/;
    static number: RegExp = /^\d+/;
    static percentage: RegExp = /^\d+%/;
    static numberOrPercent: RegExp = /^\d+%?/;
    static decimal: RegExp = /^0?\.\d+/;
    static alpha: RegExp = /^\d+%?|0?\.\d+|1/;
    static alphaSeparator: RegExp = /^\s*\/\s*/;
    static commaSeparator: RegExp = /^,\s*/;
    static spaceSeparator: RegExp = /^\s+/;
    static units: RegExp = /^(?:deg|g?rad|turn)?/i;
} // End Class ColorRegex

/*
TESTING:

# Color RegEx Test Examples for regex101.com

## hex3or4
**Should Match:**
- `#abc`
- `#ABC`
- `#123`
- `#f0f`
- `#abcd`
- `#1234`

**Should NOT Match:**
- `#ab`
- `#abcde`
- `abc`
- `#ghij`

---

## hex6or8
**Should Match:**
- `#abcdef`
- `#ABCDEF`
- `#123456`
- `#ff00ff`
- `#abcdef12`
- `#12345678`

**Should NOT Match:**
- `#abcde`
- `#abcdefg`
- `#abc`
- `abcdef`

---

## rgb
**Should Match:**
- `rgb(255, 0, 0)`
- `rgb(255,0,0)`
- `rgb(100%, 50%, 0%)`
- `rgb(255 0 0)`
- `rgb( 255  0  0 )`

**Should NOT Match:**
- `rgb(255, 0)`
- `rgb(255, 0, 0, 0.5)`
- `rgba(255, 0, 0)`

---

## rgba
**Should Match:**
- `rgba(255, 0, 0, 0.5)`
- `rgba(255, 0, 0, 1)`
- `rgba(255 0 0 / 0.5)`
- `rgba(100%, 50%, 0%, 0.75)`
- `rgb(255, 0, 0)`
- `rgb(255 0 0 / 0.5)`

**Should NOT Match:**
- `rgba(255, 0)`
- `rgba(255, 0, 0, 1.5)`

---

## hsl
**Should Match:**
- `hsl(120, 100%, 50%)`
- `hsl(120deg, 100%, 50%)`
- `hsl(120 100% 50%)`
- `hsl(2rad 100% 50%)`
- `hsl(0.5turn 100% 50%)`
- `hsl(120deg 100% 50% / 0.5)`

**Should NOT Match:**
- `hsl(120, 100%)`
- `hsl(120deg, 100%, 50%, 0.5)`

---

## hsla
**Should Match:**
- `hsla(120, 100%, 50%, 0.5)`
- `hsla(120deg, 100%, 50%, 1)`
- `hsla(120 100% 50% / 0.5)`
- `hsl(120, 100%, 50%)`
- `hsl(120deg 100% 50%)`

**Should NOT Match:**
- `hsla(120, 100%)`
- `hsla(120deg, 100%, 50%, 1.5)`

---

## hwb
**Should Match:**
- `hwb(120 30% 50%)`
- `hwb(120deg 30% 50%)`
- `hwb(120 30% 50% / 0.5)`
- `hwb(2rad 30% 50%)`

**Should NOT Match:**
- `hwb(120, 30%, 50%)`
- `hwb(120 30%)`

---

## hwba
**Should Match:**
- `hwba(120 30% 50% / 0.5)`
- `hwb(120 30% 50%)`
- `hwb(120deg 30% 50% / 1)`

**Should NOT Match:**
- `hwba(120, 30%, 50%, 0.5)`
- `hwba(120 30%)`

---

## hsv
**Should Match:**
- `hsv(120, 100%, 50%)`
- `hsv(120deg, 100%, 50%)`
- `hsv(120 100% 50%)`
- `hsv(120 100% 50% / 0.5)`

**Should NOT Match:**
- `hsv(120, 100%)`
- `hsv(120deg, 100%, 50%, 0.5, extra)`

---

## hsva
**Should Match:**
- `hsva(120, 100%, 50%, 0.5)`
- `hsva(120deg, 100%, 50%, 1)`
- `hsv(120 100% 50%)`
- `hsv(120 100% 50% / 0.5)`

**Should NOT Match:**
- `hsva(120, 100%)`
- `hsva(120deg, 100%, 50%, 1.5)`

---

## lab
**Should Match:**
- `lab(50% 40 59)`
- `lab(50% -40 59)`
- `lab(50% 40 -59)`
- `lab(50% 40 59 / 0.5)`
- `lab(50 40 59)`

**Should NOT Match:**
- `lab(50% 40)`
- `lab(50%, 40, 59)`

---

## oklab
**Should Match:**
- `oklab(50% 0.1 0.2)`
- `oklab(50% -0.1 0.2)`
- `oklab(50% 0.1 -0.2)`
- `oklab(50% 0.1 0.2 / 0.5)`
- `oklab(50 0.1 0.2)`

**Should NOT Match:**
- `oklab(50% 0.1)`
- `oklab(50%, 0.1, 0.2)`

---

## lch
**Should Match:**
- `lch(50% 70 120)`
- `lch(50% 70 120deg)`
- `lch(50% 70 2rad)`
- `lch(50% 70 0.5turn)`
- `lch(50% 70 120 / 0.5)`

**Should NOT Match:**
- `lch(50% 70)`
- `lch(50%, 70, 120)`

---

## oklch
**Should Match:**
- `oklch(50% 0.2 120)`
- `oklch(50% 0.2 120deg)`
- `oklch(50% 0.2 2rad)`
- `oklch(50% 0.2 0.5turn)`
- `oklch(50% 0.2 120 / 0.5)`

**Should NOT Match:**
- `oklch(50% 0.2)`
- `oklch(50%, 0.2, 120)`

---

## cmyk
**Should Match:**
- `cmyk(0%, 100%, 100%, 0%)`
- `cmyk(0, 100, 100, 0)`
- `cmyk(0% 100% 100% 0%)`
- `cmyk(0 100 100 0)`

**Should NOT Match:**
- `cmyk(0%, 100%, 100%)`
- `cmyk(0%, 100%, 100%, 0%, 50%)`

---

## color
**Should Match:**
- `color(display-p3 1 0.5 0)`
- `color(display-p3 1 0.5 0 / 0.5)`
- `color(srgb 1 0.5 0)`
- `color(xyz 0.5 0.3 0.2)`

**Should NOT Match:**
- `color(display-p3)`
- `color()`

---

## namedColors
**Should Match:**
- `red`
- `blue`
- `transparent`
- `currentColor`
- `aliceblue`
- `lightgoldenrodyellow`
- `inherit`
- `initial`

**Should NOT Match:**
- `notacolor`
- `reds`
- `Red123`

---

## Tips for Testing on regex101.com:
1. Select **ECMAScript (JavaScript)** as the flavor
2. Enable the **case insensitive** flag (`i`) for most patterns
3. Enable **multiline** flag (`m`) if testing multiple colors at once
4. The `^` and `$` anchors ensure complete string matching
5. Test both positive (should match) and negative (should not match) examples

*/