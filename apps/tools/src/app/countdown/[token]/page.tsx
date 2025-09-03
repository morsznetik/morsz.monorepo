import CountdownDisplay from "@/app/countdown/components/countdown-display"
import { decodeToken } from "@/app/countdown/utils/base62"
import {
    calculateInitialTimeStates,
    fromUTCTimestampAndOffset,
    getTimezonesFromOffset,
} from "@/app/countdown/utils/datetime"
import { CountdownData } from "@/app/countdown/utils/datetime"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"

import { memo } from "react"

function calculateInitialCountdownState(
    token: string
): CountdownData | { error: string } {
    try {
        const { timestamp, timezoneOffset } = decodeToken(token)
        const targetDateTime = fromUTCTimestampAndOffset(
            timestamp,
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
