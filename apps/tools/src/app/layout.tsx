import "./globals.css"
import "@morsz/tailwind-config"
import "@morsz/ui/styles"
import Providers from "@/app/providers"
import Navbar from "@morsz/ui/special/navbar"
import ThemeScriptHack from "@morsz/ui/special/theme-script"
import { zxProto } from "@morsz/ui/styles/fonts"
import CookieBanner from "@/app/cookie-banner"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScriptHack />
            </head>
            <body className={`transition-colors transition-discrete ${zxProto.className}`}>
                <Providers>
                    <Navbar />
                    <main className="pl-0 pb-24 sm:pb-0 sm:pl-24">
                        {children}
                    </main>
                    <CookieBanner />
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
