
TAX SEASON IS COMING UP - CHECK YOUR MYPAY ACCOUNT
Inbox
DFAS - SmartDocs@mail.mil

10: 40 AM(10 hours ago)
	
	
to me
 



Tax season is coming up, and it's time to check your myPay account at https://mypay.dfas.mil.

Your myPay account provides convenient access to information about your pay and allows you to easily update your contact information, manage your pay, and download or print your tax statement IRS forms 1099 - R or 1095 - B(for retirees only).You can also use myPay to change your federal tax withholding and update your bank account information.

You can access myPay on your computer or mobile device, and it is available 24 hours a day, 7 days a week.

Please take a moment to verify your email address, mailing address, and mobile number in myPay.If your email and mailing address are current, DFAS can send you important information.Plus, adding your mobile number and keeping it up to date in myPay will ensure you are able to receive temporary passwords and important text messages related to your myPay account if you choose to activate mobile notifications.

SET UP A MYPAY REMINDER

Did you know your myPay password expires every 150 days ?

    Be sure to keep your password updated, and plan to review your entire myPay account at least once a year - your birthday or tax season is a great time to review and update your information.

NEED YOUR MYPAY PASSWORD ?

    If you do not remember your password, select the "Forgot or Need a Password" link.Then, follow the instructions.

IF YOU NEED ADDITIONAL ASSISTANCE

Contact myPay Customer Service:

BY PHONE

Toll free: 1 - 888 - DFAS411 or 1 - 888 - 332 - 7411 option 5
Commercial: 317 - 212-0550
Defense Switching Network(DSN): 312 - 699-0550
Hours of Operation: Monday - Friday, 8: 30 A.M.to 4: 30 P.M.ET

BY EMAIL

Review the FAQs on myPay's main page and submit a question using ASK myPay at https://corpweb1.dfas.mil/askDFAS/custMain.action?mid=2

Sincerely,
    DFAS Retired and Annuitant Pay



___________________________________________________
Delivered by Defense Finance and Accounting Service



vitest.config.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        name: 'unit',
        environment: 'node',
        include: [
            './test/**/*.{test,spec}.ts'
        ],
        exclude: [
            './.gitignore',
            './node_modules',
            '**/src/OLD_TEMP.ts'
        ],
        coverage: {
            provider: 'v8',
            include: [
                './src/**/*.{ts,tsx}'
            ],
            exclude: [
                '**/src/OLD_TEMP.ts'
            ],
        },
    },
})





tsconfig.json

{
    // Visit https://aka.ms/tsconfig to read more about this file
    "compilerOptions": {
        // File Layout
        "rootDir": "./",
            // Environment Settings
            "module": "esnext",
                "target": "esnext",
                    "allowImportingTsExtensions": true,
                        "rewriteRelativeImportExtensions": true,
                            // Other Outputs
                            "sourceMap": true,
                                "declaration": true,
                                    "declarationMap": true,
                                        // Stricter Typechecking Options
                                        "exactOptionalPropertyTypes": true,
                                            // Style Options
                                            "noUnusedLocals": true,
                                                "noUnusedParameters": true,
                                                    "noFallthroughCasesInSwitch": true,
                                                        // Recommended Options
                                                        "strict": true,
                                                            "jsx": "react-jsx",
                                                                "verbatimModuleSyntax": true,
                                                                    "isolatedModules": true,
                                                                        "noUncheckedSideEffectImports": true,
                                                                            "moduleDetection": "force",
                                                                                "skipLibCheck": false,
                                                                                    "esModuleInterop": true
    },
    "include": [
        "./index.ts",
        "./globals.d.ts",
        "src/**/*.ts",
        "src/types/**/*.d.ts",
    ],
        "exclude": [
            ".vscode",
            "node_modules",
            "covergage",
            "test",
            ".gitignore"
        ]
}





package.json

{
    "name": "color",
        "version": "0.1.0",
            "description": "HTML color library and CSS color string lexer/parser.",
                "keywords": [
                    "html",
                    "canvas",
                    "color",
                    "css",
                    "lexer",
                    "parser",
                    "typescript",
                    "javascript"
                ],
                    "license": "MIT",
                        "author": "Dustin R. Dew email: phyxashun@gmail.com",
                            "type": "module",
                                "main": "./index.ts",
                                    "scripts": {
        "test": "vitest",
            "coverage": "vitest run --coverage"
    },
    "devDependencies": {
        "@types/node": "^24.10.1",
            "@types/typescript": "^0.4.29",
                "@vitest/coverage-v8": "^4.0.15",
                    "ts-node": "^10.9.2",
                        "typescript": "^5.9.3",
                            "vitest": "^4.0.15"
    }
}






index.ts

/// <reference path='./globals.d.ts' />

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





