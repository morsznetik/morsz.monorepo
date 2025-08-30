import CopyButton from "@morsz/ui/special/copy-button"

import React from "react"

interface CodeBlockProps {
    label: string
    code: string
    onCopy: (text: string) => void
    compact?: boolean
}

const CodeBlock = ({
    label,
    code,
    onCopy,
    compact = false,
}: CodeBlockProps) => {
    return (
        <div className="relative group">
            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                        {label}
                    </span>
                </div>
                <div
                    className={`
                    mt-1 font-mono text-xs sm:text-sm bg-muted/40 md:bg-muted/60 text-foreground
                    ${compact ? "px-2.5 py-1" : "px-3 py-2"}
                    rounded-lg border border-border overflow-x-auto
                `}
                >
                    {code}
                </div>
            </div>
            <CopyButton
                text={code}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                ariaLabel={`Copy ${label}`}
                variant="inline"
                copyOptions={{
                    onSuccess: () => onCopy(code),
                }}
            />
        </div>
    )
}

export default CodeBlock
