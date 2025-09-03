import { createToolMetadata } from "@/app/config/metadata"
import { SITE_CONFIG } from "@/app/config/urls"
import CountdownDisplay from "@/app/countdown/components/countdown-display"
import { decodeToken } from "@/app/countdown/utils/base62"
import {
    calculateInitialTimeStates,
    fromUTCTimestampAndOffset,
    getTimezonesFromOffset,
} from "@/app/countdown/utils/datetime"
import { CountdownData } from "@/app/countdown/utils/datetime"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"
import type { Metadata } from "next"

import { memo } from "react"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ token: string }>
}): Promise<Metadata> {
    const { token } = await params

    try {
        const { timestamp, timezoneOffset, title } = decodeToken(token)
        const targetDateTime = fromUTCTimestampAndOffset(
            Number(timestamp),
            timezoneOffset
        )
        const timezone = getTimezonesFromOffset(timezoneOffset)

        const formattedDate = targetDateTime
            .setZone(timezone)
            .toFormat("MMM d, yyyy 'at' h:mm a")
        const countdownTitle = title || "Countdown Timer"

        return createToolMetadata(
            countdownTitle,
            `Countdown to ${formattedDate} (${timezone})`,
            SITE_CONFIG.TOOLS.COUNTDOWN,
            {
                title: `${countdownTitle} - ${formattedDate}`,
                description: `Live countdown timer to ${formattedDate} (${timezone})`,
            }
        )
    } catch {
        return createToolMetadata(
            "Countdown Timer",
            "Live countdown timer",
            SITE_CONFIG.TOOLS.COUNTDOWN
        )
    }
}

function calculateInitialCountdownState(
    token: string
): CountdownData | { error: string } {
    try {
        const { timestamp, timezoneOffset, title } = decodeToken(token)
        const targetDateTime = fromUTCTimestampAndOffset(
            Number(timestamp),
            timezoneOffset
        )

        const timezone = getTimezonesFromOffset(timezoneOffset)
        const { initialTimeLeft, initialTimePassed, initialIsExpired } =
            calculateInitialTimeStates(targetDateTime, timezone)

        return {
            targetDateTime: {
                iso: targetDateTime.toISO() || new Date().toISOString(),
                timezone: timezone,
            },
            timezone,
            title,
            initialIsExpired,
            initialTimeLeft: initialTimeLeft || undefined,
            initialTimePassed: initialTimePassed || undefined,
        }
    } catch (err) {
        return {
            error: err instanceof Error ? err.message : "You shouldn't be here",
        }
    }
}

const CountdownDisplayPage = memo(
    async ({ params }: { params: Promise<{ token: string }> }) => {
        const { token } = await params
        const result = calculateInitialCountdownState(token)

        if ("error" in result) {
            return (
                <Card className="container mx-auto px-4 max-w-4xl">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {result.error}, are you trying to break the app :(
                        </p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <CountdownDisplay
                data={{
                    type: "token",
                    targetDateTime: result.targetDateTime,
                    timezone: result.timezone,
                    title: result.title,
                    initialIsExpired: result.initialIsExpired,
                    initialTimeLeft: result.initialTimeLeft || undefined,
                    initialTimePassed: result.initialTimePassed || undefined,
                }}
                className="container mx-auto px-4"
            />
        )
    }
)

// its memoized so it loses the display name we have to set it manually
CountdownDisplayPage.displayName = "CountdownDisplayPage"

export default CountdownDisplayPage
