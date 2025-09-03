import { createToolMetadata } from "@/app/config/metadata"
import { SITE_CONFIG } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = createToolMetadata(
    "Countdown Timer",
    "Create shareable countdown timers with encoded URLs for any date and time",
    SITE_CONFIG.TOOLS.COUNTDOWN
)

export default function CountdownLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
