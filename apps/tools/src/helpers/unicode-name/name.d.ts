interface CodepointRanges {
    [prefix: string]: [number, number][]
}

interface JamoData {
    INITIAL: string[]
    MEDIAL: string[]
    FINAL: string[]
}

declare const UNICODE_DATA_NAME: {
    NAMES: Record<string, string>
    ALIASES: Record<
        string,
        {
            correction?: string[]
            control?: string[]
            figment?: string[]
            alternate?: string[]
            abbreviation?: string[]
        }
    >
    CP_RANGES: CodepointRanges
    JAMO: JamoData
    COMMON_WORDS: string[]
    REPLACE_BASE: number
}

export default UNICODE_DATA_NAME
