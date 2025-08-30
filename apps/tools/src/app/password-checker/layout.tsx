import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Password Strength Checker",
    description: "check a password's strength using data from HiveSystems",
}

export default function PasswordCheckerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
