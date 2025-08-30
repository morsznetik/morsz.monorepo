export interface CharacterInfo {
    char: string
    codePoint: number
    hexCodePoint: string
    name: string | null
    category: string | null
    block: string | null
    byteSize?: number
    allCodePoints?: number[]
    allHexCodePoints?: string[]
    isEmoji?: boolean
    
    // legacy/old properties
    script?: string
    bidiClass?: string
    combiningClass?: string
    mirrored?: boolean
    eastAsianWidth?: string
    generalCategory?: string
    decompositionType?: string
    numericType?: string
    numericValue?: string
    isEmojiModifier?: boolean
    isEmojiComponent?: boolean
    isEmojiModifierBase?: boolean
    isEmojiPresentation?: boolean
    isRgi?: boolean
}

export type ViewMode = "grid" | "list"
export type CharacterMode =
    | "all"
    | "emoji"
    | "letters"
    | "numbers"
    | "symbols"
    | "punctuation"
    | "other"

export type FontOption = {
    value: string
    label: string
    className: string
}

export interface ExternalLink {
    name: string
    url: string
}
