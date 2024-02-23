export type Duration = {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
}

export class DurationUtils {
    static parseDuration(durationStr: string): Duration {
        const DURATION_REGEX = /^\s*P((?<years>\d+)Y)?((?<months>\d+)M)?((?<weeks>\d+)W)?((?<days>\d+)D)?(T((?<hours>\d+)H)?((?<minutes>\d+)M)?((?<seconds>\d+(\.\d+)?)S)?)?\s*$/
        let matches = durationStr.match(DURATION_REGEX)

        return {
            years: (!!matches.groups.years) ? parseInt(matches.groups.years) : undefined,
            months: (!!matches.groups.months) ? parseInt(matches.groups.months) : undefined,
            weeks: (!!matches.groups.weeks) ? parseInt(matches.groups.weeks) : undefined,
            days: (!!matches.groups.days) ? parseInt(matches.groups.days) : undefined,
            hours: (!!matches.groups.hours) ? parseInt(matches.groups.hours) : undefined,
            minutes: (!!matches.groups.minutes) ? parseInt(matches.groups.minutes) : undefined,
            seconds: (!!matches.groups.seconds) ? parseFloat(matches.groups.seconds) : undefined
        }
    }

    static durationInSeconds(d: Duration | string) {
        const duration = (typeof d == "object") ? d : DurationUtils.parseDuration(d)
        return ((duration.years ?? 0) * 60 * 60 * 24 * 365.25
            + (duration.months ?? 0) * 60 * 60 * 24 * 30.4375
            + (duration.weeks ?? 0) * 60 * 60 * 24 * 7
            + (duration.days ?? 0) * 60 * 60 * 24
            + (duration.hours ?? 0) * 60 * 60
            + (duration.minutes ?? 0) * 60
            + (duration.seconds ?? 0))
    }
}
