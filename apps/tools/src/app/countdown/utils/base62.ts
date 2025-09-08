const BASE62_CHARS =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const BASE = 62n

export function encodeBase62(n: bigint): string {
    if (n < 0n) throw new Error("Cannot be negative")
    if (n === 0n) return "0"

    const chars: string[] = []
    while (n > 0n) {
        const rem = Number(n % BASE)
        chars.push(BASE62_CHARS[rem]!)
        n /= BASE
    }
    return chars.reverse().join("")
}

export function decodeBase62(str: string): bigint {
    if (!str) throw new Error("Invalid base62 string")

    return [...str].reduce((acc, ch) => {
        const v = BigInt(BASE62_CHARS.indexOf(ch))
        if (v < 0n) throw new Error("Invalid base62 string")
        return acc * BASE + v
    }, 0n)
}

export function encodeTimezoneOffset(offsetMinutes: number): string {
    // accept any multiple of 15; round to nearest 15
    const mapped = Math.round((offsetMinutes + 12 * 60) / 15) // {x∈Z|0≤x≤104}
    if (mapped < 0 || mapped > 104) throw new Error("Invalid timezone offset")
    return encodeBase62(BigInt(mapped)).padStart(2, "0")
}

export function decodeTimezoneOffset(encoded: string): number {
    if (!encoded || encoded.length !== 2)
        throw new Error("Invalid encoded timezone offset")
    const mapped = Number(decodeBase62(encoded))
    // mapped * 15 minutes - 12*60 => original minutes
    return mapped * 15 - 12 * 60
}

export function encodeTitle(title: string): string {
    if (!title?.trim()) return ""

    // turn the string into utf-8 bytes, then add them all into a bigint
    // for each byte, shift what we got left by 8 bits and add the byte
    // basically packs the whole string into a single number
    const combined = [...new TextEncoder().encode(title)].reduce(
        (acc, b) => (acc << 8n) + BigInt(b),
        0n
    )

    return encodeBase62(combined)
}

export function decodeTitle(encoded: string): string {
    if (!encoded) return ""

    let rem = decodeBase62(encoded)
    if (rem === 0n) return ""

    const bytes: number[] = []
    // pull out each byte from the big number by masking the last 8 bits
    // push it into an array, then shift right 8 bits to get the next byte
    while (rem > 0n) {
        bytes.push(Number(rem & 0xffn))
        rem >>= 8n
    }

    // reverse the bytes back to original order and decode as utf-8
    return new TextDecoder().decode(new Uint8Array(bytes.reverse()))
}

/** token format:
 * 1 char: timeLen (base62 index as a single char; timePart length must be < 62)
 * timePart: variable (base62)
 * tzPart: 2 chars (base62, padded)
 * titlePart: optional (base62)
 */
export function encodeToken(
    timestamp: number,
    timezoneOffset: number,
    title?: string
): string {
    if (!Number.isFinite(timestamp) || timestamp < 0)
        throw new Error("Invalid timestamp")
    const timePart = encodeBase62(BigInt(Math.floor(timestamp)))
    if (timePart.length >= 62) throw new Error("Timestamp encoding too long")
    const timeLenChar = BASE62_CHARS[timePart.length] // single char
    const tzPart = encodeTimezoneOffset(timezoneOffset) // always 2 chars
    const titlePart = title ? encodeTitle(title) : ""
    return `${timeLenChar}${timePart}${tzPart}${titlePart}`
}

export function decodeToken(token: string): {
    timestamp: number | bigint
    timezoneOffset: number
    title?: string
} {
    if (!token || token.length < 1 + 1 + 2)
        throw new Error("Invalid token format") // at least timeLen + time(>=1) + tz(2)
    // first char = time length
    const firstChar = token[0]
    if (!firstChar) throw new Error("Invalid token (empty)")
    const timeLen = BASE62_CHARS.indexOf(firstChar)
    if (timeLen === -1) throw new Error("Invalid token (time length)")
    const minExpected = 1 + timeLen + 2 // header + time + tz
    if (token.length < minExpected) throw new Error("Invalid token length")
    const timePart = token.slice(1, 1 + timeLen)
    const tzPart = token.slice(1 + timeLen, 1 + timeLen + 2)
    const titlePart = token.slice(1 + timeLen + 2) // may be empty

    const timestampBig = decodeBase62(timePart)
    let timestamp: number | bigint = timestampBig
    // convert to Number when safe
    if (timestampBig <= BigInt(Number.MAX_SAFE_INTEGER))
        timestamp = Number(timestampBig)

    const timezoneOffset = decodeTimezoneOffset(tzPart)
    const title = titlePart ? decodeTitle(titlePart) : undefined

    return { timestamp, timezoneOffset, title }
}
