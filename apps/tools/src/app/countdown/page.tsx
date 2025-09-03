"use client"

import { SITE_CONFIG, getToolUrl } from "@/app/config/urls"
import CountdownDisplay from "@/app/countdown/components/countdown-display"
import { encodeToken } from "@/app/countdown/utils/base62"
import { parseDateTime, toUTCTimestamp } from "@/app/countdown/utils/datetime"
import {
    getUTCTimezones,
    getUniqueTimezones,
} from "@/app/countdown/utils/timezone"
import { Button } from "@morsz/ui/button"
import { Calendar as CalendarComponent } from "@morsz/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"
import { Input } from "@morsz/ui/input"
import { Label } from "@morsz/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@morsz/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@morsz/ui/select"
import { Calendar } from "lucide-react"
import { DateTime } from "luxon"

import { useEffect, useState } from "react"

const Countdown = () => {
    const [timezone, setTimezone] = useState("")
    const [timezoneOptions, setTimezoneOptions] = useState<
        { name: string; label: string; offset: number }[]
    >([])
    const [targetDate, setTargetDate] = useState("")
    const [targetTime, setTargetTime] = useState(() =>
        DateTime.utc().toFormat("HH:mm")
    )
    const [title, setTitle] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    )
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [generatedToken, setGeneratedToken] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const initializeTimezone = () => {
            try {
                const allTimezoneOptions = [
                    ...getUniqueTimezones(),
                    ...getUTCTimezones(),
                ]
                setTimezoneOptions(allTimezoneOptions)

                const detected = DateTime.local().zoneName
                const detectedDT = DateTime.local().setZone(detected)

                let defaultTimezone = allTimezoneOptions.find(
                    tz => tz.name === detected
                )

                if (!defaultTimezone && detectedDT.isValid) {
                    const detectedOffset = detectedDT.offset
                    defaultTimezone = allTimezoneOptions.find(
                        tz => tz.offset === detectedOffset
                    )
                }

                if (!defaultTimezone) {
                    defaultTimezone =
                        allTimezoneOptions.find(tz => tz.name === "") ||
                        allTimezoneOptions.find(tz => tz.offset === 0)
                }

                const selectedTimezone = defaultTimezone?.name || ""
                setTimezone(selectedTimezone)
                setTargetTime(
                    DateTime.local().setZone(selectedTimezone).toFormat("HH:mm")
                )
            } catch (err) {
                console.warn("Failed to init timezone", err)
                setTimezone("")
                setTimezoneOptions([])
            }
        }

        initializeTimezone()
    }, [])

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date)
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            const dateString = `${year}-${month}-${day}`

            setTargetDate(dateString)
        }
    }

    const generateCountdownLink = () => {
        if (!targetDate || !targetTime) {
            setError("Please select a date and time")
            return
        }

        try {
            const dt = parseDateTime({
                date: targetDate,
                time: targetTime,
                timezone,
            })

            if (!dt) {
                setError("Invalid date/time")
                return
            }

            const utcTimestamp = toUTCTimestamp(dt)
            const tzOffset = dt.offset // minutes

            const token = encodeToken(
                utcTimestamp,
                tzOffset,
                title.trim() || undefined
            )

            setGeneratedToken(token)
            setError("")
        } catch (err) {
            console.error("Link generation error:", err)
            setError("Error generating countdown link")
        }
    }

    const getShareUrl = () => {
        if (!generatedToken) return ""
        return `${getToolUrl(SITE_CONFIG.TOOLS.COUNTDOWN)}/${generatedToken}`
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Countdown Timer</h1>
                <p className="text-muted-foreground">
                    Create shareable countdown timers. Set a date and time to
                    generate a clean link that anyone can use to view the live
                    countdown.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Set Target Date & Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date-picker">Target Date</Label>
                                <Popover
                                    open={calendarOpen}
                                    onOpenChange={setCalendarOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                            id="date-picker"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="start"
                                    >
                                        <CalendarComponent
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={date => {
                                                handleDateSelect(date)
                                                setCalendarOpen(false)
                                            }}
                                            captionLayout="dropdown"
                                            startMonth={new Date(1900, 0, 1)}
                                            endMonth={new Date(2100, 0, 1)}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Target Time</Label>
                                <Input
                                    type="time"
                                    id="time-picker"
                                    step="1"
                                    defaultValue={targetTime}
                                    onChange={e =>
                                        setTargetTime(e.target.value)
                                    }
                                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                                value={timezone}
                                onValueChange={setTimezone}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Loading..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {timezoneOptions.map(
                                        (
                                            tz: {
                                                name: string
                                                label: string
                                            },
                                            index: number
                                        ) => {
                                            const shouldShowSeparator =
                                                tz.name.startsWith("UTC") &&
                                                index > 0 &&
                                                !timezoneOptions[
                                                    index - 1
                                                ]?.name.startsWith("UTC")

                                            return (
                                                <div key={tz.name}>
                                                    {shouldShowSeparator && (
                                                        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
                                                            Fixed UTC Offsets
                                                        </div>
                                                    )}
                                                    <SelectItem value={tz.name}>
                                                        {tz.label}
                                                    </SelectItem>
                                                </div>
                                            )
                                        }
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                placeholder="optional"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                maxLength={50}
                            />
                        </div>

                        <Button
                            onClick={generateCountdownLink}
                            className="w-full"
                        >
                            Generate Countdown Link
                        </Button>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        {generatedToken && (
                            <div className="space-y-2">
                                <Label>Shareable Link</Label>
                                <Input
                                    value={getShareUrl()}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <div className="text-xs text-muted-foreground">
                                    Anyone with this link can view the countdown
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <CountdownDisplay
                        data={{
                            type: "preview",
                            targetDate,
                            targetTime,
                            timezone,
                            title,
                        }}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}

export default Countdown
