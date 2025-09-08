import type {
    CompetingActivity,
    CustomStatus,
    ParsedActivity,
    PlayingActivity,
    PresenceUpdate,
    SpotifyListening,
    StreamingActivity,
    WatchingActivity,
    WebSocketMessage,
} from "./types/presence"
import { parseActivity } from "./types/presence"

const devLog = ({ message }: { message: string }): void => {
    if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
    ) {
        console.log(message)
    }
}

export interface PresenceClientOptions {
    autoReconnect?: boolean
    reconnectDelay?: number
    maxReconnectAttempts?: number
}

export interface PresenceClientEvents {
    connected: () => void
    disconnected: (code: number, reason: string) => void
    error: (error: Event) => void
    presenceUpdate: (update: PresenceUpdate) => void
    activityParsed: (activity: ParsedActivity) => void
    gameActivity: (game: PlayingActivity) => void
    streamingActivity: (streaming: StreamingActivity) => void
    watchingActivity: (watching: WatchingActivity) => void
    competingActivity: (competing: CompetingActivity) => void
    spotifyListening: (spotify: SpotifyListening) => void
    customStatus: (status: CustomStatus) => void
    ping: () => void
    pong: () => void
    goodbye: () => void
}

export class PresenceClient {
    private ws: WebSocket | null = null
    private reconnectAttempts = 0
    private reconnectTimeout: NodeJS.Timeout | null = null
    private pingInterval: NodeJS.Timeout | null = null
    private pongTimeout: NodeJS.Timeout | null = null
    private isWaitingForPong: boolean = false

    private readonly url = "wss://presence.morsz.dev/ws"
    private readonly options: Required<PresenceClientOptions>
    private readonly PING_INTERVAL = 10000 // 10 seconds
    private readonly PONG_TIMEOUT = 18000 // 18 seconds (10s + 8s leeway)

    private eventListeners: {
        [K in keyof PresenceClientEvents]?: PresenceClientEvents[K][]
    } = {}

    constructor(options: PresenceClientOptions = {}) {
        this.options = {
            autoReconnect: options.autoReconnect ?? true,
            reconnectDelay: options.reconnectDelay ?? 5000,
            maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
        }
        devLog({ message: "PresenceClient constructor called" })
    }

    connect(): void {
        devLog({ message: "PresenceClient.connect() called" })
        if (this.ws?.readyState === WebSocket.CONNECTING) {
            devLog({ message: "Already connecting, skipping" })
            return
        }

        try {
            this.ws = new WebSocket(this.url)
            this.ws.onopen = this.handleOpen.bind(this)
            this.ws.onmessage = this.handleMessage.bind(this)
            this.ws.onclose = this.handleClose.bind(this)
            this.ws.onerror = this.handleError.bind(this)
            devLog({ message: "Created new WebSocket connection" })
        } catch (error) {
            devLog({ message: `Failed to create WebSocket: ${error}` })
            this.emit("error", error as Event)
        }
    }

    disconnect(): void {
        devLog({ message: "PresenceClient.disconnect() called" })
        this.clearReconnectTimeout()
        this.clearPingInterval()
        this.clearPongTimeout()
        this.isWaitingForPong = false

        if (this.ws) {
            devLog({
                message: `Disconnecting WebSocket in state: ${this.ws.readyState}`,
            })

            // Remove event handlers to prevent any lingering callbacks
            this.ws.onopen = null
            this.ws.onmessage = null
            this.ws.onclose = null
            this.ws.onerror = null

            // Close the connection if it's still open
            if (
                this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING
            ) {
                this.ws.close(1000, "Client disconnect")
            }
            this.ws = null
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN
    }

    getConnectionHealth(): {
        isConnected: boolean
        isWaitingForPong: boolean
        reconnectAttempts: number
    } {
        return {
            isConnected: this.isConnected(),
            isWaitingForPong: this.isWaitingForPong,
            reconnectAttempts: this.reconnectAttempts,
        }
    }

    // add an event listener
    on<K extends keyof PresenceClientEvents>(
        event: K,
        listener: PresenceClientEvents[K]
    ): void {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = []
        }
        this.eventListeners[event]!.push(listener)
    }

