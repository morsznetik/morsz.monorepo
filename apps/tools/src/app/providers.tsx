"use client"

import { TooltipProvider } from "@morsz/ui/tooltip"
import { ThemeProvider } from "next-themes"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

// Versioned cookie consent so demo acceptance does NOT cover future cookies
// Bump this when cookie categories/policy changes to force a re-prompt
const COOKIE_CONSENT_VERSION = "demo-0"
const CONSENT_STORAGE_KEY_V2 = "cookie_consent_v2"
const CONSENT_STORAGE_KEY_LEGACY = "cookie_consent"

type CookieConsentRecord = {
    version: string
    accepted: boolean
    timestamp: number
}

type CookieConsentContextType = {
    consent: CookieConsentRecord | null
    currentVersion: string
    hasAcceptedCurrent: boolean
    acceptCurrent: () => void
    declineCurrent: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export const useCookieConsent = (): CookieConsentContextType => {
    const ctx = useContext(CookieConsentContext)
    if (!ctx) throw new Error("useCookieConsent must be used within Providers")
    return ctx
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [consent, setConsent] = useState<CookieConsentRecord | null>(null)

    useEffect(() => {
        try {
            const v2Raw = localStorage.getItem(CONSENT_STORAGE_KEY_V2)
            if (v2Raw) {
                const parsed = JSON.parse(v2Raw) as CookieConsentRecord
                setConsent(parsed)
                return
            }
            // Migrate legacy boolean (does NOT satisfy current version later unless equal)
            const legacy = localStorage.getItem(CONSENT_STORAGE_KEY_LEGACY)
            if (legacy === "true" || legacy === "false") {
                const migrated: CookieConsentRecord = {
                    version: "legacy",
                    accepted: legacy === "true",
                    timestamp: Date.now(),
                }
                localStorage.setItem(CONSENT_STORAGE_KEY_V2, JSON.stringify(migrated))
                setConsent(migrated)
            }
        } catch {}
    }, [])

    const writeConsent = useCallback((accepted: boolean) => {
        const record: CookieConsentRecord = {
            version: COOKIE_CONSENT_VERSION,
            accepted,
            timestamp: Date.now(),
        }
        try {
            localStorage.setItem(CONSENT_STORAGE_KEY_V2, JSON.stringify(record))
        } catch {}
        setConsent(record)
    }, [])

    const hasAcceptedCurrent = consent?.version === COOKIE_CONSENT_VERSION && consent.accepted === true

    const contextValue = useMemo<CookieConsentContextType>(
        () => ({
            consent,
            currentVersion: COOKIE_CONSENT_VERSION,
            hasAcceptedCurrent,
            acceptCurrent: () => writeConsent(true),
            declineCurrent: () => writeConsent(false),
        }),
        [consent, hasAcceptedCurrent, writeConsent]
    )

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <CookieConsentContext.Provider value={contextValue}>
                    {children}
                </CookieConsentContext.Provider>
            </TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
