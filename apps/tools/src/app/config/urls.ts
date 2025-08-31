export const SITE_CONFIG = {
    DOMAIN: "https://tools.morsz.dev",

    SITE_NAME: "tools.morsz.dev",

    TOOLS: {
        PASSWORD_CHECKER: "/password-checker",
        UNICODE: "/unicode",
        POLISH_LATIN_TO_CYRILLIC: "/polish-latin-to-cyrillic",
    },
} as const

export const getToolUrl = (toolPath: string): string => {
    return `${SITE_CONFIG.DOMAIN}${toolPath}`
}

export const getMetadataBase = (): URL => {
    return new URL(SITE_CONFIG.DOMAIN)
}
