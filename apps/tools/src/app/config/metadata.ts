import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import type { Metadata } from "next"

export interface MetadataOptions {
    title: string
    description: string
    toolPath?: string
    dynamicContent?: {
        title?: string
        description?: string
        image?: string
    }
}

export function createMetadata(options: MetadataOptions): Metadata {
    const { title, description, toolPath, dynamicContent } = options

    const baseTitle = dynamicContent?.title || title
    const baseDescription = dynamicContent?.description || description
    const baseUrl = toolPath ? getToolUrl(toolPath) : SITE_CONFIG.DOMAIN

    return {
        title: baseTitle, // follows template
        description: baseDescription,
        openGraph: {
            // need to manually make it follow template
            title: `${baseTitle} | ${SITE_CONFIG.SITE_NAME}`,
            description: baseDescription,
            type: "website",
            url: baseUrl,
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
            // need to manually make it follow template
            title: `${baseTitle} | ${SITE_CONFIG.SITE_NAME}`,
            description: baseDescription,
            images: [SITE_CONFIG.LOGO.src],
        },
    }
}

export function createToolMetadata(
    toolName: string,
    toolDescription: string,
    toolPath: string,
    dynamicContent?: {
        title?: string
        description?: string
        image?: string
    }
): Metadata {
    return createMetadata({
        title: toolName,
        description: toolDescription,
        toolPath,
        dynamicContent,
    })
}
