import "./globals.css"
import Providers from "@/app/providers"
import "@morsz/tailwind-config"
import UICookieBanner from "@morsz/ui/special/cookie-banner"
import Navbar from "@morsz/ui/special/navbar"
import ThemeScriptHack from "@morsz/ui/special/theme-script"
import "@morsz/ui/styles"
import { zxProto } from "@morsz/ui/styles/fonts"
import type { Metadata } from "next"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScriptHack />
            </head>
            <body
                className={`transition-colors transition-discrete ${zxProto.className}`}
            >
                <Providers>
                    <Navbar />
                    <main className="pl-0 pb-24 sm:pb-0 sm:pl-24">
                        {children}
                    </main>
                    <UICookieBanner position="bottom-center" />
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout

export const metadata: Metadata = {
    metadataBase: new URL("https://tools.morsz.dev"),
    title: {
        default: "tools.morsz.dev",
        template: "%s | tools.morsz.dev",
    },
    description:
        "a collection of web based tools i built for myself or friends.",
}
