"use client"

import { Alert, AlertDescription } from "@morsz/ui/alert"
import { Button } from "@morsz/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"
import { Input } from "@morsz/ui/input"
import { AlertCircle, PlusCircle } from "lucide-react"

import React, { useCallback, useEffect, useState } from "react"

interface CharacterSpawnerProps {
    onSpawn: (char: string) => void
    selectedFont: string
}

const CharacterSpawner = ({ onSpawn, selectedFont }: CharacterSpawnerProps) => {
    const [codePointInput, setCodePointInput] = useState("")
    const [previewChar, setPreviewChar] = useState("")
    const [error, setError] = useState("")

    // update preview when the input changes
    useEffect(() => {
        try {
            if (codePointInput.trim()) {
                // throw out the U+ prefix
                const hexValue = codePointInput.trim()

                const codePoint = Number.parseInt(hexValue, 16)
                if (!isNaN(codePoint)) {
                    if (codePoint > 0x10ffff) {
                        // 0x10ffff is the max code point in UTF-16
                        setError("Invalid code point (max 10FFFF)")
                        setPreviewChar("")
                    } else {
                        setError("")
                        setPreviewChar(String.fromCodePoint(codePoint))
                    }
                } else {
                    setError("Invalid hex value")
                    setPreviewChar("")
                }
            } else {
                setError("")
                setPreviewChar("")
            }
        } catch {
            setError("Invalid code point")
            setPreviewChar("")
        }
    }, [codePointInput])

    // limit which characters can be entered
    const handleCodePointInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value
            // regex to only allow hex and up to 6 chars
            if (value === "" || /^[0-9A-Fa-f]{1,6}$/.test(value)) {
                setCodePointInput(value)
            }
        },
        []
    )

    // handle the spawn button
    const handleSpawnFromCodePoint = useCallback(() => {
        if (previewChar) {
            onSpawn(previewChar)

            // nuke it
            setCodePointInput("")
            setPreviewChar("")
        }
    }, [previewChar, onSpawn])

    const isSpawnButtonEnabled = previewChar !== ""

    // keybind for enter
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && previewChar) {
                handleSpawnFromCodePoint()
            }
        },
        [previewChar, handleSpawnFromCodePoint]
    )

    return (
        <Card className="bg-card rounded-xl border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-brand-blue dark:text-brand-blue-light flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Add Unicode Character
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <span className="text-xs text-muted-foreground mb-1 block">
                            Enter Unicode Code Point
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center h-9 rounded-md border border-border bg-muted/50 text-muted-foreground px-2.5 select-none">
                                <span className="text-xs font-medium tracking-wider">U+</span>
                            </div>
                            <Input
                                type="text"
                                value={codePointInput}
                                onChange={handleCodePointInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="1F600" // :joy:
                                maxLength={6}
                                title="Enter a hex code with max 6 characters"
                                className="flex-1 font-mono text-sm h-9"
                            />
                            <Button
                                onClick={handleSpawnFromCodePoint}
                                disabled={!isSpawnButtonEnabled}
                                className="flex items-center gap-1.5 h-9"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add
                            </Button>
                        </div>
                        {error && (
                            <Alert className="mt-2 border-destructive/50 bg-destructive/10">
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <AlertDescription className="text-destructive text-xs">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div>
                        <span className="text-xs text-muted-foreground mb-1 block">
                            Preview
                        </span>
                        {previewChar ? (
                            <div
                                className={`h-10 w-full flex items-center justify-center text-3xl ${selectedFont} bg-muted/70 rounded-lg border border-border`}
                            >
                                {previewChar}
                            </div>
                        ) : (
                            <div className="h-10 w-full flex items-center justify-center text-sm text-muted-foreground bg-muted/70 rounded-lg border border-border">
                                No character
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CharacterSpawner
