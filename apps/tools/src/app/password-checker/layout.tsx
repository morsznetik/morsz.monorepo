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
    },
    twitter: {
        card: "summary_large_image",
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
    },
}

export default function PasswordCheckerLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
