"use client"

import { Button } from "../button"
import { Card } from "../card"
import { cn } from "../../lib/utils"
import { Cookie, X } from "lucide-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"

type CookieBannerPosition =
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"
    | "top-right"
    | "top-left"
    | "top-center"

type UICookieBannerProps = {
    visible?: boolean
    consentVersion?: string
    storageKey?: string
    title?: string
    message?: string
    icon?: React.ReactNode
    declineLabel?: string
    allowLabel?: string
    className?: string
    position?: CookieBannerPosition
    actions?: React.ReactNode
    onAllow?: () => void
    onDecline?: () => void
    onClose?: () => void
}

const UICookieBanner = ({
    visible,
    consentVersion = "demo-0",
    storageKey = "cookie_consent",
    title,
    message = "This site doesn't use cookies yet, but I added this banner to demo it to you.",
    icon,
    declineLabel = "Decline",
    allowLabel = "Allow",
    className,
    position = "bottom-right",
    actions,
    onAllow,
    onDecline,
    onClose,
}: UICookieBannerProps) => {
    const [mounted, setMounted] = useState(false)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey)
            if (raw) {
                const parsed = JSON.parse(raw) as { version?: string; accepted?: boolean; timestamp?: number }
                if (parsed && parsed.version === consentVersion) {
                    setDismissed(true)
                }
            }
        } catch {}
    }, [storageKey, consentVersion])

    const defaultAllow = useCallback(() => {
        try {
            const record = { version: consentVersion, accepted: true, timestamp: Date.now() }
            localStorage.setItem(storageKey, JSON.stringify(record))
        } catch {}
        setDismissed(true)
    }, [storageKey, consentVersion])

    const defaultDecline = useCallback(() => {
        try {
            const record = { version: consentVersion, accepted: false, timestamp: Date.now() }
            localStorage.setItem(storageKey, JSON.stringify(record))
        } catch {}
        setDismissed(true)
    }, [storageKey, consentVersion])

    const isVisible = useMemo(() => {
        if (typeof visible === "boolean") return visible
        return !dismissed
    }, [visible, dismissed])

    if (!mounted || !isVisible) return null

    const mobileBaseClass = "fixed bottom-3 inset-x-0 flex justify-center px-3 z-50 sm:px-0"
    let smPositionClass = "sm:bottom-5 sm:right-5 sm:inset-auto"
    switch (position) {
        case "bottom-left":
            smPositionClass = "sm:bottom-5 sm:left-5 sm:inset-auto"
            break
        case "bottom-center":
            smPositionClass = "sm:bottom-5 sm:inset-x-0"
            break
        case "top-right":
            smPositionClass = "sm:top-5 sm:right-5 sm:inset-auto"
            break
        case "top-left":
            smPositionClass = "sm:top-5 sm:left-5 sm:inset-auto"
            break
        case "top-center":
            smPositionClass = "sm:top-5 sm:inset-x-0"
            break
        default:
            smPositionClass = "sm:bottom-5 sm:right-5 sm:inset-auto"
    }

    return (
        <div className={cn(mobileBaseClass, smPositionClass)}>
            <Card className={cn("bg-card border border-border max-w-sm w-full rounded-xl shadow-md py-2", className)}>
                <div className="px-3 py-2 sm:px-3 sm:py-2.5">
                    <div className={cn("flex items-start", "gap-1.5")}> 
                        <div className="mt-0.5 text-muted-foreground">
                            {icon ?? <Cookie className="w-5 h-5 text-brand-light" />}
                        </div>
                        <div className="flex-1 text-foreground">
                            {title && <p className="text-sm font-medium mb-1">{title}</p>}
                            <p className="text-sm">{message}</p>
                            <div className={cn("mt-2", "flex flex-col sm:flex-row items-stretch sm:items-center", "gap-1.5")}> 
                                {actions ? (
                                    actions
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn("bg-muted hover:bg-muted/80", "rounded-lg px-2.5 h-9 sm:h-8", "w-full sm:w-auto")}
                                            onClick={onDecline ?? defaultDecline}
                                        >
                                            {declineLabel}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className={cn("bg-foreground text-background hover:bg-foreground/90", "rounded-lg px-2.5 h-9 sm:h-8", "w-full sm:w-auto")}
                                            onClick={onAllow ?? defaultAllow}
                                        >
                                            {allowLabel}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        {onClose && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="-mt-1 -mr-1 text-muted-foreground"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default UICookieBanner


