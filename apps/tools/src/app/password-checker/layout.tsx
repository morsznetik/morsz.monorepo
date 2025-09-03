import { createToolMetadata } from "@/app/config/metadata"
import { SITE_CONFIG } from "@/app/config/urls"
import type { Metadata } from "next"

export const metadata: Metadata = createToolMetadata(
    "Password Strength Checker",
    "check a password's strength using data from HiveSystems.",
    SITE_CONFIG.TOOLS.PASSWORD_CHECKER
)

const PasswordCheckerLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default PasswordCheckerLayout
