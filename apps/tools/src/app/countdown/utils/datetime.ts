import {
    POPULAR_TIMEZONES,
    normalizeTimezoneForLuxon,
} from "@/app/countdown/utils/timezone"
import { DateTime } from "luxon"

export interface TimeData {
    readonly days: number
    readonly hours: number
    readonly minutes: number
    readonly seconds: number
    readonly total: number
}

export interface CountdownData {
    targetDateTime: {
        iso: string
        timezone: string
    }
    timezone: string
    title?: string
    initialIsExpired: boolean
    initialTimeLeft?: TimeData
    initialTimePassed?: TimeData
}

export interface DateTimeComponents {
    date: string
    time: string
    timezone: string
}

// parse date and time into a luxon datetime object
export function parseDateTime(components: DateTimeComponents): DateTime | null {
    try {
        const { date, time, timezone } = components

        const [hour, minute] = time.split(":").map(Number)

        const normalizedTimezone = normalizeTimezoneForLuxon(timezone)

        const dt = DateTime.fromISO(date, { zone: normalizedTimezone }).set({
            hour,
            minute,
        })

        return dt.isValid ? dt : null
    } catch (error) {
        console.error("Error parsing date/time:", error)
        return null
    }
}

// parse date and time string format (YYYY-MM-DD HH:mm) into luxon datetime object
export function parseDateTimeString(
    dateTimeString: string,
    timezone: string
): DateTime | null {
    try {
        const normalizedTimezone = normalizeTimezoneForLuxon(timezone)
        const dt = DateTime.fromFormat(dateTimeString, "yyyy-MM-dd HH:mm", {
            zone: normalizedTimezone,
        })
        return dt.isValid ? dt : null
    } catch (error) {
        console.error("Error parsing date/time string:", error)
        return null
    }
}

// convert luxon datetime object to UTC timestamp (seconds since epoch)
export function toUTCTimestamp(dt: DateTime): number {
    return Math.floor(dt.toUTC().toSeconds())
}

// create luxon datetime object from UTC timestamp and timezone offset
export function fromUTCTimestampAndOffset(
    timestamp: number,
    timezoneOffsetMinutes: number
): DateTime {
    const targetTimezone = getTimezonesFromOffset(timezoneOffsetMinutes)
    const normalizedTimezone = normalizeTimezoneForLuxon(targetTimezone)
    return DateTime.fromSeconds(timestamp, { zone: normalizedTimezone })
}

// get current time in specified timezone
export function getCurrentTimeInTimezone(timezone: string): DateTime {
    const normalizedTimezone = normalizeTimezoneForLuxon(timezone)
    return DateTime.local().setZone(normalizedTimezone)
}

// calculate time difference between two luxon datetime objects
export function calculateTimeDifference(target: DateTime, current: DateTime) {
    return target.diff(current, ["days", "hours", "minutes", "seconds"])
}

// check if target time has passed
export function hasExpired(target: DateTime, current: DateTime): boolean {
    return target <= current
}

// get timezone name from UTC offset in minutes
export function getTimezonesFromOffset(offsetMinutes: number): string {
    const now = DateTime.utc()

    const matchingTimezone = Object.keys(POPULAR_TIMEZONES).find(
        (tz: string) => {
            try {
                return now.setZone(tz).offset === offsetMinutes
            } catch {
                return false
            }
        }
    )

    return matchingTimezone || "UTC"
}

export function calculateInitialTimeStates(
    targetDateTime: DateTime,
    timezone: string
): {
    initialTimeLeft: TimeData | null
    initialTimePassed: TimeData | null
    initialIsExpired: boolean
} {
    const now = getCurrentTimeInTimezone(timezone)
    const diff = calculateTimeDifference(targetDateTime, now)

    if (hasExpired(targetDateTime, now)) {
        const timeDiff = calculateTimeDifference(targetDateTime, now)

        return {
            initialIsExpired: true,
            initialTimeLeft: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0,
            },
            initialTimePassed: {
                days: Math.floor(Math.abs(timeDiff.days)),
                hours: Math.floor(Math.abs(timeDiff.hours)),
                minutes: Math.floor(Math.abs(timeDiff.minutes)),
                seconds: Math.floor(Math.abs(timeDiff.seconds)),
                total: now.toMillis() - targetDateTime.toMillis(),
            },
        }
    } else {
        return {
            initialIsExpired: false,
            initialTimeLeft: {
                days: Math.floor(diff.days),
                hours: Math.floor(diff.hours),
                minutes: Math.floor(diff.minutes),
                seconds: Math.floor(diff.seconds),
                total: targetDateTime.toMillis() - now.toMillis(),
            },
            initialTimePassed: null,
        }
    }
}

export function calculateCountdownUpdate(
    targetDateTime: DateTime,
    timezone: string
): {
    timeLeft: TimeData
    timePassed: TimeData | null
    isExpired: boolean
} {
    const now = getCurrentTimeInTimezone(timezone)
    const diff = calculateTimeDifference(targetDateTime, now)

    if (hasExpired(targetDateTime, now)) {
        const timeDiff = now.diff(targetDateTime, [
            "days",
            "hours",
            "minutes",
            "seconds",
        ])

        return {
            isExpired: true,
            timeLeft: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                total: 0,
            },
            timePassed: {
                days: Math.floor(Math.abs(timeDiff.days)),
                hours: Math.floor(Math.abs(timeDiff.hours)),
                minutes: Math.floor(Math.abs(timeDiff.minutes)),
                seconds: Math.floor(Math.abs(timeDiff.seconds)),
                total: now.toMillis() - targetDateTime.toMillis(),
            },
        }
    } else {
        return {
            isExpired: false,
            timeLeft: {
                days: Math.floor(diff.days),
                hours: Math.floor(diff.hours),
                minutes: Math.floor(diff.minutes),
                seconds: Math.floor(diff.seconds),
                total: targetDateTime.toMillis() - now.toMillis(),
            },
            timePassed: null,
        }
    }
}
