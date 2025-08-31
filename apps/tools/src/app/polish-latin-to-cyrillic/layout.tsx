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
        images: [
            {
                url: "/assets/logo.png",
                width: 1600,
                height: 1000,
                alt: "tools.morsz.dev logo",
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Polish Latin to Cyrillic",
        description: "convert polish latin to cyrillic",
        images: ["/assets/logo.png"],
    },
}

export default function PolishLatinToCyrillicLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
