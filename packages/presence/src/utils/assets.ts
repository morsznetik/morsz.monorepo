import { Emoji } from "../types/presence"

export interface AvatarResponse {
    avatarUrl: string
}

export async function getAvatarUrl(userId: string): Promise<string> {
    try {
        const response = await fetch(
            `https://id-to-pfp.morsz.workers.dev/?userId=${userId}`
        )

        if (!response.ok) {
            throw new Error(
                `Failed to fetch avatar: ${response.status} ${response.statusText}`
            )
        }

        const data: AvatarResponse = await response.json()
        return data.avatarUrl
    } catch (error) {
        console.error("Error fetching avatar URL:", error)
        throw error
    }
}

export function getEmojiUrl(
    emojiId: string,
    animated: boolean = false
): string | null {
    if (!emojiId || emojiId.trim() === "") {
        return null
    }
    const extension = animated ? "gif" : "png"
    return `https://cdn.discordapp.com/emojis/${emojiId}.${extension}`
}

function extractEmojiId(emojiString: string): string {
    const match = emojiString.match(/<a?:(\w+):(\d+)>/)
    return match![2]!
}

export function isEmojiAnimated(emojiString: string): boolean {
    return emojiString.startsWith("<a:")
}

export function getEmojiUrlFromString(emojiString: string): string | null {
    const emojiId = extractEmojiId(emojiString)
    const animated = isEmojiAnimated(emojiString)
    return getEmojiUrl(emojiId, animated)
}

export function parseEmojiString(emojiString: string): Emoji | null {
    const emojiId = extractEmojiId(emojiString)
    const animated = isEmojiAnimated(emojiString)
    const match = emojiString.match(/<a?:\w+:(\d+)>/)?.[0]?.split(":")
    const name = match?.[1]

    if (!name) {
        return null
    }

    return {
        name,
        id: emojiId,
        roles: null,
        user: null,
        require_colons: false,
        managed: false,
        animated,
        available: false,
    }
}

export function getActivityAssetUrl(
    assetId: string,
    applicationId?: string
): string | null {
    if (!assetId) return null

    // media proxy images prefixed with mp:
    if (assetId.startsWith("mp:")) {
        const imageId = assetId.substring(3) // remove prefix
        return `https://media.discordapp.net/${imageId}`
    }

    // application assets snowflake IDs
    if (applicationId && /^\d+$/.test(assetId)) {
        return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`
    }

    // Spotify images prefixed with spotify:
    if (assetId.startsWith("spotify:")) {
        const spotifyId = assetId.substring(8) // remove prefix
        return `https://i.scdn.co/image/${spotifyId}`
    }

    // YouTube images prefixed with youtube:
    if (assetId.startsWith("youtube:")) {
        const youtubeId = assetId.substring(8) // remove prefix
        return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
    }

    // Twitch images prefixed with twitch:
    if (assetId.startsWith("twitch:")) {
        const twitchId = assetId.substring(7) // remove prefix
        return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${twitchId}-1920x1080.jpg`
    }

    // default fallback - assume it's a snowflake ID for application assets
    if (/^\d+$/.test(assetId)) {
        return `https://cdn.discordapp.com/app-assets/${applicationId || "unknown"}/${assetId}.png`
    }

    return null
}
