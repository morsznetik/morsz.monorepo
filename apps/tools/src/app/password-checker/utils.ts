export enum CharsetType {
    Numbers = 0,
    Lowercase = 1,
    LowerUpper = 2,
    LowerUpperNumbers = 3,
    LowerUpperNumbersSymbols = 4,
}

export interface HiveTableEntry {
    charset: CharsetType
    times: string[] // length = TABLE_LENGTH
}

export const hiveTable_h200: HiveTableEntry[] = [
    {
        charset: CharsetType.Numbers,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "2 hours",
            "1 day",
            "1 week",
            "3 months",
            "3 years",
            "28 years",
            "276 years",
        ],
    },
    {
        charset: CharsetType.Lowercase,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "30 mins",
            "13 hours",
            "2 weeks",
            "1 year",
            "26 years",
            "684 years",
            "27k years",
            "462 years",
            "12m years",
            "312m years",
            "8bn years",
        ],
    },
    {
        charset: CharsetType.LowerUpper,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "2 hours",
            "5 days",
            "9 months",
            "40 years",
            "2k years",
            "107k years",
            "5m years",
            "291m years",
            "15bn years",
            "788bn years",
            "40tn years",
            "2qd years",
        ],
    },
    {
        charset: CharsetType.LowerUpperNumbers,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "9 hours",
            "3 weeks",
            "4 years",
            "232 years",
            "14k years",
            "889k years",
            "55m years",
            "3bn years",
            "212bn years",
            "13tn years",
            "815tn years",
            "50qd years",
        ],
    },
    {
        charset: CharsetType.LowerUpperNumbersSymbols,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "17 mins",
            "20 hours",
            "2 months",
            "11 years",
            "779 years",
            "54k years",
            "3m years",
            "267m years",
            "18bn years",
            "1tn years",
            "91tn years",
            "6qd years",
            "449qd years",
        ],
    },
]

export const hiveTable_5090: HiveTableEntry[] = [
    {
        charset: CharsetType.Numbers,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "2 hours",
            "1 day",
            "1 week",
            "3 months",
            "3 years",
            "28 years",
            "284 years",
            "2k years",
            "28k years",
            "284k years",
        ],
    },
    {
        charset: CharsetType.Lowercase,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "46 minutes",
            "20 hours",
            "3 weeks",
            "2 years",
            "40 years",
            "1k years",
            "27k years",
            "705k years",
            "18m years",
            "477m years",
            "12bn years",
            "322bn years",
            "8tn years",
        ],
    },
    {
        charset: CharsetType.LowerUpper,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "57 minutes",
            "2 days",
            "4 months",
            "15 years",
            "791 years",
            "41k years",
            "2m years",
            "111m years",
            "5bn years",
            "300bn years",
            "15tn years",
            "812tn years",
            "42qd years",
            "2qn years",
        ],
    },
    {
        charset: CharsetType.LowerUpperNumbers,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "2 hours",
            "6 days",
            "1 year",
            "62 years",
            "3k years",
            "238k years",
            "14m years",
            "917m years",
            "56bn years",
            "3tn years",
            "218tn years",
            "13qd years",
            "840qd years",
            "52qn years",
        ],
    },
    {
        charset: CharsetType.LowerUpperNumbersSymbols,
        times: [
            "Instant",
            "Instant",
            "Instant",
            "Instant",
            "4 hours",
            "2 weeks",
            "2 years",
            "164 years",
            "11k years",
            "803k years",
            "56m years",
            "3bn years",
            "275bn years",
            "19tn years",
            "1qd years",
            "94qd years",
            "6qn years",
            "463qn years",
        ],
    },
]

export type StrengthResult = {
    label: string
    color: string
    time: string
}

export enum TableType {
    H200 = "h200",
    RTX5090 = "5090",
}

export function getCharsetType(pw: string): CharsetType {
    const hasLower = /[a-z]/.test(pw)
    const hasUpper = /[A-Z]/.test(pw)
    const hasNumber = /[0-9]/.test(pw)
    const hasSymbol = /[^a-zA-Z0-9]/.test(pw)
    if (hasLower && hasUpper && hasNumber && hasSymbol)
        return CharsetType.LowerUpperNumbersSymbols
    if (hasLower && hasUpper && hasNumber) return CharsetType.LowerUpperNumbers
    if (hasLower && hasUpper) return CharsetType.LowerUpper
    if (hasLower) return CharsetType.Lowercase
    return CharsetType.Numbers
}

