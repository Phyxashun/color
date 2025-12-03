/// <reference types='./globals.d.ts' />

import Tokenizer from "./src/Tokenizer.ts";
//import Color from "./Color.ts";
//import Colors from "./Colors.ts";

export const test = [

    // Named colors
    //new Color(Colors.rebeccapurple),
    //new Color('rebeccapurple'),
    //new Color(Colors.aliceblue),
    //new Color('aliceblue'),

    // NUM Numbers (R, G, B, A?)
    //new Color(255, 255, 255),
    //new Color(255, 255, 255, 0.5),

    // RGB Hexadecimal
    //new Color('#f09'),
    //new Color('#ff0099'),
    //new Color('#ff0099ff'),

    // RGB (Red, Green, Blue)
    //new Color('rgb(255 0 153)'),
    //new Color('rgb(255 0 153 / 80%)'),
    //new Color('rgba(0, 0, 0, 0.5)'),

    // HSL (Hue, Saturation, Lightness)
    //new Color('hsl(150 30% 60%)'),
    //new Color('hsl(150 30% 60% / 80%)'),
    //new Color('hsl(240, 100%, 50 %)'),
    //new Color('hsl(240 100% 50 %)'),
    //new Color('hsl(240deg, 100%, 50%, 0.5)'),
    //new Color('hsl(240deg 100% 50% / 0.5)'),
    /*
        // HWB (Hue, Whiteness, Blackness)
        new Color('hwb(12 50% 0%)'),
        new Color('hwb(194 0% 0% / 0.5)'),
    
        // Lab (Lightness, A-axis, B-axis)
        new Color('lab(50% 40 59.5)'),
        new Color('lab(50% 40 59.5 / 0.5)'),
        
        // LCH (Lightness, Chroma, Hue)
        new Color('lch(52.2% 72.2 50)'),
        new Color('lch(52.2% 72.2 50 / 0.5)'),
        
        // Oklab (Lightness, A-axis, B-axis)
        new Color('oklab(59% 0.1 0.1)'),
        new Color('oklab(59% 0.1 0.1 / 0.5)'),
        
        // OkLCh (Lightness, Chroma, Hue)
        new Color('oklch(60% 0.15 50)'),
        new Color('oklch(60% 0.15 50 / 0.5)'),
    //*/
] as const;

//for (const color in test) {
//  console.log(`TEST_${color}:`, test[color]);
//}

//export const test_A1 = new Color("#0F0");
//export const test_A2 = new Color("#4CAF50");
//export const test_A3 = new Color("#FF00DC80");
//export const test_A4 = new Color("#F0C8");

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
export const wrong1 = new Tokenizer('invalidcolor');

// Too short hex value
//export const wrong2 = new Color('#ff');

// Out of range
//export const wrong3 = new Color('rgb(256, 0, 0)');

// Non-numeric
//export const wrong4 = new Color('rgb(a, b, c)');


