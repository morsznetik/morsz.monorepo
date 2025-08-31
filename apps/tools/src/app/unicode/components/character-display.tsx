"use client"

import CopyButton from "@morsz/ui/special/copy-button"

import React, { useLayoutEffect, useRef, useState } from "react"

interface CharacterDisplayProps {
    char: string
    compactView: boolean
    onCopy: (text: string) => void
    fontFamily: string
}

const CharacterDisplay = React.memo(({
    char,
    compactView,
    onCopy,
    fontFamily,
}: CharacterDisplayProps) => {
    const charRef = useRef<HTMLSpanElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)

    // adjust scale if character overflows container
    // useLayoutEffect so we run the check after first paint
    useLayoutEffect(() => {
        const char = charRef.current
        const container = containerRef.current

        // return for safety but shouldnt happen
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

    // this sometimes happens when the full bundle is not loaded (?)
    // i havent been able to reproduce it yet so idk
    if (!char) return null

    return (
        <div className="relative group">
            <div
                ref={containerRef}
                className={`
                    ${compactView ? "text-4xl sm:text-5xl p-2" : "text-5xl sm:text-6xl md:text-7xl p-3 sm:p-4"}
                    ${fontFamily}
                    bg-muted/50 rounded-lg flex items-center justify-center border border-border
                    hover:bg-muted/70
                    ${compactView ? "size-12 sm:size-16" : "size-20 sm:size-24 md:size-28"}
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
})

CharacterDisplay.displayName = "CharacterDisplay"

export default CharacterDisplay
