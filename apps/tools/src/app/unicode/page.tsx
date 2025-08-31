import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import UnicodeInspector from "@/app/unicode/page.client"
import GraphemeSplitter from "grapheme-splitter"
import type { Metadata } from "next"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
    const hex = (await searchParams).hex

    if (hex && typeof hex === "string") {
        const decodedInput = hex
            .split("-")
            .filter(Boolean)
            .map((h: string) => {
                const cp = parseInt(h, 16)
                if (Number.isNaN(cp)) return ""
                return String.fromCodePoint(cp)
            })
            .join("")

        if (decodedInput) {
            const graphemeSplitter = new GraphemeSplitter()
            const graphemes = graphemeSplitter.splitGraphemes(decodedInput)
            const characterCount = graphemes.length

            const decodedInputTruncated =
                graphemes.length > 8
                    ? graphemes.slice(0, 8).join("") + "..."
                    : decodedInput
            const byteSize = new TextEncoder().encode(decodedInput).length

            return {
                title: `Unicode Inspector`,
                description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} - ${byteSize} bytes.`,
                openGraph: {
                    title: `Unicode Inspector - ${decodedInputTruncated}`,
                    description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} - ${byteSize} bytes.`,
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
                    title: `Unicode Inspector - ${decodedInputTruncated}`,
                    description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} - ${byteSize} bytes.`,
                    images: [SITE_CONFIG.LOGO.src],
                },
            }
        }
    }

    // default
    return {
        title: "Unicode Inspector",
        description:
            "Inspect Unicode characters, names, code points, categories, blocks, byte sizes, etc.",
        openGraph: {
            title: "Unicode Inspector",
            description:
                "Inspect Unicode characters, names, code points, categories, blocks, byte sizes, etc.",
            type: "website",
            url: getToolUrl(SITE_CONFIG.TOOLS.UNICODE),
            images: [
                {
                    url: SITE_CONFIG.LOGO.src,
                    width: SITE_CONFIG.LOGO.width,
                    height: SITE_CONFIG.LOGO.height,
                },
            ],
        },
        twitter: {
            card: "summary",
            title: "Unicode Inspector",
            description:
                "Inspect Unicode characters, names, code points, categories, blocks, byte sizes, etc.",
            images: [SITE_CONFIG.LOGO.src],
        },
    }
}

export default UnicodeInspector
