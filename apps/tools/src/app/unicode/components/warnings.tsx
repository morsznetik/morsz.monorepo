"use client"

import { Alert, AlertDescription } from "@morsz/ui/alert"
import { Button } from "@morsz/ui/button"
import { AlertCircle, Info, X } from "lucide-react"

import React, { useState } from "react"

interface AnimatedWarningsProps {
    input: string
    showRgiWarning: boolean
}

const AnimatedWarnings = ({ input, showRgiWarning }: AnimatedWarningsProps) => {
    const hasSurrogatePairs = input.length !== Array.from(input).length

    const [dismissedRgi, setDismissedRgi] = useState(false)

    return (
        <div className="space-y-3 mb-4">
            {hasSurrogatePairs && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <Alert className="border-info/40 bg-info/10">
                        <Info className="h-4 w-4 text-info" />
                        <AlertDescription className="text-info">
                            <p className="font-medium mb-1">
                                Surrogate Pairs Detected
                            </p>
                            <p className="text-info/80">
                                Your text contains characters that use UTF-16{" "}
                                <strong>surrogate pairs</strong>. This means{" "}
                                <code className="bg-info/20 px-1 rounded">
                                    string.length
                                </code>{" "}
                                ({input.length}) differs from the actual
                                character count ({Array.from(input).length}).
                                This is normal for characters outside the Basic
                                Multilingual Plane, like emoji and ancient
                                scripts.
                            </p>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {showRgiWarning && !dismissedRgi && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <Alert className="border-warning/40 bg-warning/10">
                        <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <AlertDescription className="text-warning flex-1">
                            <div className="flex justify-between items-center min-w-full">
                                <p className="font-medium mb-1">
                                    Emoji Compatibility Warning
                                </p>
                                <Button
                                    onClick={() => setDismissedRgi(true)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-warning hover:text-warning hover:bg-warning/10 p-1 -mt-1 -mr-1 cursor-pointer"
                                    aria-label="Dismiss warning"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-warning/80">
                                Some Emoji ZWJ Sequences may have not been
                                Recommended For General Interchange (RGI) by
                                Unicode. Expect limited cross-platform support
                                or unexpected grapheme splitting.
                            </p>
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    )
}

export default AnimatedWarnings
