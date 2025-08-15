import { Badge } from "@morsz/ui/badge"

import React from "react"

const ByteSizeDisplay = ({
    byteSize,
    compact = false,
}: {
    byteSize: number
    compact?: boolean
}) => (
    <Badge
        variant="secondary"
        className={`${compact ? "hidden text-xs px-1.5 py-0.5 min-w-[28px] text-center" : "text-xs md:text-sm px-2 py-0.5"} whitespace-nowrap flex-shrink-0`}
    >
        {byteSize} {compact ? "B" : `byte${byteSize === 1 ? "" : "s"}`}
    </Badge>
)

export default ByteSizeDisplay
