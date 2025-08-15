import UNICODE_DATA_NAME from "./name"
import UNICODE_DATA_SEQUENCE_NAME from "./sequence_name"
import UNICODE_DATA_TYPE from "./type"

// Type definitions for imported data
export type UnicodeType = typeof UNICODE_DATA_TYPE
export type UnicodeName = typeof UNICODE_DATA_NAME
export type UnicodeSequenceName = typeof UNICODE_DATA_SEQUENCE_NAME

export type CodepointRange = [number, number]
export type AliasCategories =
    | "correction"
    | "control"
    | "figment"
    | "alternate"
    | "abbreviation"
export type AliasMap = {
    [key in AliasCategories]?: string[]
}

const { TYPES, TYPE_NAMES, OFFSETS } = UNICODE_DATA_TYPE

const { NAMES, ALIASES, CP_RANGES, JAMO } = UNICODE_DATA_NAME
const NAMES_WORDS = UNICODE_DATA_NAME.COMMON_WORDS
const NAMES_REPLACE_BASE = UNICODE_DATA_NAME.REPLACE_BASE

const { SEQUENCES, EMOJI_NOT_QUALIFIED } = UNICODE_DATA_SEQUENCE_NAME
const SEQUENCES_WORDS = UNICODE_DATA_SEQUENCE_NAME.COMMON_WORDS
const SEQUENCES_REPLACE_BASE = UNICODE_DATA_SEQUENCE_NAME.REPLACE_BASE

const HANGUL_START = 44032
const HANGUL_END = 55203
const HANGUL_MEDIAL_MAX = 588
const HANGUL_FINAL_MAX = 28

/**
 * Generate name of Hangul syllables, see
 * https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_syllables_block
 * @private
 */
function hangulDecomposition(codepoint: number): string {
    const base = codepoint - HANGUL_START
    const final = base % HANGUL_FINAL_MAX
    const medial = Math.floor((base % HANGUL_MEDIAL_MAX) / HANGUL_FINAL_MAX)
    const initial = Math.floor(base / HANGUL_MEDIAL_MAX)

    return `${JAMO.INITIAL[initial]}${JAMO.MEDIAL[medial]}${JAMO.FINAL[final]}`
}

/**
 * Insert replaced words
 * @private
 */
function insertWords(
    rawName: string,
    words: string[],
    replaceBase: number
): string {
    return [...rawName]
        .map(char => {
            const codepoint = char.codePointAt(0)
            if (codepoint === undefined || codepoint < replaceBase) {
                return char
            } else {
                return `${words[codepoint - replaceBase]} `
            }
        })
        .join("")
        .trim()
}

/**
 * Returns number in hexadecimal with at least four digits
 * @private
 */
function codepointHex(n: number): string {
    return n.toString(16).toUpperCase().padStart(4, "0")
}

/**
 * Use codepoints instead of characters if preferred
 * @private
 */
function codepointToChar(codepoinOrNot: string | number): string {
    if (Number.isInteger(codepoinOrNot)) {
        return String.fromCodePoint(codepoinOrNot as number)
    } else {
        return codepoinOrNot as string
    }
}

/**
 * Returns the name that has been assigned to a Unicode codepoint.
 *
 * Please note:
 * Some common codepoints do not have a name (e.g. C0 control characters like \n)
 *
 * Also see:
 * - unicodeCorrectName(char) - Checks if there is a corrected name first, if not,
 *                              fallbacks to this method
 * - unicodeReadableName(char) - Displays correct name or an applicable alias
 *
 * @param char Single character string or codepoint
 * @returns Name of character or undefined
 */
export function unicodeBaseName(char: string | number): string | undefined {
    char = codepointToChar(char)

    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    const res = NAMES[char]

    if (res !== undefined) {
        return insertWords(res, NAMES_WORDS, NAMES_REPLACE_BASE)
    }

    if ([...char][1]) {
        return undefined
    }

    const codepoint = char.codePointAt(0)
    if (codepoint === undefined) return undefined

    for (const [prefix, ranges] of Object.entries(CP_RANGES)) {
        if (
            ranges.some(
                (range: [number, number]) =>
                    codepoint >= range[0] && codepoint <= range[1]
            )
        ) {
            return `${prefix}${codepointHex(codepoint)}`
        }
    }

    if (codepoint >= HANGUL_START && codepoint <= HANGUL_END) {
        return `HANGUL SYLLABLE ${hangulDecomposition(codepoint)}`
    }

    return undefined
}

/**
 * Returns the name that has been assigned to a Unicode codepoint, but if the codepoint
 * has a correction alias, use this instead.
 *
 * Please note:
 * Some common codepoints do not have a name (e.g. C0 control characters like \n)
 *
 * Also see:
 * - unicodeReadableName(char) - Displays correct name or an applicable alias
 *
 * @param char Single character string or codepoint
 * @returns Corrected name of character or undefined
 */
export function unicodeCorrectName(char: string | number): string | undefined {
    char = codepointToChar(char)

    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    const allCorrections = ALIASES[char]?.correction
    const correction =
        allCorrections && allCorrections[allCorrections.length - 1]
    if (correction) {
        return correction
    }

    return unicodeBaseName(char)
}

/**
 * Returns the aliases that have been assigned to a Unicode codepoint.
 *
 * Aliases can be of these categories (multiple aliases possible):
 *
 * - correction
 * - control
 * - figment
 * - alternate
 * - abbreviation
 *
 * @param char Single character string or codepoint
 * @returns Object containing aliases for this Unicode codepoint
 */
