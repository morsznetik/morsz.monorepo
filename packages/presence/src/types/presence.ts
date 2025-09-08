export type PresenceStatus = "online" | "idle" | "dnd" | "offline"

// https://discord.com/developers/docs/events/gateway-events#activity-object-activity-flags
export enum ActivityFlags {
    INSTANCE = 1 << 0, // 1
    JOIN = 1 << 1, // 2
    SPECTATE = 1 << 2, // 4
    JOIN_REQUEST = 1 << 3, // 8
    SYNC = 1 << 4, // 16
    PLAY = 1 << 5, // 32
    PARTY_PRIVACY_FRIENDS = 1 << 6, // 64
    PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7, // 128
    EMBEDDED = 1 << 8, // 256
}

export interface PresenceUpdate {
    userId: string // User ID
    status: PresenceStatus // User's current status
    activities: Activity[] // List of activities the user is currently engaged in
    updatedAt: number // Timestamp when the presence was updated
}

export interface Emoji {
    name: string // name of the emoji
    id: string // snowflake; Asset ID of the emoji
    roles: string[] | null // Undocumented
    user: unknown | null // Undocumented
    require_colons: boolean // Undocumented, assuming it's whether it's a custom emoji
    managed: boolean // Undocumented
    animated: boolean // Whether the emoji is animated
    available: boolean // Undocumented
}

// snowflake: https://discord.com/developers/docs/reference#snowflakes
// Base activity properties shared by all activity types
interface BaseActivity {
    name: string // Name of the activity
    created_at: string // ISO timestamp of when the activity was added to the user's session
    timestamps?: {
        start?: number // ISO timestamp of when the activity started
        end?: number // ISO timestamp of when the activity ends
    }
    application_id?: string // snowflake; ID of the application associated with the activity;
    status_display_type?: (0 | 1 | 2) | null // 0: Name, 1: State, 2: Details https://discord.com/developers/docs/events/gateway-events#activity-object-status-display-types
    details?: string | null // Details about the activity
    details_url?: string | null // URL that is linked when clicking on the details text
    state?: string | null // User's current party status, or text used for a custom status
    emoji: Emoji // Emoji associated with the activity
    party?: {
        id?: string // ID of the party
        size?: [number, number] // [current, maximum]; Party's current and maximum size
    }
    assets?: {
        large_image?: string // Format: https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image
        large_text?: string // Text displayed when hovering over the large image of the activity
        large_text_url?: string // URL that is opened when clicking on the large image
        small_image?: string // Format: https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image
        small_text?: string // 	Text displayed when hovering over the small image of the activity
        small_text_url?: string // URL that is opened when clicking on the small image
    }
    secrets?: {
        join?: string // Secret for joining a party
        spectate?: string // Secret for spectating a game
        match?: string // Secret for a specific instanced match
    }
    instance?: boolean // Whether or not the activity is an instanced game session
    flags?: ActivityFlags // ActivityFlags ORd together, describes what the payload includes
    // buttons?: {  // TODO: Uncomment when Discord API supports buttons
    //     label: string // Text shown on the button (1-32 characters)
    //     url: string // URL opened when clicking the button (1-512 characters)
    // }[] // 2 buttons max
}

// Internal interface for Discord API track data (not exported)
interface SpotifyTrack {
    id: string
    name: string
    artists: Array<{
        name: string
        id: string
    }>
    album: {
        name: string
        images: Array<{
            url: string
            width: number
            height: number
        }>
    }
    external_urls: {
        spotify: string
    }
}

// Discriminated union for different activity types
// https://discord.com/developers/docs/events/gateway-events#activity-object-activity-structure
export type Activity =
    | PlayingActivity // type: 0
    | StreamingActivity // type: 1
    | ListeningActivity // type: 2
    | WatchingActivity // type: 3
    | StatusActivity // type: 4
    | CompetingActivity // type: 5

// 0: Playing
export interface PlayingActivity extends BaseActivity {
    type: 0
}

// 1: Streaming
export interface StreamingActivity extends BaseActivity {
    type: 1
}

// 2: Listening (Spotify, etc.)
export interface ListeningActivity extends BaseActivity {
    type: 2
    state: string // track artists separated by semicolons
    details: string // song name
    track?: SpotifyTrack // Track information (optional as Discord API may not always provide this)
    timestamps: {
        start: number
        end: number
    }
    party: {
        id: string
        size?: [number, number]
    }
    assets: {
        large_image: string
        large_text: string // album name
    }
    secrets: Record<string, never> // Empty
}

