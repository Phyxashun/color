// /test/utils/counterTest.ts
import { it } from 'vitest';
import Counter from './Counter.ts';

/**
 * Counter-backed Vitest macro for deterministic test numbering.
 *
 * Example output:
 *   [1] initializes numeric counter
 *   [A] switches to alpha mode
 */

type Func = () => void;

interface Options {
    auto?: boolean;
    alpha?: boolean;
    prefix?: string;
}

type CounterProps = [description: string, fn: Func, options?: Options];


const itCounter = (...props: CounterProps) => {
    const [description, fn, options] = props;

    const counter = new Counter(
        options?.auto ?? true,
        options?.alpha ?? false
    );

    const prefix = options?.prefix ?? '';

    it(`${prefix}${counter.toString()} ${description}`, fn);
}

export default itCounter;