globals.d.ts

    // globals.d.ts

    /*
    // Define the basic structure of the AST nodes
    interface NumericLiteralNode {
        type: 'numericLiteral';
        value: string; // The raw number string
        unit: string;  // e.g., '%', 'px', or ''
        channel?: 'red' | 'green' | 'blue' | 'alpha'; // Optional semantic label
    }
    
    interface OperatorNode {
        type: 'operator';
        value: ',' | '/'; // Comma or Slash separator
    }
    
    type ValueNode = NumericLiteralNode | OperatorNode;
    
    interface FunctionNode {
        type: 'function';
        value: 'rgb' | 'rgba'; // Function name
        nodes: ValueNode[]; // Array of arguments/operators
    }
    
    type AST = FunctionNode;
    
    type ASTNode = { 
        type: string; 
        value: string; 
        nodes?: ASTNode[] 
    };
    /*
    /*
    type ColorName = keyof typeof NamedColors;
    
    type ColorMap = Record<ColorName, Color>;
    
    type ColorString = {
        get: {
            (color: string): { model: Model; value: number[] } | null;
            rgb: (color: string) => number[] | null;
            hsl: (color: string) => number[] | null;
            hwb: (color: string) => number[] | null;
        };
        to: {
            hex: (r: number, g: number, b: number, a?: number) => string | null;
            rgb: {
                (r: number, g: number, b: number, a?: number): string | null;
                percent: (r: number, g: number, b: number, a?: number) => string | null;
            };
            keyword: (r: number, g: number, b: number, a?: number) => string | null;
            hsl: (h: number, s: number, l: number, a?: number) => string | null;
            hwb: (h: number, w: number, b: number, a?: number) => string | null;
        };
    };
    
    interface IColor {
        toString: () => string;
    }
    
    type ColorLike = IColor | string | ArrayLike<number> | number | Record<string, any>;
    type ColorJson = { model: string; color: number[]; alpha: number };
    type ColorObject = { alpha?: number | undefined } & Record<string, number>;
    
    type TColorModel =
        | 'hex'
        | 'rgb'
        | 'rgba'
        | 'hsl'
        | 'hsla'
        | 'hwb'
        | 'hwba'
        | 'lab'
        | 'lch'
        | 'oklab'
        | 'oklch'
        | 'hsv'
        | 'hsva'
        | 'cmyk';
    
    type TColorChannelMap = {
        hex: { value: string };
        rgb: { r: number; g: number; b: number };
        rgba: { r: number; g: number; b: number, alpha: number };
        hsl: { h: number; s: number; l: number };
        hsla: { h: number; s: number; l: number, alpha: number };
        hwb: { h: number; w: number; b: number };
        hwba: { h: number; w: number; b: number, alpha: number };
        lab: { l: number; a: number; b: number, alpha?: number };
        lch: { l: number; c: number; h: number, alpha?: number };
        oklab: { l: number; a: number; b: number, alpha?: number };
        oklch: { l: number; c: number; h: number, alpha?: number };
    };
    
    type TModelParsedColor<T extends TColorModel = TColorModel> = { model: T } & TColorChannelMap[T];
    
    // Union of all parsed colors
    //type TParsedColor = TModelParsedColor<'hex'>
    //    | TModelParsedColor<'rgb'>
    //    | TModelParsedColor<'rgba'>
    //    | TModelParsedColor<'hsl'>
    //    | TModelParsedColor<'hsla'>
    //    | TModelParsedColor<'hwb'>
    //    | TModelParsedColor<'hwba'>
    //    | TModelParsedColor<'lab'>
    //    | TModelParsedColor<'lch'>
    //    | TModelParsedColor<'oklab'>
    //    | TModelParsedColor<'oklch'>;
    // Union of all parsed colors ... same as the commented out TParsedColor above
    type TParsedColor = TColorModel extends infer M
        ? M extends TColorModel
        ? TModelParsedColor<M>
        : never
        : never;
    
    // Union of all parsed colors ... same as the commented out TParsedColor above, except as an interface
    interface IParsedColor extends TParsedColor { }
    
    // A helper utility type to calculate the length of a string literal type T
    type LengthOfStringLiteral<T extends string> = T['length'];
    */




    / test / Tokenizer.test.ts

/// <reference types='../src/types/Tokenizer.d.ts' />

import { describe, it, expect } from 'vitest';
import Tokenizer, { TokenType } from '../src/Tokenizer.ts';
//import Parser from '../src/Parser.ts';

