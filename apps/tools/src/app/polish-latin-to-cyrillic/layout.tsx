import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import logo from "@/assets/logo.png"
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
                url: logo.src,
                width: logo.width,
                height: logo.height,
                alt: `${SITE_CONFIG.SITE_NAME} logo`,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
        images: [logo.src],
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
