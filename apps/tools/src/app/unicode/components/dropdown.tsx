import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@morsz/ui/select"
import { cn } from "@morsz/ui/utils"

import React from "react"

interface DropdownProps {
    options: { value: string; label: React.ReactNode }[]
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
}

const Dropdown = ({
    options,
    value,
    onChange,
    label,
    className = "",
}: DropdownProps) => {
    return (
        <div className={cn("flex flex-col justify-between", className)}>
            {label && (
                <span className="text-xs text-muted-foreground mb-1 block">
                    {label}
                </span>
            )}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full" size="default">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                    {label === "Display Font" && (
                        <div className="px-3 py-2 text-xs text-muted-foreground italic border-t border-border bg-muted/30">
                            <span className="flex items-center">
                                Character display may vary by browser, or device
                            </span>
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}

export default Dropdown
