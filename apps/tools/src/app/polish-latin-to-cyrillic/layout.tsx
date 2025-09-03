import { createToolMetadata } from "@/app/config/metadata"
import { SITE_CONFIG } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = createToolMetadata(
    "Polish Latin to Cyrillic",
    "convert polish latin to cyrillic",
    SITE_CONFIG.TOOLS.POLISH_LATIN_TO_CYRILLIC
)

const PolishLatinToCyrillicLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return <>{children}</>
}

export default PolishLatinToCyrillicLayout
