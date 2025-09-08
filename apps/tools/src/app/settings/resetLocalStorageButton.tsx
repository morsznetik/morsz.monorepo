"use client"

import { Button } from "@morsz/ui/button"
import { Trash2 } from "lucide-react"

import React, { useCallback, useState } from "react"

const ResetLocalStorageButton = () => {
    const [cleared, setCleared] = useState(false)

    const handleReset = useCallback(() => {
        try {
            localStorage.clear()
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
            title="Clear all localStorage data"
        >
            <Trash2 className="mr-2 h-4 w-4" />
            {cleared ? "Cleared" : "Clear All Data"}
        </Button>
    )
}

export default ResetLocalStorageButton
