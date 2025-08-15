// Character Information Interface
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
    // Additional properties from original interface
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

// View Mode Type
export type ViewMode = "grid" | "list"

// Character Mode Type
export type CharacterMode =
    | "all"
    | "emoji"
    | "letters"
    | "numbers"
    | "symbols"
    | "punctuation"
    | "other"

// Font Option Type
export type FontOption = {
    value: string
    label: string
    className: string
}

// External Link Interface
export interface ExternalLink {
    name: string
    url: string
}
