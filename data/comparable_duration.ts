import {Duration, ParseConfig, serialize, parse as _parse} from "tinyduration";

/**
 * Extends the Duration type from tinyduration with methods that allow comparison and math operations.
 */
export type ComparableDuration = {
    valueOf(): number;
    toString(): string;
    [Symbol.toPrimitive](hint: string): string|number;
} & Duration;

/**
 * Makes any object of type Duration comparable.
 *
 * @param duration The Duration object to extend
 */
export function comparable(duration: Duration): ComparableDuration {
    let comparableDuration = { ...duration };
    comparableDuration.valueOf = (): number => {
        return ((this.years ?? 0) * 60 * 60 * 24 * 365.25
            + (this.months ?? 0) * 60 * 60 * 24 * 30.4375
            + (this.weeks ?? 0) * 60 * 60 * 24 * 7
            + (this.days ?? 0) * 60 * 60 * 24
            + (this.hours ?? 0) * 60 * 60
            + (this.minutes ?? 0) * 60
            + (this.seconds ?? 0))
            * ((this.negative ?? false) ? -1 : 1);
    }
    comparableDuration.toString = (): string => {
        return serialize(this);
    }
    comparableDuration[Symbol.toPrimitive] = (hint: string): string|number => {
        return (hint == "number") ? this.valueOf() : this.toString();
    }
    return comparableDuration as ComparableDuration;
}

/**
 * Wraps parse function from tinyduration to return a ComparableDuration instead.
 *
 * @param durationStr string to parse into a ComparableDuration object
 * @param config optional tinyduration ParseConfig
 */
export function parse(durationStr: string, config?: ParseConfig): ComparableDuration {
    return comparable(_parse(durationStr, config))
}