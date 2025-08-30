import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
    title: "Unicode Inspector",
    description:
        "inspect Unicode characters, names, code points, categories, blocks, byte sizes, and more.",
}

export default function UnicodeLayout({
    children,
}: {
    children: ReactNode
}) {
    return <>{children}</>
}
