"use client"

import CopyButton from "@morsz/ui/special/copy-button"

import React, { useLayoutEffect, useRef, useState } from "react"

interface CharacterDisplayProps {
    char: string
    compactView: boolean
    onCopy: (text: string) => void
    fontFamily: string
}

const CharacterDisplay = ({
    char,
    compactView,
    onCopy,
    fontFamily,
}: CharacterDisplayProps) => {
    const charRef = useRef<HTMLSpanElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    // Adjust scale if character overflows container
    useLayoutEffect(() => {
        const char = charRef.current
        const container = containerRef.current
        if (!char || !container) return

        const charRect = char.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        const padding = 4
        const maxWidth = containerRect.width - 2 * padding
        const maxHeight = containerRect.height - 2 * padding

        if (charRect.width > maxWidth || charRect.height > maxHeight) {
            const widthScale = maxWidth / charRect.width
            const heightScale = maxHeight / charRect.height
            const newScale = Math.min(widthScale, heightScale, 1)
            setScale(newScale)
        } else {
            setScale(1)
        }
    }, [char, fontFamily, compactView])

    // Safety check for empty character
    if (!char) return null

    return (
        <div className="relative group">
            <div
                ref={containerRef}
                className={`
                    ${compactView ? "text-4xl sm:text-5xl p-2" : "text-5xl sm:text-6xl md:text-7xl p-3 sm:p-4"} 
                    ${fontFamily} 
                    bg-gradient-to-br from-muted/80 to-muted/60 rounded-lg flex items-center justify-center border border-border
                    hover:from-muted hover:to-muted/80 hover:border-border/80 min-w-3 shadow-inner
                    ${compactView ? "w-12 h-12 sm:w-16 sm:h-16" : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"}
                `}
            >
                <span
                    ref={charRef}
                    className="flex items-center justify-center select-none"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "center center",
                    }}
                >
                    {char}
                </span>
            </div>
            <CopyButton
                text={char}
                variant="inline"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                ariaLabel="Copy character"
                copyOptions={{
                    onSuccess: () => onCopy(char),
                }}
            />
        </div>
    )
}

export default CharacterDisplay