    // remove an event listener
    off<K extends keyof PresenceClientEvents>(
        event: K,
        listener: PresenceClientEvents[K]
    ): void {
        const listeners = this.eventListeners[event]
        if (listeners) {
            const index = listeners.indexOf(listener)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }

    removeAllListenersForEvent<K extends keyof PresenceClientEvents>(
        event: K
    ): void {
        this.eventListeners[event] = []
    }

    // emit an event
    private emit<K extends keyof PresenceClientEvents>(
        event: K,
        ...args: Parameters<PresenceClientEvents[K]>
    ): void {
        const listeners = this.eventListeners[event]
        if (listeners) {
            listeners.forEach(listener => {
                ;(
                    listener as (
                        ...args: Parameters<PresenceClientEvents[K]>
                    ) => void
                )(...args)
            })
        }
    }

    private handleOpen(): void {
        devLog({ message: "Presence WebSocket connected" })
        this.reconnectAttempts = 0
        this.isWaitingForPong = false

        // Send ready packet immediately after connection is established
        this.sendReady()

        this.startPingInterval()
        this.emit("connected")
    }

    private handleMessage(event: MessageEvent): void {
        devLog({ message: `Received WebSocket message: ${event.data}` })
        try {
            if (typeof event.data !== "string") {
                devLog({ message: "Received non-string data" })
                return
            }

            this.processMessageData(event.data)
        } catch (error) {
            devLog({ message: `Failed to handle WebSocket message: ${error}` })
        }
    }

    private processMessageData(data: string): void {
        try {
            const message: WebSocketMessage = JSON.parse(data)
            devLog({ message: `Parsed message type: ${message.type}` })

            switch (message.type) {
                case "goodbye":
                    this.emit("goodbye")
                    return

                case "pong":
                    this.handlePong()
                    return

                case "presence_update": {
                    if (
                        !("userId" in message) ||
                        !("status" in message) ||
                        !("activities" in message)
                    ) {
                        devLog({
                            message: "Received invalid presence update message",
                        })
                        return
                    }

                    const presenceUpdate: PresenceUpdate = {
                        userId: message.userId,
                        status: message.status,
                        activities: message.activities,
                        updatedAt: message.updatedAt,
                    }

                    devLog({
                        message: `Emitting presence update for user ${presenceUpdate.userId}`,
                    })
                    this.emit("presenceUpdate", presenceUpdate)

                    for (const activity of message.activities) {
                        devLog({
                            message: `Processing activity: type=${activity.type}, name="${activity.name}"`,
                        })

                        const parsedActivity = parseActivity(activity)
                        if (!parsedActivity) {
                            devLog({
                                message: `Failed to parse activity of type ${activity.type}`,
                            })
                            continue
                        }

                        devLog({
                            message: `Successfully parsed activity of type ${activity.type}`,
                        })
                        this.emit("activityParsed", parsedActivity)

                        switch (activity.type) {
                            case 0:
                                devLog({
                                    message: "Emitting gameActivity event",
                                })
                                this.emit(
                                    "gameActivity",
                                    parsedActivity as PlayingActivity
                                )
                                break
                            case 1:
                                devLog({
                                    message: "Emitting streamingActivity event",
                                })
                                this.emit(
                                    "streamingActivity",
                                    parsedActivity as StreamingActivity
                                )
                                break
                            case 2:
                                devLog({
                                    message: "Emitting spotifyListening event",
                                })
                                this.emit(
                                    "spotifyListening",
                                    parsedActivity as SpotifyListening
                                )
                                break
                            case 3:
                                devLog({
                                    message: "Emitting watchingActivity event",
                                })
                                this.emit(
                                    "watchingActivity",
                                    parsedActivity as WatchingActivity
                                )
                                break
                            case 4:
                                devLog({
                                    message: "Emitting customStatus event",
                                })
                                this.emit(
                                    "customStatus",
                                    parsedActivity as CustomStatus
                                )
                                break
                            case 5:
                                devLog({
                                    message: "Emitting competingActivity event",
                                })
                                this.emit(
                                    "competingActivity",
                                    parsedActivity as CompetingActivity
                                )
                                break
                        }
                    }
                    return
                }
            }
        } catch (error) {
            devLog({ message: `Failed to parse WebSocket message: ${error}` })
            devLog({ message: `Raw data that failed to parse: ${data}` })
        }
    }

    private handleClose(event: CloseEvent): void {
        devLog({
            message: `Presence WebSocket disconnected: ${event.code} ${event.reason}`,
        })
        this.clearPingInterval()
        this.clearPongTimeout()
        this.isWaitingForPong = false
        this.emit("disconnected", event.code, event.reason)

        if (
            this.options.autoReconnect &&
            this.reconnectAttempts < this.options.maxReconnectAttempts
        ) {
            this.scheduleReconnect()
        }
    }

    private handleError(event: Event): void {
        devLog({ message: `Presence WebSocket error: ${event}` })
        this.emit("error", event)
    }

    private clearPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval)
            this.pingInterval = null
        }
    }

    private clearPongTimeout(): void {
        if (this.pongTimeout) {
            clearTimeout(this.pongTimeout)
            this.pongTimeout = null
        }
    }

    private startPingInterval(): void {
        this.clearPingInterval()
        this.pingInterval = setInterval(() => {
            this.sendPing()
        }, this.PING_INTERVAL)
    }

    private sendPing(): void {
        if (!this.isConnected()) {
            return
        }

        try {
            const pingMessage = JSON.stringify({ type: "ping" })
            this.ws!.send(pingMessage)
            this.isWaitingForPong = true

            // Set timeout for pong response
            this.clearPongTimeout()
            this.pongTimeout = setTimeout(() => {
                if (this.isWaitingForPong && this.isConnected()) {
                    devLog({ message: "Pong timeout - closing connection" })
                    this.ws?.close(1000, "Pong timeout")
                }
            }, this.PONG_TIMEOUT)

            this.emit("ping")
            devLog({ message: "Sent ping message" })
        } catch (error) {
            devLog({ message: `Failed to send ping: ${error}` })
        }
    }

    private handlePong(): void {
        this.isWaitingForPong = false
        this.clearPongTimeout()
        this.emit("pong")
        devLog({ message: "Received pong message" })
    }

    private sendReady(): void {
        if (!this.isConnected()) {
            return
        }

        try {
            const readyMessage = JSON.stringify({ type: "ready" })
            this.ws!.send(readyMessage)
            devLog({ message: "Sent ready message" })
        } catch (error) {
            devLog({ message: `Failed to send ready: ${error}` })
        }
    }

    private scheduleReconnect(): void {
        this.reconnectAttempts++
        const delay =
            this.options.reconnectDelay *
            Math.pow(2, this.reconnectAttempts - 1) // exponential backoff

        devLog({
            message: `Scheduling reconnect attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts} in ${delay}ms`,
        })

        this.reconnectTimeout = setTimeout(() => {
            this.connect()
        }, delay)
    }

    private clearReconnectTimeout(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
            this.reconnectTimeout = null
        }
    }
}
