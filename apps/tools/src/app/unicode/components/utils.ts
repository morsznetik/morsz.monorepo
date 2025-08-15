import { ExternalLink } from "./types"
import unicodeBlocks from "@/helpers/unicode-name/blocks-categories"
import unicodeProperties from "unicode-properties"

/**
 * Get external links for a Unicode character based on its code point
 */
export const getExternalLinksForChar = (codePoint: number): ExternalLink[] => {
    if (!codePoint || isNaN(codePoint)) return []

    const hexCodePoint = codePoint.toString(16).toUpperCase().padStart(4, "0")
    return [
        {
            name: "Fileformat.info",
            url: `https://www.fileformat.info/info/unicode/char/${hexCodePoint}/index.htm`,
        },
        {
            name: "Compart",
            url: `https://www.compart.com/en/unicode/U+${hexCodePoint}`,
        },
        {
            name: "Decodeunicode",
            url: `https://www.decodeunicode.org/en/u+${hexCodePoint}`,
        },
    ]
}

/**
 * Check if a character is an emoji
 */
export const isEmojiCharacter = (char: string): boolean => {
    if (!char) return false

    // Get the code point of the character
    const codePoint = char.codePointAt(0)
    if (!codePoint) return false

    // Emoji ranges
    return (
        // Basic emoji
        (codePoint >= 0x1f600 && codePoint <= 0x1f64f) ||
        // Supplemental Symbols and Pictographs
        (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) ||
        // Emoticons
        (codePoint >= 0x1f600 && codePoint <= 0x1f64f) ||
        // Transport and Map Symbols
        (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) ||
        // Miscellaneous Symbols and Pictographs
        (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) ||
        // Flags
        (codePoint >= 0x1f100 && codePoint <= 0x1f1ff) ||
        // Misc Technical
        (codePoint >= 0x2300 && codePoint <= 0x23ff) ||
        // Geometric Shapes
        (codePoint >= 0x25a0 && codePoint <= 0x25ff) ||
        // Misc Symbols
        (codePoint >= 0x2600 && codePoint <= 0x26ff) ||
        // Dingbats
        (codePoint >= 0x2700 && codePoint <= 0x27bf)
    )
}

/**
 * Get the Unicode category for a code point
 */
export const getUnicodeCategory = (codePoint: number): string | null => {
    try {
        const category = unicodeProperties.getCategory(codePoint)
        const categoryMap: Record<string, string> = {
            Lu: "Uppercase Letter",
            Ll: "Lowercase Letter",
            Lt: "Titlecase Letter",
            Lm: "Modifier Letter",
            Lo: "Other Letter",
            Mn: "Nonspacing Mark",
            Mc: "Spacing Mark",
            Me: "Enclosing Mark",
            Nd: "Decimal Number",
            Nl: "Letter Number",
            No: "Other Number",
            Pc: "Connector Punctuation",
            Pd: "Dash Punctuation",
            Ps: "Open Punctuation",
            Pe: "Close Punctuation",
            Pi: "Initial Punctuation",
            Pf: "Final Punctuation",
            Po: "Other Punctuation",
            Sm: "Math Symbol",
            Sc: "Currency Symbol",
            Sk: "Modifier Symbol",
            So: "Other Symbol",
            Zs: "Space Separator",
            Zl: "Line Separator",
            Zp: "Paragraph Separator",
            Cc: "Control",
            Cf: "Format",
            Cs: "Surrogate",
            Co: "Private Use",
            Cn: "Unassigned",
        }
        if (categoryMap[category]) {
            return `${categoryMap[category]} (${category})`
        }
        return category ? `${category} (${category})` : "Unknown Category"
    } catch {
        return "Unknown Category"
    }
}

/**
 * Get the Unicode block for a code point
 */
export const getUnicodeBlock = (codePoint: number): string | null => {
    try {
        for (const [blockName, range] of Object.entries(unicodeBlocks)) {
            const [start, end] = range.split("..").map(hex => parseInt(hex, 16))
            if (codePoint >= start && codePoint <= end) {
                return blockName
            }
        }
        return "Unknown Block"
    } catch {
        return "Unknown Block"
    }
}

export const toUtf16 = (codePoint: number): string[] => {
    if (codePoint > 0xffff) {
        return [
            (Math.floor((codePoint - 0x10000) / 0x400) + 0xd800)
                .toString(16)
                .toUpperCase()
                .padStart(4, "0"), // low
            (((codePoint - 0x10000) % 0x400) + 0xdc00)
                .toString(16)
                .toUpperCase()
                .padStart(4, "0"), // high
        ]
    } else {
        return [codePoint.toString(16).toUpperCase().padStart(4, "0")]
    }
}
