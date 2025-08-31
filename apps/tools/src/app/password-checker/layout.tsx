import type { Metadata } from "next"

import type { ReactNode } from "react"

export const metadata: Metadata = {
    title: "Password Strength Checker",
    description: "check a password's strength using data from HiveSystems.",
    openGraph: {
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
        type: "website",
        url: "https://tools.morsz.dev/password-checker",
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
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
        images: ["/assets/logo.png"],
    },
}

export default function PasswordCheckerLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
