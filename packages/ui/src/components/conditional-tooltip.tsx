import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/tooltip"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import * as React from "react"

interface ConditionalTooltipProps
    extends Omit<
        React.ComponentProps<typeof TooltipPrimitive.Content>,
        "content"
    > {
    condition: boolean
    content: React.ReactNode
}

export const ConditionalTooltip = ({
    condition,
    content,
    children,
    ...props
}: ConditionalTooltipProps) => {
    if (!condition) return children

    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent {...props}>{content}</TooltipContent>
        </Tooltip>
    )
}
