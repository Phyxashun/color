// /test/Counter.test.ts
import { describe, expect } from 'vitest';
import Counter from '../src/utils/Counter.ts';
import itCounter from '../src/utils/counterTest.ts';

describe('Counter – numeric mode', () => {
    itCounter('starts at 1 by default', () => {
        const c = new Counter();
        expect(c.get()).toBe(1);
    });

    itCounter('increments with add()', () => {
        const c = new Counter();
        c.add();
        expect(c.get()).toBe(2);
    });

    itCounter('decrements with sub()', () => {
        const c = new Counter();
        c.sub();
        expect(c.get()).toBe(0);
    });

    itCounter('resets to 1', () => {
        const c = new Counter();
        c.add().add().reset();
        expect(c.get()).toBe(1);
    });

    itCounter('next() returns current value then increments', () => {
        const c = new Counter(true);
        expect(c.next()).toBe(1);
        expect(c.get()).toBe(2);
    });

    itCounter('auto(false) disables auto increment', () => {
        const c = new Counter();
        c.auto(false);
        expect(c.next()).toBe(1);
        expect(c.get()).toBe(1);
    });

    itCounter('auto() toggles auto increment', () => {
        const c = new Counter();
        c.auto(); // off
        expect(c.next()).toBe(1);
        c.auto(); // on
        expect(c.next()).toBe(1);
        expect(c.get()).toBe(2);
    });

    itCounter('toString() returns stringified next()', () => {
        const c = new Counter();
        expect(c.toString()).toBe('1');
        expect(c.get()).toBe(2);
    });
});

describe('Counter – alpha mode', () => {
    itCounter(
        'starts at A',
        () => {
            const c = new Counter(true, true);
            expect(c.get()).toBe('A');
        },
        { alpha: true }
    );

    itCounter(
        'increments alphabetically',
        () => {
            const c = new Counter(true, true);
            c.add();
            expect(c.get()).toBe('B');
        },
        { alpha: true }
    );

    itCounter(
        'decrements alphabetically',
        () => {
            const c = new Counter(true, true);
            c.sub();
            expect(c.get()).toBe('Z');
        },
        { alpha: true }
    );

    itCounter(
        'wraps Z → A',
        () => {
            const c = new Counter(true, true);
            c.set('Z');
            c.add();
            expect(c.get()).toBe('A');
        },
        { alpha: true }
    );

    itCounter(
        'wraps A → Z',
        () => {
            const c = new Counter(true, true);
            c.sub();
            expect(c.get()).toBe('Z');
        },
        { alpha: true }
    );

    itCounter(
        'resets to A',
        () => {
            const c = new Counter(true, true);
            c.add().add().reset();
            expect(c.get()).toBe('A');
        },
        { alpha: true }
    );
});

describe('Counter – mode switching', () => {
    itCounter('switches from number → alpha', () => {
        const c = new Counter();
        c.alpha(true);
        expect(c.isAlpha).toBe(true);
        expect(c.get()).toBe('A');
    });

    itCounter('switches from alpha → number', () => {
        const c = new Counter(true, true);
        c.alpha(false);
        expect(c.isAlpha).toBe(false);
        expect(c.get()).toBe(1);
    });

    itCounter('preserves auto mode when switching', () => {
        const c = new Counter();
        c.auto(false);
        c.alpha(true);
        expect(c.next()).toBe('A');
        expect(c.get()).toBe('A');
    });
});

describe('Counter – set() validation', () => {
    itCounter('allows valid numeric set', () => {
        const c = new Counter();
        c.set(42);
        expect(c.get()).toBe(42);
    });

    itCounter('allows valid alpha set', () => {
        const c = new Counter(true, true);
        c.set('Z');
        expect(c.get()).toBe('Z');
    });

    itCounter('throws on numeric → alpha mismatch', () => {
        const c = new Counter();
        expect(() => c.set('A' as any)).toThrow(TypeError);
    });

    itCounter('throws on alpha → numeric mismatch', () => {
        const c = new Counter(true, true);
        expect(() => c.set(5 as any)).toThrow(TypeError);
    });
});

describe('Counter – internal error paths', () => {
    itCounter('throws if next() is called before initialization', () => {
        class BrokenCounter extends Counter {
            constructor() {
                super();
                (this as any).instance.count = undefined;
            }
        }

        const c = new BrokenCounter();
        expect(() => c.next()).toThrow('Counter(): Counter not initialized.');
    });
});
