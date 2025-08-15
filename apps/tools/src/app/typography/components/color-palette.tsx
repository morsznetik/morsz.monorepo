"use client"

import { useEffect, useState } from "react"

const colorNames = [
    "background",
    "foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "accent",
    "accent-foreground",
    "muted",
    "muted-foreground",
    "destructive",
    "border",
    "input",
    "ring",
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
    "brand",
    "brand-reverse",
]

function ColorValue({ varName }: { varName: string }) {
    const [value, setValue] = useState<string>("")
    useEffect(() => {
        if (typeof window !== "undefined") {
            const v = getComputedStyle(
                document.documentElement
            ).getPropertyValue(varName)
            setValue(v.trim())
        }
    }, [varName])
    if (!value)
        return <span className="text-xs text-muted-foreground">&nbsp;</span>
    return (
        <span className="text-xs text-muted-foreground text-center break-all">
            {value.startsWith("oklch") ? (
                value
            ) : (
                <span className="italic">{value}</span>
            )}
        </span>
    )
}

const ColorPalette = () => (
    <section>
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {colorNames.map(name => (
                <div key={name} className="flex flex-col items-center gap-2">
                    <div
                        className="w-16 h-16 rounded border"
                        style={{
                            background: `var(--${name})`,
                            borderColor: name.includes("border")
                                ? `var(--${name})`
                                : "var(--border)",
                        }}
                    />
                    <span className="text-xs text-center">--{name}</span>
                    <ColorValue varName={`--${name}`} />
                </div>
            ))}
        </div>
    </section>
)

export default ColorPalette
