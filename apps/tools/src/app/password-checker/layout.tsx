import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import logo from "@/assets/logo.png"
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
                url: logo.src,
                width: logo.width,
                height: logo.height,
                alt: `${SITE_CONFIG.SITE_NAME} logo`,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: "Password Strength Checker",
        description: "check a password's strength using data from HiveSystems.",
        images: [logo.src],
    },
}

const PasswordCheckerLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default PasswordCheckerLayout