export function unicodeAliases(char: string | number): AliasMap | undefined {
    char = codepointToChar(char)

    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    return ALIASES[char]
}

/**
 * Determine the basic type of codepoints. Required to be able to get the
 * Unicode label of a codepoint. This can be one of:
 *
 * - Graphic
 * - Format
 * - Control
 * - Private-use
 * - Surrogate
 * - Noncharacter
 * - Reserved
 *
 * @param char Single character string or codepoint
 * @returns Codepoint type
 */
export function unicodeType(char: string | number): string | undefined {
    char = codepointToChar(char)

    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    let codepoint_depth_offset = char.codePointAt(0)
    if (codepoint_depth_offset === undefined) return undefined

    type UnicodeTypeArray = (number | UnicodeTypeArray)[]
    let index_or_value: UnicodeTypeArray | number = TYPES as UnicodeTypeArray
    for (const depth of OFFSETS) {
        if (Array.isArray(index_or_value)) {
            index_or_value =
                index_or_value[Math.floor(codepoint_depth_offset / depth)]
        } else {
            // This case should ideally not be reached if TYPES and OFFSETS are correctly structured
            // but as a fallback, we'll return undefined or handle it as an error.
            return undefined
        }
        codepoint_depth_offset = codepoint_depth_offset % depth
        if (!Array.isArray(index_or_value)) {
            if (typeof index_or_value === "number") {
                return TYPE_NAMES[index_or_value]
            } else {
                return undefined
            }
        }
    }
    if (Array.isArray(index_or_value)) {
        const finalIndex = index_or_value[codepoint_depth_offset]
        if (typeof finalIndex === "number") {
            return TYPE_NAMES[finalIndex]
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

/**
 * Returns a label of a codepoint in the following format:
 * <type-hex>, e.g. <control-0009> for the tab character or
 * <noncharacter-FFFFF> for U+FFFFF
 *
 * It is only assigned to codepoints of a type other than
 * "Graphic" or "Format"
 *
 * @param char Single character string or codepoint
 * @returns A generic label for this codepoint
 */
export function unicodeLabel(char: string | number): string | undefined {
    char = codepointToChar(char)

    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    } else if ([...char][1]) {
        return undefined
    }

    const charType = unicodeType(char)
    if (charType === "Graphic" || charType === "Format") {
        return undefined
    }

    const codepoint = char.codePointAt(0)
    if (codepoint === undefined) return undefined

    return `<${charType?.toLowerCase()}-${codepointHex(codepoint)}>`
}

/**
 * Returns the best readable representation of a codepoint.
 *
 * 1) It is the corrected name of a the codepoint (if one exists)
 * 2) or it is an appropriate aliase (if one exists)
 * 3) or it is the codepoint label
 *
 * @param char Single character string or codepoint
 * @returns Unicode name, alias, or label for this character
 */
export function unicodeReadableName(char: string | number): string | undefined {
    const correctName = unicodeCorrectName(char)
    if (correctName) {
        return correctName
    }

    const aliases = unicodeAliases(char)
    if (aliases) {
        return (
            (aliases.control && aliases.control[0]) ||
            (aliases.figment && aliases.figment[0]) ||
            (aliases.alternate && aliases.alternate[0]) ||
            (aliases.abbreviation && aliases.abbreviation[0])
        )
    }

    return unicodeLabel(char)
}

/**
 * Returns the name of a character that is made of a codepoint sequence (= more than
 * one codepoint involved), if one exists.
 *
 * @param char Single character string made of multiple codepoints
 * @returns Unicode sequence name
 */
export function unicodeSequenceName(char: string): string | undefined {
    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    const res = SEQUENCES[char]
    if (res) {
        return insertWords(res, SEQUENCES_WORDS, SEQUENCES_REPLACE_BASE)
    } else {
        const fqe = EMOJI_NOT_QUALIFIED[char]
        if (fqe) {
            return insertWords(
                SEQUENCES[fqe],
                SEQUENCES_WORDS,
                SEQUENCES_REPLACE_BASE
            )
        }
    }

    return undefined
}

/**
 * Returns the name of a character that is made of a codepoint sequence (= more than
 * one codepoint involved), if one exists.
 *
 * Differently from unicodeSequenceName(char), it will only consider Emoji ZWJ sequences
 * that are fully qualified, meaning they all required variation selectors (VS16) in place
 *
 * @param char Single character string made of multiple codepoints
 * @returns Unicode sequence name
 */
export function unicodeQualifiedSequenceName(char: string): string | undefined {
    if (
        (typeof char !== "string" && !(typeof char === "object")) ||
        char === ""
    ) {
        return undefined
    }

    const res = SEQUENCES[char]
    if (res === undefined) {
        return undefined
    }

    return insertWords(res, SEQUENCES_WORDS, SEQUENCES_REPLACE_BASE)
}

/**
 * Returns the best name for the Unicode character (codepoint or codepoint sequence).
 *
 * At first, it will check if the codepoint sequence has a name, e.g. for
 * Emoji that are build up using multiple codepoints using unicodeSequenceName(char)
 *
 * If none is found, will use the unicodeReadableName(char) function to retrieve
 * the best name for that codepoint.
 *
 * @param char Single character string or codepoint
 * @returns Name of character
 */
export default function unicodeName(char: string | number): string | undefined {
    return unicodeSequenceName(char as string) || unicodeReadableName(char)
}
