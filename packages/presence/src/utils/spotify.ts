export function extractSpotifyTrackId(
    largeImage: string | null
): string | null {
    if (!largeImage) return null

    // spotify assets use format `spotify:{track_id}`
    if (largeImage.startsWith("spotify:")) {
        return largeImage.replace("spotify:", "")
    }

    return null
}

export function getSpotifyTrackUrl(trackId: string): string {
    return `https://open.spotify.com/track/${trackId}`
}

export function getSpotifyAlbumCoverUrl(
    largeImage: string | null
): string | null {
    if (!largeImage) return null

    // spotify's cdn
    if (largeImage.startsWith("spotify:")) {
        return `https://i.scdn.co/image/${largeImage.replace("spotify:", "")}`
    }

    return null
}

export function formatDuration(durationMs: number): string {
    const totalSeconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function calculateSpotifyProgress(
    startTime: number,
    duration: number,
    currentTime: number = Date.now()
): number {
    const elapsed = currentTime - startTime
    const progress = (elapsed / duration) * 100
    return Math.min(Math.max(progress, 0), 100)
}
