import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Countdown Timer",
    description:
        "Create shareable countdown timers with encoded URLs. Set a date and time to generate a unique link that anyone can use to see the countdown.",
    openGraph: {
        title: "Countdown Timer",
        description:
            "Create shareable countdown timers with encoded URLs. Set a date and time to generate a unique link that anyone can use to see the countdown.",
        type: "website",
        url: getToolUrl(SITE_CONFIG.TOOLS.COUNTDOWN_TIMER),
        images: [
            {
                url: SITE_CONFIG.LOGO.src,
                width: SITE_CONFIG.LOGO.width,
                height: SITE_CONFIG.LOGO.height,
                alt: SITE_CONFIG.LOGO.alt,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Countdown Timer",
        description:
            "Create shareable countdown timers with encoded URLs. Set a date and time to generate a unique link that anyone can use to see the countdown.",
        images: [SITE_CONFIG.LOGO.src],
    },
}

const CountdownTimerLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default CountdownTimerLayout
