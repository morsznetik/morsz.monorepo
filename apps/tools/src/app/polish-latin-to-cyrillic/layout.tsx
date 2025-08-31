import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Polish Latin to Cyrillic",
    description: "convert polish latin to cyrillic",
    openGraph: {
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
        type: "website",
        url: getToolUrl(SITE_CONFIG.TOOLS.POLISH_LATIN_TO_CYRILLIC),
        images: [
            {
                url: SITE_CONFIG.LOGO.src,
                width: SITE_CONFIG.LOGO.width,
                height: SITE_CONFIG.LOGO.height,
                alt: SITE_CONFIG.LOGO.alt,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
        images: [SITE_CONFIG.LOGO.src],
    },
}

const PolishLatinToCyrillicLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <>{children}</>
}

export default PolishLatinToCyrillicLayout