export function parseYears(time: string): number | null {
    // if its not parseable, return 0, probably should be an error but hey?
    if (/Instant(ly)?/i.test(time)) return 0

    const map: { [key: string]: number | string } = {
        hour: 1 / (24 * 365),
        day: 1 / 365,
        week: 7 / 365,
        month: 1 / 12,
        year: 1,
        k: 1_000,
        m: 1_000_000,
        bn: 1_000_000_000,
        tn: 1_000_000_000_000,
        // need to use strings for large numbers since they're too large for number types
        qd: "1000000000000000",
        qn: "1000000000000000000",
    }

    // regex to parse the time string
    const regex = /([\d,.]+)\s*(hour|day|week|month|year|k|m|bn|tn|qd|qn)s?/i
    const match = time.replace(/,/g, "").match(regex)

    if (!match || !match[1] || !match[2]) return null

    let value: number | bigint = parseFloat(match[1])
    const unit = match[2].toLowerCase()

    if (typeof map[unit] === "string") {
        // use bigint for very large numbers, but return null if not safe
        try {
            value =
                BigInt(Math.round(Number(value))) * BigInt(map[unit] as string)
            // if value is too large, return null
            if (value > BigInt(Number.MAX_SAFE_INTEGER)) return null
            value = Number(value)
        } catch {
            return null
        }
    } else if (unit in map) {
        value = Number(value) * (map[unit] as number)
    }

    // if unit is like 'k', 'm', etc., multiply by years
    if (["k", "m", "bn", "tn", "qd", "qn"].includes(unit)) {
        value = Number(value) * Number(map["year"])
    }

    return typeof value === "number" ? value : Number(value)
}

function formatYears(years: number): string {
    if (!isFinite(years)) return "Wow, you broke it"
    if (years < 1 / (24 * 365)) return "Instant"
    if (years < 1 / 365) return `${Math.round(years * 365 * 24)} hours`
    if (years < 1) return `${Math.round(years * 365)} days`
    if (years < 10) return `${Math.round(years)} years`
    if (years < 1_000) return `${Math.round(years)} years`
    if (years < 1_000_000) return `${Math.round(years / 1_000)}k years`
    if (years < 1_000_000_000) return `${Math.round(years / 1_000_000)}m years`
    if (years < 1_000_000_000_000)
        return `${Math.round(years / 1_000_000_000)}bn years`
    if (years < 1_000_000_000_000_000)
        return `${Math.round(years / 1_000_000_000_000)}tn years`
    if (years < 1e18) return `${Math.round(years / 1e15)}qd years`
    if (years < 1e21) return `${Math.round(years / 1e18)}qn years`
    if (years < 1e24) return `${Math.round(years / 1e21)}sx years`
    if (years < 1e27) return `${Math.round(years / 1e24)}sp years`
    if (years < 1e30) return `${Math.round(years / 1e27)}oc years`
    if (years < 1e33) return `${Math.round(years / 1e30)}nv years`
    return `${Math.round(years / 1e33)}dc years`
}

export function getStrength(
    pw: string,
    table: HiveTableEntry[]
): StrengthResult {
    const charset = getCharsetType(pw)
    const TABLE_LENGTH = table[0]?.times?.length ?? 0
    let idx = Math.min(pw.length - 1, TABLE_LENGTH - 1)
    if (idx < 0) idx = 0

    const entry = table.find(e => e.charset === charset) || table[0]
    if (!entry || !entry.times || entry.times.length === 0) {
        return { label: "Unknown", color: "default", time: "Unknown" }
    }

    let time = entry.times[idx] ?? "Unknown"
    let estimated = false

    // if password is longer than table, estimate exponentially
    if (pw.length > TABLE_LENGTH) {
        // find the last two parseable numeric entries in the table
        let lastIdx = TABLE_LENGTH - 1
        let lastTime: number | null = null
        let prevTime: number | null = null

        // search backwards for last two parseable values
        for (let i = TABLE_LENGTH - 1; i >= 0; --i) {
            const timeEntry = entry.times[i]
            if (timeEntry) {
                const t = parseYears(timeEntry)
                if (t !== null) {
                    if (lastTime === null) {
                        lastTime = t
                        lastIdx = i
                    } else if (prevTime === null) {
                        prevTime = t
                        break
                    }
                }
            }
        }

        // if there are two parseable values, estimate exponentially
        if (lastTime !== null && prevTime !== null && lastTime > prevTime) {
            const growth = lastTime / prevTime
            let est = lastTime
            for (let i = 0; i < pw.length - (lastIdx + 1); ++i) {
                est *= growth
            }
            time = formatYears(est)
            estimated = true
        // if there is one parseable value, use it, no need to estimate
        } else if (lastTime !== null) {
            time = ">" + formatYears(lastTime)
        } else {
            // if not, use the last entry in the table
            const lastEntry = entry.times[TABLE_LENGTH - 1]
            time = ">" + (lastEntry ?? "Unknown")
        }
    }

    // mapping for color and label
    let color: StrengthResult["color"] = "default"
    let label = "Weak"
    const cleanTime =
        typeof time === "string" && time.startsWith(">") ? time.slice(1) : time
    const years = parseYears(cleanTime)

    if (years !== null) {
        if (years < 1) {
            color = "bg-red-500/10 text-red-700 border-red-700/40"
            label = "Weak"
        } else if (years < 100_000) {
            color = "bg-orange-500/10 text-orange-700 border-orange-700/40"
            label = "Moderate"
        } else if (years < 1_000_000_000) {
            color = "bg-yellow-500/10 text-yellow-700 border-yellow-700/40"
            label = "Strong"
        } else {
            color = "bg-green-500/10 text-green-700 border-green-700/40"
            label = "Very Strong"
        }
    } else {
        color = "bg-green-500/10 text-green-700 border-green-700/40"
        label = "Very Strong"
    }

    if (estimated) time = `~${time}`
    return { label, color, time }
}