// 3: Watching
export interface WatchingActivity extends BaseActivity {
    type: 3
}

// 4: Status (Custom Status)
export interface StatusActivity extends BaseActivity {
    type: 4
    name: "Custom Status"
    state: string // Status text
    timestamps: {
        end?: number // ISO timestamp of when status expires
    }
    party: Record<string, never> // Empty
    assets: Record<string, never> // Empty
    secrets: Record<string, never> // Empty
}

// 5: Competing
export interface CompetingActivity extends BaseActivity {
    type: 5
}

export interface CustomStatus {
    status: string // Custom status text
    expiresAt?: number // When the status expires
    emoji?: Emoji
}

export interface SpotifyListening {
    artists: string[] // Array of artist names
    songName: string
    albumName: string
    albumCover: string
    trackUrl: string
    duration: number // Duration in milliseconds
    startTime: number // When playback started
    endTime?: number // When playback ends
}

export function parseCustomStatus(activity: StatusActivity): CustomStatus {
    return {
        status: activity.state,
        expiresAt: activity.timestamps.end,
        emoji: activity.emoji,
    }
}

export function parseSpotifyListening(
    activity: ListeningActivity
): SpotifyListening {
    return {
        artists: activity.state.split(";").map((a: string) => a.trim()),
        songName: activity.details,
        albumName: activity.assets.large_text,
        albumCover: activity.assets.large_image,
        trackUrl: activity.track?.external_urls.spotify || "",
        duration: activity.timestamps.end - activity.timestamps.start,
        startTime: activity.timestamps.start,
        endTime: activity.timestamps.end,
    }
}

export function parseStreamingActivity(
    activity: StreamingActivity
): StreamingActivity {
    return activity
}

export function parseWatchingActivity(
    activity: WatchingActivity
): WatchingActivity {
    return activity
}

export function parseCompetingActivity(
    activity: CompetingActivity
): CompetingActivity {
    return activity
}

// Union type for all parsed activity types
export type ParsedActivity =
    | CustomStatus
    | SpotifyListening
    | PlayingActivity
    | StreamingActivity
    | WatchingActivity
    | CompetingActivity

// Main parser function that handles all activity types
export function parseActivity(activity: Activity): ParsedActivity | null {
    switch (activity.type) {
        case 0: // Playing
            return activity as PlayingActivity

        case 1: // Streaming
            try {
                const result = parseStreamingActivity(
                    activity as StreamingActivity
                )
                return result
            } catch (error) {
                console.error(
                    "Failed to parse streaming activity:",
                    error,
                    activity
                )
                return null
            }

        case 2: // Listening (Spotify)
            try {
                const result = parseSpotifyListening(
                    activity as ListeningActivity
                )
                return result
            } catch (error) {
                console.error(
                    "Failed to parse Spotify activity:",
                    error,
                    activity
                )
                return null
            }

        case 3: // Watching
            try {
                const result = parseWatchingActivity(
                    activity as WatchingActivity
                )
                return result
            } catch (error) {
                console.error(
                    "Failed to parse watching activity:",
                    error,
                    activity
                )
                return null
            }

        case 4: // Custom Status
            try {
                const result = parseCustomStatus(activity as StatusActivity)
                return result
            } catch (error) {
                console.error("Failed to parse custom status:", error, activity)
                return null
            }

        case 5: // Competing
            try {
                const result = parseCompetingActivity(
                    activity as CompetingActivity
                )
                return result
            } catch (error) {
                console.error(
                    "Failed to parse competing activity:",
                    error,
                    activity
                )
                return null
            }

        default:
            console.log(
                "Unknown activity type:",
                (activity as { type: number }).type
            )
            return null
    }
}

export interface ReadyMessage {
    type: "ready"
}

export interface PingMessage {
    type: "ping"
}

export interface PongMessage {
    type: "pong"
}

export interface PresenceUpdateMessage {
    type: "presence_update"
    userId: string
    status: PresenceStatus
    activities: Activity[]
    updatedAt: number
}

export interface GoodbyeMessage {
    type: "goodbye"
}

export type WebSocketMessage =
    | ReadyMessage
    | PingMessage
    | PongMessage
    | PresenceUpdateMessage
    | GoodbyeMessage
