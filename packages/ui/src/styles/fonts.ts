import { Noto_Sans } from "next/font/google"
import localFont from "next/font/local"

export const zxProto = localFont({
    src: [
        {
            path: "../fonts/ZxProto/ZxProto-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/ZxProto/ZxProto-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "../fonts/ZxProto/ZxProto-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-zxproto",
    display: "swap",
})

export const obviously = localFont({
    src: [
        {
            path: "../fonts/Obviously/Obviously-Bold.otf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/Obviously/ObviouslyWide-Black.otf",
            weight: "900",
            style: "normal",
        },
    ],
    variable: "--font-obviously",
    display: "swap",
})

export const gnuUnifont = localFont({
    src: "../fonts/GNUUnicode/unifont-16.0.03.otf",
    variable: "--font-gnu-unifont",
    display: "swap",
})

export const ggSans = localFont({
    src: "../fonts/ggSans/ggSansRegular.woff",
    variable: "--font-ggsans",
    display: "swap",
})

export const notoSans = Noto_Sans({
    subsets: ["latin"],
    variable: "--font-noto-sans",
    display: "swap",
})
