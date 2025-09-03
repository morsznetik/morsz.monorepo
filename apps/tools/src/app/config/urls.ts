import logo from "@/assets/logo.png"

export const SITE_CONFIG = {
    DOMAIN: "https://morsz-monorepo-tools.vercel.app",

    SITE_NAME: "tools.morsz.dev",

    LOGO: {
        src: logo.src,
        width: logo.width,
        height: logo.height,
        alt: "tools.morsz.dev logo",
    },

    TOOLS: {
        PASSWORD_CHECKER: "/password-checker",
        UNICODE: "/unicode",
        POLISH_LATIN_TO_CYRILLIC: "/polish-latin-to-cyrillic",
        COUNTDOWN_TIMER: "/countdown-timer",
    },
} as const

export const getToolUrl = (toolPath: string): string => {
    return `${SITE_CONFIG.DOMAIN}${toolPath}`
}

export const getMetadataBase = (): URL => {
    return new URL(SITE_CONFIG.DOMAIN)
}
