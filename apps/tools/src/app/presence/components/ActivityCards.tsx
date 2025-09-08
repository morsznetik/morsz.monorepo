import { ActivityCard } from "@/app/presence/components/ActivityCard"
import {
    ActivityBadges,
    ActivityIcon,
    BaseActivityCard,
    type BaseActivityCardProps,
} from "@/app/presence/components/BaseActivityCard"
import type {
    CompetingActivity,
    CustomStatus,
    PlayingActivity,
    SpotifyListening,
    StreamingActivity,
    WatchingActivity,
} from "@morsz/presence/types"
import { getEmojiUrl } from "@morsz/presence/utils/assets"
import { getSpotifyAlbumCoverUrl } from "@morsz/presence/utils/spotify"
import { cn } from "@morsz/ui/utils"
import { Eye, MessageSquare, Music, Play, Radio, Trophy } from "lucide-react"

import { memo, useEffect, useState } from "react"

type ActivityCardProps = Omit<BaseActivityCardProps, "title" | "icon">

interface GameActivityCardProps extends ActivityCardProps {
    game: PlayingActivity
}

interface StreamingActivityCardProps extends ActivityCardProps {
    streaming: StreamingActivity
}

interface WatchingActivityCardProps extends ActivityCardProps {
    watching: WatchingActivity
}

interface CompetingActivityCardProps extends ActivityCardProps {
    competing: CompetingActivity
}

interface SpotifyActivityCardProps extends ActivityCardProps {
    spotify: SpotifyListening
}

interface CustomStatusCardProps extends ActivityCardProps {
    status: CustomStatus
}

export const GameActivityCard = memo<GameActivityCardProps>(
    ({ game, ...props }: GameActivityCardProps) => {
        return (
            <ActivityCard
                activity={game}
                title="Game Activity"
                icon={Play}
                {...props}
            />
        )
    }
)
GameActivityCard.displayName = "GameActivityCard"

export const StreamingActivityCard = memo<StreamingActivityCardProps>(
    ({ streaming, ...props }: StreamingActivityCardProps) => {
        return (
            <ActivityCard
                activity={streaming}
                title="Streaming Activity"
                icon={Radio}
                showDetailsUrl={true}
                {...props}
            />
        )
    }
)
StreamingActivityCard.displayName = "StreamingActivityCard"

export const WatchingActivityCard = memo<WatchingActivityCardProps>(
    ({ watching, ...props }: WatchingActivityCardProps) => {
        return (
            <ActivityCard
                activity={watching}
                title="Watching Activity"
                icon={Eye}
                {...props}
            />
        )
    }
)
WatchingActivityCard.displayName = "WatchingActivityCard"

export const CompetingActivityCard = memo<CompetingActivityCardProps>(
    ({ competing, ...props }: CompetingActivityCardProps) => {
        return (
            <ActivityCard
                activity={competing}
                title="Competing Activity"
                icon={Trophy}
                {...props}
            />
        )
    }
)
CompetingActivityCard.displayName = "CompetingActivityCard"

export const SpotifyActivityCard = memo<SpotifyActivityCardProps>(
    ({ spotify, ...props }: SpotifyActivityCardProps) => {
        const [progress, setProgress] = useState(0)
        const [currentTime, setCurrentTime] = useState(Date.now())

        useEffect(() => {
            const updateProgress = () => {
                const now = Date.now()
                setCurrentTime(now)

                if (spotify.duration > 0) {
                    const elapsed = now - spotify.startTime
                    const progressPercent = Math.min(
                        (elapsed / spotify.duration) * 100,
                        100
                    )
                    setProgress(progressPercent)
                }
            }

            updateProgress()
            const interval = setInterval(updateProgress, 1000)

            return () => clearInterval(interval)
        }, [spotify.duration, spotify.startTime])

        const formatDuration = (ms: number) => {
            const minutes = Math.floor(ms / 60000)
            const seconds = Math.floor((ms % 60000) / 1000)
            return `${minutes}:${seconds.toString().padStart(2, "0")}`
        }

        const formatElapsedTime = (startTime: number) => {
            const elapsed = currentTime - startTime
            const minutes = Math.floor(elapsed / 60000)
            const seconds = Math.floor((elapsed % 60000) / 1000)
            return `${minutes}:${seconds.toString().padStart(2, "0")}`
        }

        const badges = [
            {
                text: formatDuration(spotify.duration),
                variant: "secondary" as const,
            },
            {
                text: `Started ${new Date(spotify.startTime).toLocaleTimeString()}`,
                variant: "outline" as const,
            },
        ]

        return (
            <BaseActivityCard title="Spotify Activity" icon={Music} {...props}>
                <div className="flex-1 flex flex-col justify-between">
                    {/* album art and song info */}
                    <div className="flex gap-4 items-center">
                        <div className="flex-shrink-0">
                            <ActivityIcon
                                src={getSpotifyAlbumCoverUrl(
                                    spotify.albumCover
                                )}
                                alt={`${spotify.albumName} album cover`}
                                fallbackIcon={Music}
                                size="md"
                            />
                        </div>

                        {/* song details */}
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="font-bold text-lg leading-tight">
                                {spotify.songName}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                by {spotify.artists.join(", ")}
                            </div>
                            <div className="text-muted-foreground text-xs">
                                on {spotify.albumName}
                            </div>
                        </div>
                    </div>

                    {/* progress bar */}
                    <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                            <span>{formatElapsedTime(spotify.startTime)}</span>
                            <span>{formatDuration(spotify.duration)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <ActivityBadges badges={badges} />
                    </div>
                </div>
            </BaseActivityCard>
        )
    }
)
SpotifyActivityCard.displayName = "SpotifyActivityCard"

export const CustomStatusCard = memo<CustomStatusCardProps>(
    ({ status, ...props }: CustomStatusCardProps) => {
        const badges = []

        if (status.expiresAt) {
            badges.push({
                text: `Expires ${new Date(status.expiresAt).toLocaleString()}`,
                variant: "outline" as const,
            })
        }

        const emojiUrl = getEmojiUrl(
            status.emoji?.id || "",
            status.emoji?.animated || false
        )

        return (
            <BaseActivityCard
                title="Custom Status"
                icon={MessageSquare}
                {...props}
            >
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <div className="text-xl font-bold leading-tight mb-4">
                        {emojiUrl && (
                            <img
                                src={emojiUrl}
                                alt={status.emoji?.name}
                                width={status.status ? 24 : 96}
                                height={status.status ? 24 : 96}
                                className={cn(
                                    "inline-block",
                                    status.status ? "w-6 h-6 mr-2" : "w-24 h-24"
                                )}
                            />
                        )}
                        {status.status}
                    </div>
                    <ActivityBadges badges={badges} />
                </div>
            </BaseActivityCard>
        )
    }
)
CustomStatusCard.displayName = "CustomStatusCard"
