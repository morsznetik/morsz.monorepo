import type { Metadata } from "next"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
    const hex = searchParams.hex

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
            const decodedInputTruncated = `${decodedInput.substring(0, 8)}...`
            const characterCount = Array.from(decodedInput).length
            const byteSize = new TextEncoder().encode(decodedInput).length

            return {
                title: `Unicode Inspector`,
                description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} (${decodedInput}) - ${byteSize} bytes. View code points, names, categories, blocks, and more.`,
                openGraph: {
                    title: `Unicode Inspector - ${decodedInputTruncated}`,
                    description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} (${decodedInput}) - ${byteSize} bytes.`,
                },
                twitter: {
                    title: `Unicode Inspector - ${decodedInputTruncated}`,
                    description: `Inspect ${characterCount} Unicode character${characterCount !== 1 ? "s" : ""} (${decodedInput}) - ${byteSize} bytes.`,
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
            url: "https://tools.morsz.dev/unicode",
        },
        twitter: {
            title: "Unicode Inspector",
            description:
                "Inspect Unicode characters, names, code points, categories, blocks, byte sizes, etc.",
        },
    }
}
