/// <reference path='../globals.d.ts' />

import { describe, it, expect } from 'vitest'
import Color from "../src/Color.ts";
import Colors from "../src/Colors.ts";

const parseCssColor = (str: string) => {
    const result = new Color(str);
    return result;
}
/*
describe('Named Color', () => {
    it("should parse Colors.rebeccapurple", () => {
        const rebeccapurple = parseCssColor(Colors.rebeccapurple);
        
        expect(rebeccapurple.input).toEqual([ "#663399" ]);
        expect(rebeccapurple.parsed).toEqual({ 
            tokens: [ { "type": "HEXVALUE", "value": "#663399" } ], 
            color: { model: "rgba", r: 102, g: 51, b: 153, alpha: 1 },
        });
        expect(rebeccapurple.r).toEqual( 102 );
        expect(rebeccapurple.g).toEqual( 51 );
        expect(rebeccapurple.b).toEqual( 153 );
        expect(rebeccapurple.alpha).toEqual( 1 );
    });
});//*/


describe('parseCssColor', () => {
    /*    // Test valid hex values
        it('should parse 3-digit hex colors', () => {
            expect(parseCssColor('#fff').parsed.color).toEqual({
                model: "rgba", r: 255, g: 255, b: 255, alpha: 1
            });
            expect(parseCssColor('#000').parsed.color).toEqual({
                model: "rgba", r: 0, g: 0, b: 0, alpha: 1
            });
            expect(parseCssColor('#abc').parsed.color).toEqual({
                model: "rgba", r: 170, g: 187, b: 204, alpha: 1
            });
        });
    
        it('should parse 6-digit hex colors', () => {
            expect(parseCssColor('#ffffff').parsed.color).toEqual({
                model: "rgba", r: 255, g: 255, b: 255, alpha: 1
            });
            expect(parseCssColor('#000000').parsed.color).toEqual({
                model: "rgba", r: 0, g: 0, b: 0, alpha: 1
            });
            expect(parseCssColor('#aabbcc').parsed.color).toEqual({
                model: "rgba", r: 170, g: 187, b: 204, alpha: 1
            });
        });
    
        // Test valid rgb() values
        it('should parse rgb() colors', () => {
            expect(parseCssColor('rgb(255, 0, 128)').parsed.color).toEqual({
                model: "rgba", r: 255, g: 0, b: 128, alpha: 1
            });
            expect(parseCssColor('rgb(0, 0, 0)').parsed.color).toEqual({
                model: "rgba", r: 0, g: 0, b: 0, alpha: 1
            });
            // Test with different spacing
            expect(parseCssColor(' rgb( 100 , 50 , 200 ) ').parsed.color).toEqual({
                model: "rgba", r: 100, g: 50, b: 200, alpha: 1
            });
        });
    
        // Test valid named colors
        it('should parse named colors', () => {
            expect(parseCssColor('white').parsed.color).toEqual({
                model: "rgba", r: 255, g: 255, b: 255, alpha: 1
            });
            expect(parseCssColor('black').parsed.color).toEqual({
                model: "rgba", r: 0, g: 0, b: 0, alpha: 1
            });
            expect(parseCssColor('red').parsed.color).toEqual({
                model: "rgba", r: 255, g: 0, b: 0, alpha: 1
            });
        });
    //*/
    // Test invalid inputs
    it('should return null for invalid formats', () => {
        // Invalid identifier
        expect(parseCssColor('invalidcolor').parsed.color).toBeNull();

        // Too short hex value
        expect(parseCssColor('#ff').parsed.color).toBeNull();

        // Out of range
        expect(parseCssColor('rgb(256, 0, 0)').parsed.color).toBeNull();

        // Non-numeric
        expect(parseCssColor('rgb(a, b, c)').parsed.color).toBeNull();
    });
});//*/