import { cn } from "@morsz/ui/utils"
import { ExternalLink as ExternalLinkIcon } from "lucide-react"

import React from "react"

interface ExternalLinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

const ExternalLink = ({
    href,
    children,
    className = "",
}: ExternalLinkProps) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline transition-colors",
                className
            )}
        >
            {children}
            <ExternalLinkIcon className="w-3 h-3" />
        </a>
    )
}

export default ExternalLink
