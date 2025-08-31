import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Password Strength Checker",
    description: "check a password's strength using data from HiveSystems.",
    openGraph: {
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
        type: "website",
        url: getToolUrl(SITE_CONFIG.TOOLS.PASSWORD_CHECKER),
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
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
        images: [SITE_CONFIG.LOGO.src],
    },
}

const PasswordCheckerLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default PasswordCheckerLayout
