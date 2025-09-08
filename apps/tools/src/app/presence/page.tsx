"use client"

import {
    CompetingActivityCard,
    CustomStatusCard,
    GameActivityCard,
    SpotifyActivityCard,
    StreamingActivityCard,
    WatchingActivityCard,
} from "@/app/presence/components/ActivityCards"
import { PresenceClient } from "@morsz/presence/client"
import type {
    CompetingActivity,
    CustomStatus,
    PlayingActivity,
    SpotifyListening,
    StreamingActivity,
    WatchingActivity,
} from "@morsz/presence/types"
import { Button } from "@morsz/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"
import {
    Activity as ActivityIcon,
    AlertCircle,
    Clock,
    Wifi,
    WifiOff,
} from "lucide-react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface ConnectionStatus {
    connected: boolean
    connecting: boolean
    error: string | null
    reconnectAttempts: number
}

// Cache management for presence data
const PRESENCE_CACHE_KEY = "presence_last_seen"

interface CachedPresenceData {
    spotify: SpotifyListening | null
    customStatus: CustomStatus | null
    games: PlayingActivity[]
    streamingOrWatching: StreamingActivity | WatchingActivity | null
    competing: CompetingActivity[]
    timestamp: number
}

function savePresenceToCache(data: {
    spotify: SpotifyListening | null
    customStatus: CustomStatus | null
    games: PlayingActivity[]
    streamingOrWatching: StreamingActivity | WatchingActivity | null
    competing: CompetingActivity[]
}): void {
    if (typeof window === "undefined") return

    const cacheData: CachedPresenceData = {
        ...data,
        timestamp: Date.now(),
    }

    try {
        localStorage.setItem(PRESENCE_CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
        console.warn("Failed to save presence cache:", error)
    }
}

function loadPresenceFromCache(): CachedPresenceData | null {
    if (typeof window === "undefined") return null

    try {
        const cached = localStorage.getItem(PRESENCE_CACHE_KEY)
        if (!cached) return null

        const parsed = JSON.parse(cached) as CachedPresenceData
        return parsed
    } catch (error) {
        console.warn("Failed to load presence cache:", error)
        return null
    }
}

function clearPresenceCache(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(PRESENCE_CACHE_KEY)
}

const PresenceTest = () => {
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
        connected: false,
        connecting: false,
        error: null,
        reconnectAttempts: 0,
    })
    const [currentSpotify, setCurrentSpotify] =
        useState<SpotifyListening | null>(null)
    const [currentCustomStatus, setCurrentCustomStatus] =
        useState<CustomStatus | null>(null)
    const [currentGames, setCurrentGames] = useState<PlayingActivity[]>([])
    const [currentStreamingOrWatching, setCurrentStreamingOrWatching] =
        useState<StreamingActivity | WatchingActivity | null>(null)
    const [currentCompeting, setCurrentCompeting] = useState<
        CompetingActivity[]
    >([])
    const [messageCount, setMessageCount] = useState(0)
    const [pingCount, setPingCount] = useState(0)
    const [lastPingTime, setLastPingTime] = useState<number | null>(null)
    const clientRef = useRef<PresenceClient | null>(null)

    // Load cached presence data on mount
    useEffect(() => {
        const cached = loadPresenceFromCache()
        if (cached) {
            setCurrentSpotify(cached.spotify)
            setCurrentCustomStatus(cached.customStatus)
            setCurrentGames(cached.games)
            setCurrentStreamingOrWatching(cached.streamingOrWatching)
            setCurrentCompeting(cached.competing || [])
        }
    }, [])

    // Update cache whenever presence data changes
    useEffect(() => {
        savePresenceToCache({
            spotify: currentSpotify,
            customStatus: currentCustomStatus,
            games: currentGames,
            streamingOrWatching: currentStreamingOrWatching,
            competing: currentCompeting,
        })
    }, [
        currentSpotify,
        currentCustomStatus,
        currentGames,
        currentStreamingOrWatching,
        currentCompeting,
    ])

    // Initialize client
    useEffect(() => {
        const presenceClient = new PresenceClient({
            autoReconnect: false,
        })

        // Set up event listeners
        presenceClient.on("connected", () => {
            setConnectionStatus(prev => ({
                ...prev,
                connected: true,
                connecting: false,
                error: null,
                reconnectAttempts: 0,
            }))
        })

        presenceClient.on("disconnected", (code, reason) => {
            setConnectionStatus(prev => ({
                ...prev,
                connected: false,
                connecting: false,
                error: `Disconnected: ${code} - ${reason}`,
            }))
        })

        presenceClient.on("error", error => {
            setConnectionStatus(prev => ({
                ...prev,
                connected: false,
                connecting: false,
                error: `Error: ${error}`,
            }))
        })

        presenceClient.on("presenceUpdate", update => {
            setMessageCount(prev => prev + 1)

            // which activities are currently active
            const currentGameIds = new Set<string>()
            const currentCompetingIds = new Set<string>()
            let currentHasSpotify = false
            let currentHasCustomStatus = false
            let currentHasStreamingOrWatching = false

            update.activities.forEach(activity => {
                if (activity.type === 0 && activity.application_id) {
                    currentGameIds.add(activity.application_id)
                } else if (activity.type === 1 || activity.type === 3) {
                    currentHasStreamingOrWatching = true
                } else if (activity.type === 2) {
                    currentHasSpotify = true
                } else if (activity.type === 4) {
                    currentHasCustomStatus = true
                } else if (activity.type === 5 && activity.application_id) {
                    currentCompetingIds.add(activity.application_id)
                }
            })

            setCurrentGames(prev => {
                const filtered = prev.filter(
                    game =>
                        game.application_id &&
                        currentGameIds.has(game.application_id)
                )
                return filtered
            })

            setCurrentCompeting(prev => {
                const filtered = prev.filter(
                    competing =>
                        competing.application_id &&
                        currentCompetingIds.has(competing.application_id)
                )
                return filtered
            })

            // clear activities if not present in current update
            if (!currentHasStreamingOrWatching) {
                setCurrentStreamingOrWatching(null)
            }

            if (!currentHasSpotify) {
                setCurrentSpotify(null)
            }

            if (!currentHasCustomStatus) {
                setCurrentCustomStatus(null)
            }
        })

        presenceClient.on("spotifyListening", spotify => {
            setCurrentSpotify(spotify)
        })

        presenceClient.on("customStatus", status => {
            setCurrentCustomStatus(status)
        })

        presenceClient.on("gameActivity", game => {
            setCurrentGames(prev => {
                // check if game already exists (by application_id)
                const existingIndex = prev.findIndex(
                    g => g.application_id === game.application_id
                )
                if (existingIndex >= 0) {
                    // update existing game
                    const updated = [...prev]
                    updated[existingIndex] = game
                    return updated
                } else {
                    // add new game
                    return [...prev, game]
                }
            })
        })

        presenceClient.on("streamingActivity", streaming => {
            setCurrentStreamingOrWatching(streaming)
        })

        presenceClient.on("watchingActivity", watching => {
            setCurrentStreamingOrWatching(watching)
        })

        presenceClient.on("competingActivity", competing => {
            setCurrentCompeting(prev => {
                // check if competing already exists (by application_id)
                const existingIndex = prev.findIndex(
                    c => c.application_id === competing.application_id
                )
                if (existingIndex >= 0) {
                    // update existing competing
                    const updated = [...prev]
                    updated[existingIndex] = competing
                    return updated
                } else {
                    // add new competing
                    return [...prev, competing]
                }
            })
        })

        presenceClient.on("ping", () => {
            setPingCount(prev => prev + 1)
            setLastPingTime(Date.now())
        })

        clientRef.current = presenceClient
        presenceClient.connect()

        return () => {
            presenceClient.disconnect()
        }
    }, [])

    const handleConnect = useCallback(() => {
        if (clientRef.current) {
            setConnectionStatus(prev => ({
                ...prev,
                connecting: true,
                error: null,
            }))
            clientRef.current.connect()
        }
    }, [])

    const handleDisconnect = useCallback(() => {
        if (clientRef.current) {
            clientRef.current.disconnect()
            setConnectionStatus(prev => ({
                ...prev,
                connected: false,
                connecting: false,
                error: "Disconnected by user",
            }))
        }
    }, [])

    const clearData = useCallback(() => {
        setCurrentSpotify(null)
        setCurrentCustomStatus(null)
        setCurrentGames([])
        setCurrentStreamingOrWatching(null)
        setCurrentCompeting([])
        setMessageCount(0)
        setPingCount(0)
        setLastPingTime(null)
        clearPresenceCache()
    }, [])

    const getStatusIcon = () => {
        if (connectionStatus.connecting) {
            return <Clock className="h-4 w-4 animate-spin" />
        }
        if (connectionStatus.connected) {
            return <Wifi className="h-4 w-4 text-green-500" />
        }
        return <WifiOff className="h-4 w-4 text-red-500" />
    }

    const getStatusColor = () => {
        if (connectionStatus.connecting)
            return "text-yellow-600 dark:text-yellow-400"
        if (connectionStatus.connected)
            return "text-green-600 dark:text-green-400"
        return "text-red-600 dark:text-red-400"
    }

    const formatLastPingTime = useMemo(() => {
        if (!lastPingTime) return "Never"
        const elapsed = Math.floor((Date.now() - lastPingTime) / 1000)
        if (elapsed < 60) return `${elapsed}s ago`
        return `${Math.floor(elapsed / 60)}m ago`
    }, [lastPingTime])

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Presence Test</h1>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5" />
                        Connection Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className={`font-medium ${getStatusColor()}`}>
                            {connectionStatus.connecting
                                ? "Connecting..."
                                : connectionStatus.connected
                                  ? "Connected"
                                  : "Disconnected"}
                        </span>
                    </div>

                    {connectionStatus.error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-red-700 dark:text-red-300 text-sm">
                                {connectionStatus.error}
                            </span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={handleConnect}
                            disabled={
                                connectionStatus.connected ||
                                connectionStatus.connecting
                            }
                            className="flex-1"
                        >
                            Connect
                        </Button>
                        <Button
                            onClick={handleDisconnect}
                            disabled={connectionStatus.connecting}
                            variant="outline"
                            className="flex-1"
                        >
                            Disconnect
                        </Button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="space-y-2">
                            <div className="flex gap-4">
                                <span>Messages: {messageCount}</span>
                                <span>Pings: {pingCount}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Last ping: {formatLastPingTime}
                            </div>
                        </div>
                        <Button onClick={clearData} variant="ghost" size="sm">
                            Clear Data
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto px-6 py-8">
                {currentCustomStatus && (
                    <CustomStatusCard status={currentCustomStatus} />
                )}
                {currentSpotify && (
                    <SpotifyActivityCard spotify={currentSpotify} />
                )}
                {currentGames.map((game, index) => (
                    <GameActivityCard
                        key={game.application_id || index}
                        game={game}
                    />
                ))}
                {currentStreamingOrWatching && (
                    <>
                        {currentStreamingOrWatching.type === 1 ? (
                            <StreamingActivityCard
                                streaming={
                                    currentStreamingOrWatching as StreamingActivity
                                }
                            />
                        ) : (
                            <WatchingActivityCard
                                watching={
                                    currentStreamingOrWatching as WatchingActivity
                                }
                            />
                        )}
                    </>
                )}
                {currentCompeting.map((competing, index) => (
                    <CompetingActivityCard
                        key={competing.application_id || index}
                        competing={competing}
                    />
                ))}
            </div>
        </div>
    )
}

export default PresenceTest
