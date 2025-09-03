"use client"

import {
    TimeData,
    calculateCountdownUpdate,
    parseDateTime,
} from "@/app/countdown/utils/datetime"
import {
    getTimezoneAbbreviation,
    normalizeTimezoneForLuxon,
} from "@/app/countdown/utils/timezone"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@morsz/ui/card"
import { cn } from "@morsz/ui/utils"
import { Clock } from "lucide-react"
import { DateTime } from "luxon"

import { memo, useEffect, useMemo, useState } from "react"

const formatShortenedNumber = (num: number): string => {
    if (num < 1000) {
        return num.toString()
    }

    const units = [
        { value: 1e9, symbol: "B" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" },
    ]

    for (const unit of units) {
        if (num >= unit.value) {
            const formatted = (num / unit.value).toFixed(1)
            return formatted.endsWith(".0")
                ? formatted.slice(0, -2) + unit.symbol
                : formatted + unit.symbol
        }
    }

    return num.toString()
}

type CountdownDataSource =
    | {
          type: "preview"
          targetDate: string
          targetTime: string
          timezone: string
          title?: string
      }
    | {
          type: "token"
          targetDateTime: { iso: string; timezone: string }
          timezone: string
          title?: string
          initialTimeLeft?: TimeData
          initialTimePassed?: TimeData
          initialIsExpired: boolean
      }

interface CountdownDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
    data: CountdownDataSource
}

interface TimeUnitProps {
    value: number
    label: string
    isActive?: boolean
    showHover?: boolean
    textSize?: string
}

interface TimeGridProps {
    timeData: TimeData
    isActive?: boolean
    showHover?: boolean
    className?: string
    textSize?: string
}

interface TimerDisplayProps {
    timeData: TimeData
    isElapsed?: boolean
    textSize?: string
}

interface TargetInfoProps {
    targetDateTime: DateTime
    timezone: string
}

const TimeUnit = ({
    value,
    label,
    isActive = true,
    textSize = "text-3xl",
}: TimeUnitProps) => {
    const getDisplayValue = () => {
        if (label === "Days") {
            return formatShortenedNumber(value)
        }

        if (["Hours", "Minutes", "Seconds"].includes(label)) {
            return String(value).padStart(2, "0")
        }

        return value > 0 ? value : "0"
    }

    return (
        <div className="text-center">
            <div className="relative">
                <div
                    className={cn(
                        `${textSize} font-bold mb-3`,
                        isActive ? "text-primary" : "text-muted-foreground/80"
                    )}
                >
                    {getDisplayValue()}
                </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                {label}
            </div>
        </div>
    )
}

const TimeGrid = ({
    timeData,
    isActive = true,
    className = "",
    textSize = "text-3xl",
}: TimeGridProps) => (
    <div
        className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-24",
            className
        )}
    >
        <TimeUnit
            value={timeData.days}
            label="Days"
            isActive={isActive}
            textSize={textSize}
        />
        <TimeUnit
            value={timeData.hours}
            label="Hours"
            isActive={isActive}
            textSize={textSize}
        />
        <TimeUnit
            value={timeData.minutes}
            label="Minutes"
            isActive={isActive}
            textSize={textSize}
        />
        <TimeUnit
            value={timeData.seconds}
            label="Seconds"
            isActive={isActive}
            textSize={textSize}
        />
    </div>
)

const TimerDisplay = ({
    timeData,
    isElapsed = false,
    textSize = "text-3xl",
}: TimerDisplayProps) => (
    <div className="text-center space-y-6">
        <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-bold text-muted-foreground/20 select-none">
                    T{isElapsed ? "+" : "-"}
                </div>
            </div>
            <TimeGrid
                className="z-10"
                timeData={timeData}
                isActive={!isElapsed}
                textSize={textSize}
            />
        </div>
    </div>
)

const TargetInfo = ({ targetDateTime, timezone }: TargetInfoProps) => (
    <div className="text-center">
        <p className="text-sm text-muted-foreground">
            <span className="font-medium">Target:</span>{" "}
            {targetDateTime
                .setZone(normalizeTimezoneForLuxon(timezone))
                .toFormat("MMMM d, yyyy 'at' h:mm a")}{" "}
            <span className="text-muted-foreground/70">
                ({getTimezoneAbbreviation(timezone)})
            </span>
        </p>
    </div>
)

