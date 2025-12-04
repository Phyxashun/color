/// <reference types='./globals.d.ts' />

import Tokenizer from "./src/Tokenizer.ts";
import { Colors } from "./src/Colors.ts";

export const test = [

    // Named colors
    //new Tokenizer(Colors.rebeccapurple),
    //new Tokenizer('rebeccapurple'),
    //new Tokenizer(Colors.aliceblue),
    new Tokenizer('aliceblue'),

    // NUM Numbers (R, G, B, A?)
    //new Tokenizer(255, 255, 255),
    //new Tokenizer(255, 255, 255, 0.5),

    // RGB Hexadecimal
    new Tokenizer('#f09'),
    new Tokenizer('#ff0099'),
    new Tokenizer('#ff0099ff'),

    // RGB (Red, Green, Blue)
    new Tokenizer('rgb(255 0 153)'),
    new Tokenizer('rgb(255 0 153 / 80%)'),
    new Tokenizer('rgba(0, 0, 0, 0.5)'),

    // HSL (Hue, Saturation, Lightness)
    new Tokenizer('hsl(150 30% 60%)'),
    new Tokenizer('hsl(150 30% 60% / 80%)'),
    new Tokenizer('hsl(240, 100%, 50%)'),
    new Tokenizer('hsl(240 100% 50%)'),
    new Tokenizer('hsl(240deg, 100%, 50%, 0.5)'),
    new Tokenizer('hsl(240deg 100% 50% / 0.5)'),

    // HWB (Hue, Whiteness, Blackness)
    new Tokenizer('hwb(12 50% 0%)'),
    new Tokenizer('hwb(194 0% 0% / 0.5)'),

    // Lab (Lightness, A-axis, B-axis)
    new Tokenizer('lab(50% 40 59.5)'),
    new Tokenizer('lab(50% 40 59.5 / 0.5)'),

    // LCH (Lightness, Chroma, Hue)
    new Tokenizer('lch(52.2% 72.2 50)'),
    new Tokenizer('lch(52.2% 72.2 50 / 0.5)'),

    // Oklab (Lightness, A-axis, B-axis)
    new Tokenizer('oklab(59% 0.1 0.1)'),
    new Tokenizer('oklab(59% 0.1 0.1 / 0.5)'),

    // OkLCh (Lightness, Chroma, Hue)
    new Tokenizer('oklch(60% 0.15 50)'),
    new Tokenizer('oklch(60% 0.15 50 / 0.5)'),
] as const;

for (const color in test) {
    console.log(`TEST_${color}:`, JSON.stringify(test[color].AST, null, 2));
}

export const test_A1 = new Tokenizer("#0F0");
export const test_A2 = new Tokenizer("#4CAF50");
export const test_A3 = new Tokenizer("#FF00DC80");
export const test_A4 = new Tokenizer("#F0C8");

//console.log('TEST_A1: 3-digit shorthand:', test_A1); // Output: 3-digit shorthand: { r: 0, g: 255, b: 0, a: 1 }
//console.log('TEST_A2: 6-digit opaque:', test_A2); // Output: 6-digit opaque: { r: 76, g: 175, b: 80, a: 1 }
//console.log('TEST_A3: 8-digit transparent (50% opacity):', test_A3); // Output: 8-digit transparent (50% opacity): { r: 255, g: 0, b: 220, a: 0.5 }
//console.log('TEST_A4: 4-digit transparent shorthand:', test_A4); // Output: 4-digit transparent shorthand: { r: 255, g: 0, b: 204, a: 0.53 }

/*
hsl(240, 100%, 50%)
hsl(240 100% 50%)
hsl(240deg, 100%, 50%, 0.5)
hsl(240deg 100% 50% / 0.5)

hwb(240, 0%, 0%)
hwb(240 0% 0%)
hwb(240deg, 0%, 0%, 0.5)
hwb(240deg 0% 0% / 0.5)

lab(29.2345%,-19.55,6.31)
lab(29.2345% -19.55 6.31)
lab(29.2345% -19.55 6.31 / 0.5)

lch(52.2%,72.2,56.2)
lch(52.2% 72.2 56.2)
lch(52.2% 72.2 56.2deg / 0.5)

hsl(210 40% 20%)
lab(50 -20 30)
hsl(210, 40%, 20%)
lab(50%, -20, 30)
*/

// Should not work
export const wrong1 = new Tokenizer('invalidcolor'); // null

// Too short hex value
export const wrong2 = new Tokenizer('#ff'); // null

// Out of range
export const wrong3 = new Tokenizer('rgb(256, 0, 0)');

// Non-numeric
export const wrong4 = new Tokenizer('rgb(a, b, c)'); // null



export const white = new Tokenizer('white');
export const black = new Tokenizer('black');
export const red = new Tokenizer('red');
export const t1 = new Tokenizer('rgb(255, 0, 128)');
export const t2 = new Tokenizer('rgb( 0 , 0 , 0 )');
export const t3 = new Tokenizer('rgba(100 50 200 / 80%)');

console.log('');
