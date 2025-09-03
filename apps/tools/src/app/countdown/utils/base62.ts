const BASE62_CHARS =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

export function encodeBase62(num: number): string {
    if (num === 0) return "0"
    let result = ""
    while (num > 0) {
        result = BASE62_CHARS[num % 62] + result
        num = Math.floor(num / 62)
    }
    return result
}
export function decodeBase62(str: string): number {
    if (typeof str !== "string" || str.length === 0)
        throw new Error("Invalid base62 string")
    let result = 0
    for (let i = 0; i < str.length; i++) {
        const char = str[str.length - 1 - i]
        if (typeof char !== "string")
            throw new Error("Invalid base62 character")
        const value = BASE62_CHARS.indexOf(char)
        if (value === -1) throw new Error("Invalid base62 character")
        result += value * Math.pow(62, i)
    }
    return result
}

export function encodeTimezoneOffset(offsetMinutes: number): string {
    const offsetHours = offsetMinutes / 60
    const mapped = offsetHours + 12 // -12 -> 0, +14 -> 26
    if (mapped < 0 || mapped > 26) throw new Error("Invalid timezone offset")
    return encodeBase62(Math.floor(mapped))
}

export function decodeTimezoneOffset(encoded: string): number {
    if (!encoded) throw new Error("Invalid encoded timezone offset")
    const mapped = decodeBase62(encoded as string)
    return (mapped - 12) * 60 // 0 -> -720, 26 -> 840 minutes
}

export function encodeToken(timestamp: number, timezoneOffset: number): string {
    const timePart = encodeBase62(timestamp)
    const tzPart = encodeTimezoneOffset(timezoneOffset)
    return `${timePart}${tzPart}`
}

export function decodeToken(token: string | null): {
    timestamp: number
    timezoneOffset: number
} {
    if (!token || token.length < 2) throw new Error("Invalid token format")

    const tzPart = token.slice(-1)
    const timePart = token.slice(0, -1)

    if (!timePart || !tzPart) throw new Error("Invalid token format")

    const timestamp = decodeBase62(timePart)
    const timezoneOffset = decodeTimezoneOffset(tzPart)

    return { timestamp, timezoneOffset }
}
