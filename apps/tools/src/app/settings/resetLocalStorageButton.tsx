"use client"

import { Button } from "@morsz/ui/button"
import { Trash2 } from "lucide-react"

import React, { useCallback, useState } from "react"

const APP_KEYS = [
    // Consent storage keys (v2 and legacy)
    "cookie_consent_v2",
    "cookie_consent",
    // next-themes key
    "theme",
]

const ResetLocalStorageButton = () => {
    const [cleared, setCleared] = useState(false)

    const handleReset = useCallback(() => {
        try {
            APP_KEYS.forEach(key => localStorage.removeItem(key))
            setCleared(true)
            // Feedback timeout
            setTimeout(() => setCleared(false), 1200)
        } catch {
            // ignore storage access errors (private mode or blocked)
        }
    }, [])

    return (
        <Button
            variant={cleared ? "secondary" : "outline"}
            size="sm"
            onClick={handleReset}
            className="rounded-md"
            title="Reset app localStorage keys"
        >
            <Trash2 className="mr-2 h-4 w-4" />
            {cleared ? "Cleared" : "Reset localStorage"}
        </Button>
    )
}

export default ResetLocalStorageButton


