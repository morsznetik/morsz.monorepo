import "./globals.css"
import { SITE_CONFIG, getMetadataBase } from "@/app/config/urls"
import Providers from "@/app/providers"
import "@morsz/tailwind-config"
import UICookieBanner from "@morsz/ui/special/cookie-banner"
import Navbar from "@morsz/ui/special/navbar"
import ThemeScriptHack from "@morsz/ui/special/theme-script"
import VersionIndicator from "@morsz/ui/special/version-indicator"
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
                    <VersionIndicator
                        repo="morsznetik/morsz.monorepo"
                        app="tools"
                        currentCommitHash={
                            process.env.VERCEL_GIT_COMMIT_SHA // vercel env var
                        }
                        currentCommitMessage={
                            process.env.VERCEL_GIT_COMMIT_MESSAGE // vercel env var
                        }
                    />
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
                url: SITE_CONFIG.LOGO.src,
                width: SITE_CONFIG.LOGO.width,
                height: SITE_CONFIG.LOGO.height,
                alt: SITE_CONFIG.LOGO.alt,
            },
        ],
    },
    twitter: {
        card: "summary",
        title: SITE_CONFIG.SITE_NAME,
        description:
            "a collection of web based tools i built for myself or friends.",
        images: [SITE_CONFIG.LOGO.src],
    },
}
