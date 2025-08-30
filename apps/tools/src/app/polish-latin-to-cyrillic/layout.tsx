import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
    title: "Polish Latin to Cyrillic",
    description: "convert polish latin to cyrillic",
    openGraph: {
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
        type: "website",
        url: "https://tools.morsz.dev/polish-latin-to-cyrillic",
    },
    twitter: {
        card: "summary_large_image",
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
    },
}

export const viewport: Viewport = {
    themeColor: "#93c5fd",
}

export default function PolishLatinToCyrillicLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