describe('tokenizer', () => {
    describe('tokenization', () => {
        it('should tokenize whitespace', () => {
            const tokenizer = new Tokenizer('   ');
            for (const t of tokenizer.tokens) {
                expect(t.type).toBe(TokenType.EOF); // Whitespace is skipped
            }
        });

        it('should tokenize function names', () => {
            const tokenizer = new Tokenizer('rgb');
            const token = tokenizer.tokens[0]
            expect(token.type).toBe(TokenType.FUNCTION);
            expect(token.value).toBe('rgb');
        });

        it('should tokenize all function types', () => {
            const functions = [
                'rgb', 'rgba',
                'hsl', 'hsla',
                'hwb', 'hwba',
                'lab', 'lch',
                'oklab', 'oklch',
                'hsv', 'hsva',
                'cmyk', 'color'];

            for (const fn of functions) {
                const tokenizer = new Tokenizer(fn);
                const token = tokenizer.tokens[0];
                expect(token.type).toBe(TokenType.FUNCTION);
                expect(token.value).toBe(fn);
            }
        });

        it('should tokenize hex values', () => {
            const tokenizer = new Tokenizer('#abc123');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.HEXSTRING);
            expect(token.value).toBe('#abc123');
        });

        it('should tokenize numbers', () => {
            const tokenizer = new Tokenizer('255');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.NUMBER);
            expect(token.value).toBe('255');
        });

        it('should tokenize decimal numbers', () => {
            const tokenizer = new Tokenizer('0.5');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.NUMBER);
            expect(token.value).toBe('0.5');
        });

        it('should tokenize percentages', () => {
            const tokenizer = new Tokenizer('100%');
            const percent = tokenizer.tokens[0];
            expect(percent.type).toBe(TokenType.PERCENT);
            expect(percent.value).toBe('100%');
        });

        it('should tokenize angle units', () => {
            const units = ['deg', 'rad', 'grad', 'turn'];
            for (const unit of units) {
                const tokenizer = new Tokenizer(`120${unit}`);
                const token = tokenizer.tokens[1];
                expect(token.type).toBe(TokenType.UNITS);
                expect(token.value).toBe(unit);
            }
        });

        it('should tokenize parentheses', () => {
            const tokenizer = new Tokenizer('()');
            const lparen = tokenizer.tokens[0];
            const rparen = tokenizer.tokens[1];
            expect(lparen.type).toBe(TokenType.LPAREN);
            expect(rparen.type).toBe(TokenType.RPAREN);
        });

        it('should tokenize comma', () => {
            const tokenizer = new Tokenizer(',');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.COMMA);
        });

        it('should tokenize slash', () => {
            const tokenizer = new Tokenizer('/');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.SLASH);
        });

        it('should return EOF at end of input', () => {
            const tokenizer = new Tokenizer('');
            const token = tokenizer.tokens[0];
            expect(token.type).toBe(TokenType.EOF);
        });

        it('should throw on unexpected characters', () => {
            expect(() => new Tokenizer('@invalid')).toThrow();
        });
    });

    describe('complex tokenization', () => {
        const tokenizer = new Tokenizer('rgb(255, 0, 0)');
        const tokens = tokenizer.tokens;

        console.log("TOKENS:", tokens);

        it('should tokenize complete rgb function', () => {
            expect(tokens[0].type).toBe(TokenType.FUNCTION);
            expect(tokens[1].type).toBe(TokenType.LPAREN);
            expect(tokens[2].type).toBe(TokenType.NUMBER);
            expect(tokens[3].type).toBe(TokenType.COMMA);
            expect(tokens[4].type).toBe(TokenType.NUMBER);
            expect(tokens[5].type).toBe(TokenType.COMMA);
            expect(tokens[6].type).toBe(TokenType.NUMBER);
            expect(tokens[7].type).toBe(TokenType.RPAREN);
            expect(tokens[8].type).toBe(TokenType.EOF);
        });
    });
});
/*
describe('Parser', () => {
    describe('hex colors', () => {
        it('should parse 3-digit hex colors', () => {
            const parser = new Parser();
            const ast = parser.parse('#fff');

            expect(ast.type).toBe(NodeType.start);
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#fff');
        });

        it('should parse 4-digit hex colors with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('#ffff');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ffff');
        });

        it('should parse 6-digit hex colors', () => {
            const parser = new Parser();
            const ast = parser.parse('#ff00ff');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ff00ff');
        });

        it('should parse 8-digit hex colors with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('#ff00ff80');

            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#ff00ff80');
        });

        it('should handle uppercase hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#ABCDEF');

            expect(ast.value.value.value).toBe('#ABCDEF');
        });

        it('should handle mixed case hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#AbCdEf');

            expect(ast.value.value.value).toBe('#AbCdEf');
        });
    });

    describe('RGB/RGBA - space-separated syntax', () => {
        it('should parse rgb with integers', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            expect(ast.value.value.type).toBe(NodeType.function);
            expect(ast.value.value.value.type).toBe(NodeType.channels);
            expect(ast.value.value.value.value.type).toBe(NodeType.space);
            expect(ast.value.value.value.value.channels).toHaveLength(3);
            expect(ast.value.value.value.value.channels[0].value).toBe(255);
            expect(ast.value.value.value.value.channels[1].value).toBe(0);
            expect(ast.value.value.value.value.channels[2].value).toBe(0);
        });

        it('should parse rgb with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 50% 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[0].value).toBe(100);
            expect(channels[0].units).toBe('%');
        });

        it('should parse rgba with slash alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.5)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeDefined();
            expect(spaceList.alpha?.type).toBe(NodeType.alpha);
            expect(spaceList.alpha?.value.value).toBe(0.5);
        });

        it('should parse rgba with percentage alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 50%)');

            const alpha = ast.value.value.value.value.alpha;
            expect(alpha?.value.valueType).toBe('percentage');
            expect(alpha?.value.value).toBe(50);
        });

        it('should parse rgba with alpha = 1', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 1)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(1);
        });

        it('should parse rgba function name', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255 0 0 / 0.5)');

            expect(ast.value.value.name).toBe('rgba');
        });
    });

    describe('RGB/RGBA - comma-separated syntax', () => {
        it('should parse rgb with commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255, 0, 0)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
            expect(ast.value.value.value.value.channels[0].value).toBe(255);
            expect(ast.value.value.value.value.channels[1].value).toBe(0);
            expect(ast.value.value.value.value.channels[2].value).toBe(0);
        });

        it('should parse rgba with comma alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255, 0, 0, 0.5)');

            const commaList = ast.value.value.value.value;
            expect(commaList.alpha).toBeDefined();
            expect(commaList.alpha?.type).toBe(NodeType.optional_alpha);
            expect(commaList.alpha?.value.value).toBe(0.5);
        });

        it('should parse rgb with percentages and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100%, 50%, 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[1].valueType).toBe('percentage');
            expect(channels[2].valueType).toBe('percentage');
        });

        it('should handle spaces around commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 , 0 , 0)');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });
    });

    describe('HSL/HSLA - space-separated syntax', () => {
        it('should parse hsl with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(ast.value.value.name).toBe('hsl');
            expect(channels[0].valueType).toBe('angle');
            expect(channels[0].value).toBe(120);
            expect(channels[0].units).toBe('deg');
            expect(channels[1].valueType).toBe('percentage');
            expect(channels[2].valueType).toBe('percentage');
        });

        it('should parse hsl without units on hue', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(120);
            expect(channels[0].valueType).toBe('number');
        });

        it('should parse hsl with radians', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(2rad 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].units).toBe('rad');
        });

        it('should parse hsl with gradians', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(133grad 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].units).toBe('grad');
        });

        it('should parse hsl with turns', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(0.33turn 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.33);
            expect(channels[0].units).toBe('turn');
        });

        it('should parse hsla with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50% / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse hsla function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hsla(120deg 100% 50% / 0.5)');

            expect(ast.value.value.name).toBe('hsla');
        });
    });

    describe('HSL/HSLA - comma-separated syntax', () => {
        it('should parse hsl with commas', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120, 100%, 50%)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
            expect(ast.value.value.value.value.channels[0].value).toBe(120);
        });

        it('should parse hsla with comma alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsla(120, 100%, 50%, 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });

        it('should parse hsl with degrees and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg, 100%, 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });
    });

    describe('HWB/HWBA', () => {
        it('should parse hwb', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120 30% 50%)');

            expect(ast.value.value.name).toBe('hwb');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(120);
            expect(channels[1].value).toBe(30);
            expect(channels[2].value).toBe(50);
        });

        it('should parse hwb with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120deg 30% 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });

        it('should parse hwba with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hwb(120 30% 50% / 0.7)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.7);
        });

        it('should parse hwba function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hwba(120 30% 50% / 0.7)');

            expect(ast.value.value.name).toBe('hwba');
        });
    });

    describe('HSV/HSVA', () => {
        it('should parse hsv', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120 100% 50%)');

            expect(ast.value.value.name).toBe('hsv');
        });

        it('should parse hsv with comma syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120, 100%, 50%)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse hsva with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('hsv(120 100% 50% / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse hsva function name', () => {
            const parser = new Parser();
            const ast = parser.parse('hsva(120, 100%, 50%, 0.5)');

            expect(ast.value.value.name).toBe('hsva');
        });
    });

    describe('LAB', () => {
        it('should parse lab', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50 40 59)');

            expect(ast.value.value.name).toBe('lab');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(40);
            expect(channels[2].value).toBe(59);
        });

        it('should parse lab with percentage lightness', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50% 40 59)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse lab with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50 40 59 / 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse lab with decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('lab(50.5 40.2 59.8)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50.5);
            expect(channels[1].value).toBe(40.2);
            expect(channels[2].value).toBe(59.8);
        });
    });

    describe('OKLAB', () => {
        it('should parse oklab', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50 0.1 0.2)');

            expect(ast.value.value.name).toBe('oklab');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(0.1);
            expect(channels[2].value).toBe(0.2);
        });

        it('should parse oklab with percentage', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50% 0.1 0.2)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse oklab with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('oklab(50 0.1 0.2 / 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });
    });

    describe('LCH', () => {
        it('should parse lch', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120)');

            expect(ast.value.value.name).toBe('lch');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(50);
            expect(channels[1].value).toBe(70);
            expect(channels[2].value).toBe(120);
        });

        it('should parse lch with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120deg)');

            expect(ast.value.value.value.value.channels[2].units).toBe('deg');
        });

        it('should parse lch with percentage lightness', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50% 70 120)');

            expect(ast.value.value.value.value.channels[0].valueType).toBe('percentage');
        });

        it('should parse lch with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120 / 0.9)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.9);
        });

        it('should parse lch with decimal hue', () => {
            const parser = new Parser();
            const ast = parser.parse('lch(50 70 120.5)');

            expect(ast.value.value.value.value.channels[2].value).toBe(120.5);
        });
    });

    describe('OKLCH', () => {
        it('should parse oklch', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50 0.2 120)');

            expect(ast.value.value.name).toBe('oklch');
        });

        it('should parse oklch with degrees', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50% 0.2 120deg)');

            expect(ast.value.value.value.value.channels[2].units).toBe('deg');
        });

        it('should parse oklch with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('oklch(50 0.2 120 / 0.6)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.6);
        });
    });

    describe('CMYK', () => {
        it('should parse cmyk with space syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0 100 100 0)');

            expect(ast.value.value.name).toBe('cmyk');
            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(100);
            expect(channels[2].value).toBe(100);
        });

        it('should parse cmyk with comma syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0, 100, 100, 0)');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse cmyk with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('cmyk(0% 100% 100% 0%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[1].valueType).toBe('percentage');
        });
    });

    describe('COLOR function', () => {
        it('should parse color function', () => {
            const parser = new Parser();
            const ast = parser.parse('color(display-p3 1 0.5 0)');

            expect(ast.value.value.name).toBe('color');
        });

        it('should parse color with decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('color(srgb 0.5 0.3 0.2)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.5);
            expect(channels[1].value).toBe(0.3);
            expect(channels[2].value).toBe(0.2);
        });

        it('should parse color with alpha', () => {
            const parser = new Parser();
            const ast = parser.parse('color(display-p3 1 0.5 0 / 0.8)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.8);
        });
    });

    describe('edge cases', () => {
        it('should handle no whitespace', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255,0,0)');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });

        it('should handle extra whitespace', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(  255   0   0  )');

            expect(ast.value.value.value.value.channels).toHaveLength(3);
        });

        it('should handle mixed whitespace and commas', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb( 255 , 0 , 0 )');

            expect(ast.value.value.value.value.type).toBe(NodeType.comma);
        });

        it('should parse zero values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0 0 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(0);
            expect(channels[2].value).toBe(0);
        });

        it('should parse alpha = 0', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });

        it('should parse very small decimals', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.001)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.001);
        });
    });

    describe('error handling', () => {
        it('should throw on missing hash for hex color', () => {
            const parser = new Parser();
            expect(() => parser.parse('fff')).toThrow();
        });

        it('should throw on missing opening parenthesis', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb 255, 0, 0)')).toThrow();
        });

        it('should throw on missing closing parenthesis', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255, 0, 0')).toThrow();
        });

        it('should throw on missing comma in comma-separated list', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255 0, 0)')).toThrow();
        });

        it('should throw on invalid function name', () => {
            const parser = new Parser();
            expect(() => parser.parse('invalid(255, 0, 0)')).toThrow();
        });

        it('should throw on unexpected token', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255, 0, 0, 0, 0)')).toThrow();
        });

        it('should throw on premature EOF', () => {
            const parser = new Parser();
            expect(() => parser.parse('rgb(255')).toThrow();
        });

        it('should throw on invalid hex characters', () => {
            const parser = new Parser();
            expect(() => parser.parse('#xyz')).toThrow();
        });
    });

    describe('case insensitivity', () => {
        it('should handle uppercase function names', () => {
            const parser = new Parser();
            const ast = parser.parse('RGB(255, 0, 0)');

            expect(ast.value.value.name).toBe('rgb');
        });

        it('should handle mixed case function names', () => {
            const parser = new Parser();
            const ast = parser.parse('RgBa(255, 0, 0, 0.5)');

            expect(ast.value.value.name).toBe('rgba');
        });

        it('should handle uppercase angle units', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120DEG 100% 50%)');

            expect(ast.value.value.value.value.channels[0].units).toBe('deg');
        });
    });

    describe('real world examples', () => {
        it('should parse common red color', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            expect(ast.value.type).toBe(NodeType.color);
        });

        it('should parse transparent black', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(0, 0, 0, 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });

        it('should parse semi-transparent white', () => {
            const parser = new Parser();
            const ast = parser.parse('rgba(255, 255, 255, 0.5)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0.5);
        });

        it('should parse pure green in HSL', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120, 100%, 50%)');

            expect(ast.value.value.name).toBe('hsl');
        });

        it('should parse blue with modern syntax', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(240 100% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(240);
        });

        it('should parse yellow', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 255 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[1].value).toBe(255);
            expect(channels[2].value).toBe(0);
        });

        it('should parse cyan in modern HSL', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(180deg 100% 50%)');

            expect(ast.value.value.value.value.channels[0].value).toBe(180);
        });

        it('should parse magenta', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 255)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[2].value).toBe(255);
        });

        it('should parse orange', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 165 0)');

            expect(ast.value.value.value.value.channels[1].value).toBe(165);
        });

        it('should parse gray with percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(50% 50% 50%)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].valueType).toBe('percentage');
            expect(channels[0].value).toBe(50);
        });
    });

    describe('comprehensive color space tests', () => {
        it('should parse all RGB variants', () => {
            const parser = new Parser();
            const colors = [
                'rgb(255 0 0)',
                'rgb(255, 0, 0)',
                'rgba(255 0 0 / 0.5)',
                'rgba(255, 0, 0, 0.5)',
                'rgb(100% 0% 0%)',
                'rgb(100%, 0%, 0%)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.type).toBe(NodeType.start);
                expect(ast.value.value.name).toMatch(/^rgba?$/);
            });
        });

        it('should parse all HSL variants', () => {
            const parser = new Parser();
            const colors = [
                'hsl(120 100% 50%)',
                'hsl(120, 100%, 50%)',
                'hsla(120 100% 50% / 0.5)',
                'hsla(120, 100%, 50%, 0.5)',
                'hsl(120deg 100% 50%)',
                'hsl(2rad 100% 50%)',
                'hsl(0.33turn 100% 50%)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.value.value.name).toMatch(/^hsla?$/);
            });
        });

        it('should parse all angle units', () => {
            const parser = new Parser();
            const units = ['deg', 'rad', 'grad', 'turn'];

            units.forEach(unit => {
                const ast = parser.parse(`hsl(120${unit} 100% 50%)`);
                expect(ast.value.value.value.value.channels[0].units).toBe(unit);
            });
        });

        it('should parse hex colors of all lengths', () => {
            const parser = new Parser();
            const colors = ['#f00', '#f00f', '#ff0000', '#ff0000ff'];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.value.value.type).toBe(NodeType.hexcolor);
                expect(ast.value.value.value).toBe(color);
            });
        });
    });

    describe('AST structure validation', () => {
        it('should have correct node hierarchy for rgb', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            // Validate structure
            expect(ast.type).toBe(NodeType.start);
            expect(ast.value).toBeDefined();
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value).toBeDefined();
            expect(ast.value.value.type).toBe(NodeType.function);
            expect(ast.value.value.value).toBeDefined();
            expect(ast.value.value.value.type).toBe(NodeType.channels);
            expect(ast.value.value.value.value).toBeDefined();
            expect(ast.value.value.value.value.type).toBe(NodeType.space);
            expect(ast.value.value.value.value.channels).toHaveLength(3);
            expect(ast.value.value.value.value.channels[0].type).toBe(NodeType.value);
        });

        it('should have correct node hierarchy for hex', () => {
            const parser = new Parser();
            const ast = parser.parse('#fff');

            expect(ast.type).toBe(NodeType.start);
            expect(ast.value.type).toBe(NodeType.color);
            expect(ast.value.value.type).toBe(NodeType.hexcolor);
            expect(ast.value.value.value).toBe('#fff');
        });

        it('should have alpha node when present', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0.5)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeDefined();
            expect(spaceList.alpha?.type).toBe(NodeType.alpha);
            expect(spaceList.alpha?.value).toBeDefined();
            expect(spaceList.alpha?.value.type).toBe(NodeType.value);
        });

        it('should not have alpha node when absent', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            const spaceList = ast.value.value.value.value;
            expect(spaceList.alpha).toBeUndefined();
        });
    });

    describe('value node properties', () => {
        it('should correctly identify number type', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('number');
            expect(channel.units).toBeUndefined();
        });

        it('should correctly identify percentage type', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 0% 0%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('percentage');
            expect(channel.units).toBe('%');
        });

        it('should correctly identify angle type with deg', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(120deg 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('deg');
        });

        it('should correctly identify angle type with rad', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(2rad 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('rad');
        });

        it('should correctly identify angle type with grad', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(133grad 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('grad');
        });

        it('should correctly identify angle type with turn', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(0.33turn 100% 50%)');

            const channel = ast.value.value.value.value.channels[0];
            expect(channel.valueType).toBe('angle');
            expect(channel.units).toBe('turn');
        });

        it('should store correct numeric values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(123 45 67)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(123);
            expect(channels[1].value).toBe(45);
            expect(channels[2].value).toBe(67);
        });

        it('should store correct decimal values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0.5 0.25 0.75)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0.5);
            expect(channels[1].value).toBe(0.25);
            expect(channels[2].value).toBe(0.75);
        });
    });

    describe('function name normalization', () => {
        it('should normalize function names to lowercase', () => {
            const parser = new Parser();
            const colors = [
                ['RGB(255, 0, 0)', 'rgb'],
                ['RGBA(255, 0, 0, 0.5)', 'rgba'],
                ['HSL(120, 100%, 50%)', 'hsl'],
                ['HSLA(120, 100%, 50%, 0.5)', 'hsla'],
                ['HWB(120 30% 50%)', 'hwb'],
                ['LAB(50 40 59)', 'lab'],
                ['LCH(50 70 120)', 'lch'],
                ['OKLAB(50 0.1 0.2)', 'oklab'],
                ['OKLCH(50 0.2 120)', 'oklch']
            ];

            colors.forEach(([input, expected]) => {
                const ast = parser.parse(input);
                expect(ast.value.value.name).toBe(expected);
            });
        });
    });

    describe('boundary values', () => {
        it('should handle max RGB values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 255 255)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(255);
            expect(channels[1].value).toBe(255);
            expect(channels[2].value).toBe(255);
        });

        it('should handle min RGB values', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0 0 0)');

            const channels = ast.value.value.value.value.channels;
            expect(channels[0].value).toBe(0);
            expect(channels[1].value).toBe(0);
            expect(channels[2].value).toBe(0);
        });

        it('should handle 100% percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(100% 100% 100%)');

            const channels = ast.value.value.value.value.channels;
            channels.forEach(channel => {
                expect(channel.value).toBe(100);
                expect(channel.valueType).toBe('percentage');
            });
        });

        it('should handle 0% percentages', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(0% 0% 0%)');

            const channels = ast.value.value.value.value.channels;
            channels.forEach(channel => {
                expect(channel.value).toBe(0);
                expect(channel.valueType).toBe('percentage');
            });
        });

        it('should handle 360deg hue', () => {
            const parser = new Parser();
            const ast = parser.parse('hsl(360deg 100% 50%)');

            expect(ast.value.value.value.value.channels[0].value).toBe(360);
        });

        it('should handle alpha = 1', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 1)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(1);
        });

        it('should handle alpha = 0', () => {
            const parser = new Parser();
            const ast = parser.parse('rgb(255 0 0 / 0)');

            expect(ast.value.value.value.value.alpha?.value.value).toBe(0);
        });
    });

    describe('performance tests', () => {
        it('should parse multiple colors efficiently', () => {
            const parser = new Parser();
            const colors = [
                '#fff',
                'rgb(255, 0, 0)',
                'hsl(120, 100%, 50%)',
                'rgba(255, 0, 0, 0.5)',
                'hsla(120, 100%, 50%, 0.8)',
                'hwb(120 30% 50%)',
                'lab(50 40 59)',
                'lch(50 70 120)',
                'oklab(50 0.1 0.2)',
                'oklch(50 0.2 120)'
            ];

            colors.forEach(color => {
                const ast = parser.parse(color);
                expect(ast.type).toBe(NodeType.start);
            });
        });

        it('should handle long hex values', () => {
            const parser = new Parser();
            const ast = parser.parse('#aabbccdd');

            expect(ast.value.value.value).toBe('#aabbccdd');
        });
    });
});//*/