const CountdownDisplay = memo(
    ({ data, className = "" }: CountdownDisplayProps) => {
        const targetDateTime = useMemo(() => {
            if (data.type === "preview") {
                return parseDateTime({
                    date: data.targetDate,
                    time: data.targetTime,
                    timezone: data.timezone,
                })
            } else {
                return DateTime.fromISO(data.targetDateTime.iso, {
                    zone: data.targetDateTime.timezone,
                })
            }
        }, [data])

        const timezone = data.timezone

        const [timeLeft, setTimeLeft] = useState<TimeData | null>(
            data.type === "token" ? data.initialTimeLeft || null : null
        )
        const [timePassed, setTimePassed] = useState<TimeData | null>(
            data.type === "token" ? data.initialTimePassed || null : null
        )
        const [isExpired, setIsExpired] = useState(
            data.type === "token" ? data.initialIsExpired : false
        )

        useEffect(() => {
            if (!targetDateTime || !targetDateTime.isValid) return

            const updateCountdown = () => {
                try {
                    const normalizedTimezone =
                        normalizeTimezoneForLuxon(timezone)
                    const {
                        timeLeft,
                        timePassed,
                        isExpired: newIsExpired,
                    } = calculateCountdownUpdate(
                        targetDateTime,
                        normalizedTimezone
                    )

                    setIsExpired(newIsExpired)
                    setTimeLeft(timeLeft)
                    setTimePassed(timePassed)
                } catch (err) {
                    console.error("Countdown calculation error:", err)
                }
            }

            updateCountdown()
            const interval = setInterval(updateCountdown, 1000)
            return () => clearInterval(interval)
        }, [targetDateTime, timezone])

        // if the user hasn't set a target date/time
        if (!targetDateTime || !targetDateTime.isValid) {
            if (data.type === "preview") {
                return (
                    <Card className={cn("min-h-96", className)}>
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold">
                                <Clock className="h-6 w-6 text-muted-foreground" />
                                Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-64">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground text-lg">
                                    Set a date and time to see the preview
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
            return undefined
        }

        if (!timeLeft) {
            return undefined
        }

        return (
            <>
                {data.type === "preview" ? (
                    <Card className={cn("overflow-hidden min-h-96", className)}>
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-3 text-xl font-bold">
                                <Clock className="h-6 w-6 text-primary" />
                                {data.title || "Preview"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-2 pb-2 flex-1 flex flex-col">
                            {isExpired && timePassed ? (
                                <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-green-600">
                                            Time&apos;s Up!
                                        </h2>
                                        <p className="text-muted-foreground">
                                            The countdown has ended.
                                        </p>
                                    </div>
                                    <div className="pt-6">
                                        <TimerDisplay
                                            timeData={timePassed}
                                            isElapsed={true}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col">
                                    <div className="flex-1 flex items-center justify-center">
                                        <TimerDisplay timeData={timeLeft} />
                                    </div>
                                    <CardFooter className="justify-center pt-6">
                                        <TargetInfo
                                            targetDateTime={targetDateTime}
                                            timezone={timezone}
                                        />
                                    </CardFooter>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div
                        className={cn(
                            "container mx-auto px-4 py-4 sm:py-8 max-w-6xl",
                            className
                        )}
                    >
                        <Card className="overflow-hidden max-w-4xl mx-auto">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold">
                                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                                    {data.title || "Countdown"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-8 md:p-12">
                                {isExpired && timePassed ? (
                                    <div className="text-center space-y-4 sm:space-y-8">
                                        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">
                                            🎉
                                        </div>
                                        <div className="space-y-2 sm:space-y-4">
                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                                                Time&apos;s Up!
                                            </h2>
                                            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                                                The countdown has reached zero.
                                            </p>
                                        </div>
                                        <div className="pt-4 sm:pt-8">
                                            <TimerDisplay
                                                timeData={timePassed}
                                                isElapsed={true}
                                                textSize="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 sm:space-y-8 md:space-y-12 flex flex-col items-center justify-center min-h-64 sm:min-h-76">
                                        <div className="flex items-center justify-center">
                                            <TimerDisplay
                                                timeData={timeLeft}
                                                textSize="text-7xl sm:text-6xl md:text-7xl lg:text-8xl"
                                            />
                                        </div>
                                        <div className="pt-4 sm:pt-8">
                                            <TargetInfo
                                                targetDateTime={targetDateTime}
                                                timezone={timezone}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </>
        )
    }
)

// its memoized so it loses the display name we have to set it manually
CountdownDisplay.displayName = "CountdownDisplay"

export default CountdownDisplay
