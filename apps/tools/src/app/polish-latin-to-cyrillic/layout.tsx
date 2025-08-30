import type { Metadata } from "next"

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

export default function PolishLatinToCyrillicLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
