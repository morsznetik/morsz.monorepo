import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Polish Latin to Cyrillic",
    description: "convert polish latin to cyrillic",
}

export default function PolishLatinToCyrillicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
