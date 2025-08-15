import "./globals.css"
import Providers from "@/app/providers"
import Navbar from "@morsz/ui/special/navbar"
import ThemeScriptHack from "@morsz/ui/special/theme-script"

// since we already set the rel attribute in the assetsConfig, we need to omit it from the Asset interface
interface Asset extends Omit<React.LinkHTMLAttributes<HTMLLinkElement>, "rel"> {
    href: string
    type: string
    as: string
}

interface AssetsConfig {
    preload: Asset[]
    prefetch: Asset[]
}

const assets: AssetsConfig = {
    preload: [
        {
            href: "/fonts/ZxProto/ZxProto-Regular.ttf",
            type: "font/ttf",
            as: "font",
        },
        {
            href: "/fonts/ZxProto/ZxProto-Bold.ttf",
            type: "font/ttf",
            as: "font",
        },
    ],
    prefetch: [
        {
            href: "/fonts/ZxProto/ZxProto-Italic.ttf",
            type: "font/ttf",
            as: "font",
        },
        {
            href: "/fonts/Obviously/Obviously-Bold.otf",
            type: "font/otf",
            as: "font",
        },
        {
            href: "/fonts/Obviously/ObviouslyWide-Black.otf",
            type: "font/otf",
            as: "font",
        },
    ],
}

// rel prop type as a keyof AssetsConfig to have intellisense
const renderAssetsLinks = (assets: Asset[], rel: keyof AssetsConfig) =>
    assets.map(asset => (
        <link key={asset.href} rel={rel} crossOrigin="anonymous" {...asset} />
    ))

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* see theme-script.tsx for more info */}
                <ThemeScriptHack />

                {/* preload assets */}
                {renderAssetsLinks(assets.preload, "preload")}
                {/* prefetch assets, less essential */}
                {renderAssetsLinks(assets.prefetch, "prefetch")}
            </head>
            <body className="transition-theme">
                <Providers>
                    <Navbar />
                    {/* main content, paddings for the navbar */}
                    <main className="pl-0 pb-24 sm:pb-0 sm:pl-24">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
