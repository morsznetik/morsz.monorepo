import { DateTime } from "luxon"

export const POPULAR_TIMEZONES: Record<string, string> = {
    "Pacific/Kwajalein": "MHT",
    "Pacific/Pago_Pago": "SST",
    "Pacific/Honolulu": "HST",
    "America/Anchorage": "AKDT/AKST",
    "America/Los_Angeles": "PDT/PST",
    "America/Denver": "MDT/MST",
    "America/Mexico_City": "CDT/CST",
    "America/New_York": "EDT/EST",
    "America/Santiago": "CLST/CLT",
    "America/Sao_Paulo": "BRT", // (BRT/BRST) Brazil currently doesn't use DST (BRST)
    "Atlantic/South_Georgia": "GST",
    "Atlantic/Azores": "AZOT/AZOST",
    "Europe/London": "BST/GMT",
    "Europe/Paris": "CEST/CET",
    "Africa/Cairo": "EET/EEST",
    "Europe/Moscow": "MSK",
    "Asia/Tehran": "IRST/IRDT",
    "Asia/Dubai": "GST", // ambiguous w/ South Georgia
    "Asia/Kabul": "AFT",
    "Asia/Karachi": "PKT",
    "Asia/Kolkata": "IST",
    "Asia/Kathmandu": "NPT",
    "Asia/Dhaka": "BST",
    "Asia/Yangon": "MMT",
    "Asia/Bangkok": "ICT",
    "Asia/Shanghai": "CST",
    "Asia/Tokyo": "JST",
    "Australia/Adelaide": "ACST/ACDT",
    "Australia/Sydney": "AEST/AEDT",
    "Australia/Lord_Howe": "LHST/LHDT",
    "Pacific/Guadalcanal": "SBT",
    "Pacific/Auckland": "NZST/NZDT",
    "Pacific/Chatham": "CHAST/CHADT",
    "Pacific/Tongatapu": "TOT",
    "Pacific/Kiritimati": "LINT",
}

// return the abbreviation mapping or a readable fallback
export function getTimezoneAbbreviation(timezone: string): string {
    return (
        POPULAR_TIMEZONES[timezone] ??
        timezone.replace(/_/g, " ").replace(/\//g, ", ")
    )
}

// returns the popular timezones with current offset and a friendly label
// note: offsets are computed at "now" - DST will change these labels across the year.
export function getUniqueTimezones(): {
    name: string
    label: string
    offset: number
}[] {
    const now = DateTime.now()

    return Object.keys(POPULAR_TIMEZONES)
        .map((zone: string) => {
            const dt = now.setZone(zone)

            if (!dt.isValid) {
                console.warn(`Invalid timezone: ${zone}`)
                return null
            }

            const offsetMinutes = dt.offset // minutes
            const absOffset = Math.abs(offsetMinutes)
            const sign = offsetMinutes >= 0 ? "+" : "-"
            const hours = Math.floor(absOffset / 60)
            const minutes = absOffset % 60

            const offsetStr = `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`

            const locationName =
                zone.split("/").pop()?.replace(/_/g, " ") ?? zone

            const abbr = POPULAR_TIMEZONES[zone]

            return {
                name: zone,
                label: `${offsetStr} (${abbr}) — ${locationName}`,
                offset: offsetMinutes,
            }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.offset - b.offset)
}

// UTC timezones
export function getUTCTimezones(): {
    name: string
    label: string
    offset: number
}[] {
    const ranges = Array.from({ length: 27 }, (_, i) => i - 12) // -12 .. +14
    const base = ranges.map(offsetHours => {
        const sign = offsetHours >= 0 ? "+" : "-"
        const hours = Math.abs(offsetHours)
        const offsetStr = `UTC${sign}${String(hours).padStart(2, "0")}:00`
        return {
            name: `UTC${sign}${String(hours).padStart(2, "0")}`,
            label: `${offsetStr} — Fixed Offset`,
            offset: offsetHours * 60,
        }
    })

    // common fractional offsets (30 or 45 mins)
    const fractional: { name: string; label: string; offset: number }[] = [
        {
            name: "UTC+05:30",
            label: "UTC+05:30 — Fixed Offset",
            offset: 5 * 60 + 30,
        },
        {
            name: "UTC+05:45",
            label: "UTC+05:45 — Fixed Offset",
            offset: 5 * 60 + 45,
        },
        {
            name: "UTC+09:30",
            label: "UTC+09:30 — Fixed Offset",
            offset: 9 * 60 + 30,
        },
        {
            name: "UTC+12:45",
            label: "UTC+12:45 — Fixed Offset",
            offset: 12 * 60 + 45,
        },
        {
            name: "UTC-09:30",
            label: "UTC-09:30 — Fixed Offset",
            offset: -9 * 60 - 30,
        },
    ]

    return [...base, ...fractional].sort((a, b) => a.offset - b.offset)
}

// normalize custom UTC-like names to something Luxon accepts
// accepts formats: "GMT" -> "UTC", "UTC+05", "UTC+05:30", "UTC+05:00", "UTC-8", etc.
export function normalizeTimezoneForLuxon(timezone: string): string {
    if (timezone === "GMT") return "UTC"

    // match UTC±HH or UTC±HH:MM or UTC±HHMM
    const match = timezone.match(/^UTC([+-])(\d{1,2})(?::?(\d{2}))?$/)
    if (match) {
        const [, sign, hStr, mStr] = match
        const hours = String(parseInt(hStr!, 10)) // remove leading zero
        const minutes = mStr
            ? `:${String(parseInt(mStr, 10)).padStart(2, "0")}`
            : ""
        return `UTC${sign}${hours}${minutes}`
    }

    return timezone
}