/src/Tokenizer.ts

/// <reference types='./types/Tokenizer.d.ts' />

const __DEBUG__ = true;

import { CC } from '../src/Colors.ts';

/* Regular Expressions */
/*
const RX = {
    ALPHA: /[a-zA-Z]+/i,
    NUMBER: /[\d]/i,
    HASH: /[#]/i,
    EXPONENT: /e/i,
    KEYWORD: /^(#|rgba?|hsla?|hwba?|lab|lch|oklab|oklch)+\b/i,
    IDENTIFIER: /(deg|grad|rad|turn)/i,
    OPERATOR: /[%.\-]/i,
    DELIMITER: /[\(\),\/]/i,
    INTEGER: /[-+]?\d+/i,
    FLOAT: /[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/i,
    DOUBLEQUOTE: /"(?:[^"\\]|\\.)*"/i,
    SINGLEQUOTE: /'(?:[^'\\]|\\.)*'/i,
    BOOLEAN: /\b(true|false)\b/i,
    WHITESPACE: /\s+/i,
    COMMENTS: /\/\*[^]*?\*\/|\/\/[^\n]+/i,
    EOL: /\n|$/i,
    ANSICOLORS = /\x1b\[[0-9;]*m/g;
} as const; //*/

export const TokenType: Record<TokenType, TokenType> = {
    FUNCTION: 'FUNCTION',           // 'rgba', 'rgb', 'hsl', etc.
    IDENTIFIER: 'IDENTIFIER',       // Any word/letter not already captured 
    HEXSTRING: 'HEXSTRING',         // '#fff', '#ffff', '#ffffff', '#ffffffff'
    NUMBER: 'NUMBER',               // '127', '120', '80'
    PERCENT: 'PERCENT',             // '80%'
    UNITS: 'UNITS',                   // 'deg', 'rad', 'grad', 'turn'
    COMMA: 'COMMA',                 // ',' (for older syntax)
    SLASH: 'SLASH',                 // '/' (for modern syntax)
    LPAREN: 'LPAREN',               // '('
    RPAREN: 'RPAREN',               // ')'
    DELIMITER: 'DELIMITER',         // Any delimiter not already captured
    WHITESPACE: 'WHITESPACE',       // ' '
    CHAR: 'CHAR',                   // Any single character not already captured
    EOF: 'EOF'                      // End of line/string
} as const;

