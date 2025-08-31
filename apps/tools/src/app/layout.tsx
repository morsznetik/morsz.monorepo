import "./globals.css"
import { SITE_CONFIG, getMetadataBase } from "@/app/config/urls"
import Providers from "@/app/providers"
import logo from "@/assets/logo.png"
import "@morsz/tailwind-config"
import UICookieBanner from "@morsz/ui/special/cookie-banner"
import Navbar from "@morsz/ui/special/navbar"
import ThemeScriptHack from "@morsz/ui/special/theme-script"
import "@morsz/ui/styles"
import { ggSans, gnuUnifont, notoSans, zxProto } from "@morsz/ui/styles/fonts"
import type { Metadata, Viewport } from "next"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScriptHack />
            </head>
            <body
                className={`transition-colors transition-discrete ${zxProto.className} ${gnuUnifont.variable} ${ggSans.variable} ${notoSans.variable}`}
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

export const viewport: Viewport = {
    themeColor: "#93c5fd",
}

export const metadata: Metadata = {
    metadataBase: getMetadataBase(),
    title: {
        absolute: SITE_CONFIG.SITE_NAME,
        template: `%s | ${SITE_CONFIG.SITE_NAME}`,
    },
    description:
        "a collection of web based tools i built for myself or friends.",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_CONFIG.DOMAIN,
        siteName: SITE_CONFIG.SITE_NAME,
        title: SITE_CONFIG.SITE_NAME,
        description:
            "a collection of web based tools i built for myself or friends.",
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
        title: SITE_CONFIG.SITE_NAME,
        description:
            "a collection of web based tools i built for myself or friends.",
        images: [logo.src],
    },
}
