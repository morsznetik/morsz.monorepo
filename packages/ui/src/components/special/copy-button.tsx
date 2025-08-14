"use client"

import { Button } from "../button"
import { cn } from "../../lib/utils"
import { Check, Copy } from "lucide-react"

import React, { useState } from "react"

interface CopyButtonProps
    extends Omit<
        React.ComponentProps<typeof Button>,
        "variant" | "size" | "aria-label"
    > {
    text: string
    size?: number
    variant?: "default" | "inline"
    ariaLabel?: string
    copyOptions?: {
        onSuccess?: () => void
        onError?: (error: Error) => void
    }
}

const CopyButton = ({
    text,
    size = 16,
    variant = "default",
    ariaLabel = "Copy to clipboard",
    copyOptions = {},
    className,
    ...props
}: CopyButtonProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            copyOptions.onSuccess?.()

            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error("Failed to copy text:", error)
            copyOptions.onError?.(error as Error)
        }
    }

    if (variant === "inline") {
        return (
            <Button
                onClick={handleCopy}
                className={cn(
                    "inline-flex items-center justify-center p-0.5 z-10 rounded-sm transition-all",
                    className
                )}
                aria-label={ariaLabel}
                variant="ghost"
                size="icon"
                {...props}
            >
                {copied ? (
                    <Check
                        className="text-green-500"
                        style={{ width: size, height: size }}
                    />
                ) : (
                    <Copy
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        style={{ width: size, height: size }}
                    />
                )}
            </Button>
        )
    }

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className={cn("gap-2 z-10", className)}
            aria-label={ariaLabel}
            {...props}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy
                </>
            )}
        </Button>
    )
}

export default CopyButton