export const TokenSpec: TokenSpec = [
    [TokenType.WHITESPACE, /^[\s]+/],
    [TokenType.FUNCTION, /^(rgba?|hsla?|hwba?|hsva?|lab|lch|oklab|oklch|cmyk|color)/i], ///^[a-zA-Z]+\b/ },
    [TokenType.PERCENT, /^-?\d*\.?\d+%/],
    [TokenType.NUMBER, /^-?\d*\.?\d+/],
    [TokenType.HEXSTRING, /^#([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})+$/i],
    [TokenType.UNITS, /^(deg|grad|rad|turn)\b/i],
    [TokenType.COMMA, /^,/],
    [TokenType.SLASH, /^\//],
    [TokenType.LPAREN, /^\(/],
    [TokenType.RPAREN, /^\)/],
] as const;

export default class Tokenizer {
    private readonly data: any[] = [];

    source: string = '';
    private currentPosition: number = 0;
    tokens: Token[] = [];
    //AST: ASTNode | null;

    //
    // 1. TOKENIZER CONSTRUCTOR()
    // 1.A. Constructor Args
    //
    constructor(...args: any[]) {
        this.print('1. Tokenizer - Constructor()');
        const [sourceString] = [...args];
        this.source = this.validateSource(sourceString);
        this.print('1.A. Constructor Args:', this.source);

        this.tokens = this.tokenize();
        //this.AST = this.createAST(this.tokens!);

        if (__DEBUG__) console.log('\n')
        if (__DEBUG__) console.table(this.data);
    }

    private print(m?: string, v1?: any, v2?: any): void {
        if (!v1 && !v2) {
            this.data.push({
                Message: m
            });
        } else if (v1 !== null && typeof v1 === 'object' && !v2) {
            this.data.push({
                Message: m,
                Value1: JSON.stringify(v1)
            });
        } else if (v1 !== null && typeof v1 === 'object' &&
            v2 !== null && typeof v2 === 'object') {
            this.data.push({
                Message: m,
                Value1: JSON.stringify(v1),
                Value2: JSON.stringify(v2)
            });
        } else if (!v2) {
            this.data.push({
                Message: m,
                Value1: v1
            });
        } else {
            this.data.push({
                Message: m,
                Value1: v1,
                Value2: v2
            });
        }
    }

    private validateSource(...args: any) {
        const [result] = [...args];
        if (typeof result !== 'string')
            throw new Error('Tokenizer validateSource(): Class expects a string...');
        return result;
    }

    private get isEOL(): boolean {
        return this.currentPosition >= this.source.length;
    }

    //
    // 2. Tokenize()
    //
    private tokenize(): Token[] {
        this.print('2. Tokenizer - tokenize()');

        let tokens: Token[] = [];

        while (!this.isEOL) {
            let matched = false;
            for (const [tokenType, regexp] of TokenSpec) {
                const match = this.source.substring(this.currentPosition).match(regexp);
                if (match) {
                    // Skip whitespace tokens in the final list for the parser
                    if (tokenType !== TokenType.WHITESPACE) {
                        const matchedToken = { type: tokenType, value: match[0] };
                        tokens.push(matchedToken);
                    }
                    this.currentPosition += match[0].length;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                this.print('2.B. Tokenizer - tokens:', 'null');
                const p = this.currentPosition;
                let msg = `${CC.red}ERROR:${CC.reset} Tokenizer.tokenize(): `;
                msg += `Unexpected ${CC.red}character: ${this.source[p]}${CC.reset}, `;
                msg += `at ${CC.blue}position: ${p}${CC.reset}.`;
                console.error(msg);
                throw new SyntaxError(msg);
            }
        }

        tokens.push({ type: TokenType.EOF, value: '' });
        for (const token of tokens) {
            this.print('2.B. Tokenizer - tokens:', token);
        }
        return tokens;
    }

    //
    // 3. CreateAST()
    //
    /*
    private createAST(tokens: Token[]): ASTNode | null {
        this.print('3. Tokenizer - createAST()');
        if (tokens === null) return null;

        let current = 0; // Current token index

        // Helper to get the current token
        function walk(): ASTNode | null {

            let token = tokens[current];

            if (!token) return null;

            // --- RULE 1: Handle a Function Call (e.g., rgba(...)) ---
            if (token.type === 'FUNCTION') {
                current++; // Consume the function name token

                // Expect a left parenthesis next
                if (tokens[current].type !== 'OPEN_PAREN') {
                    throw new Error('Expected ( after function name');
                }
                current++; // Consume the '(' token

                // Create the main Function Node
                const functionNode: ASTNode = {
                    type: 'function',
                    value: token.value, // "rgba"
                    nodes: [],          // We will push arguments/operators here
                };

                // Loop through arguments/operators until we hit the closing ')'
                while (tokens[current] && tokens[current].type !== 'CLOSE_PAREN') {
                    // We call walk() recursively to parse the *next* meaningful token inside the function
                    const childNode = walk();
                    if (childNode) {
                        functionNode.nodes!.push(childNode);
                    }
                }

                // Expect and consume the right parenthesis
                if (tokens[current].type !== 'CLOSE_PAREN') {
                    throw new Error('Expected ) after function arguments');
                }
                current++; // Consume the ')' token

                return functionNode;
            }

            // --- RULE 2: Handle Numbers (Arguments) ---
            if (token.type === 'NUMBER') {
                current++; // Consume the number token
                return {
                    type: 'numeric', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // --- RULE 3: Handle Operators (Commas) ---
            if (token.type === 'COMMA') {
                current++; // Consume the comma token
                return {
                    type: 'operator',
                    value: ',',
                };
            }

            // --- RULE 4: Handle Hex Strings (Arguments) ---
            if (token.type === 'HEXSTRING') {
                current++; // Consume the hex string token
                return {
                    type: 'hexstring', // Matches our previous AST type name
                    value: token.value,
                    //unit: "", // Generic parser might leave unit logic to the lexer or later pass
                };
            }

            // If we hit an unexpected token, something is wrong with the input or grammar
            throw new Error('Unknown token type: ' + token.type);
        }

        // Start the parsing process. We only expect one top-level function call here.
        const ast = walk();

        // Basic validation that we processed all tokens
        if (current !== tokens.length) {
            // In a real-world scenario, you might have whitespace tokens that are ignored
            console.warn("Parser finished early or has leftover tokens.");
        }
        this.print('3.A. Tokenizer - ast', ast);
        return ast;
    }//*/

} // End of class Tokenizer
//*/







/src/OLD_TEMP.ts

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



