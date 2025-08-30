import {
    ToggleGroupItem,
    ToggleGroup as ToggleGroupPrimitive,
} from "@morsz/ui/toggle-group"
import { cn } from "@morsz/ui/utils"

import React from "react"

interface ToggleGroupProps {
    options: { value: string; label: React.ReactNode }[]
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
}

const ToggleGroup = ({
    options,
    value,
    onChange,
    label,
    className = "",
}: ToggleGroupProps) => {
    return (
        <div className={cn("flex flex-col", className)}>
            {label && (
                <span className="text-xs text-muted-foreground mb-1">
                    {label}
                </span>
            )}
            <ToggleGroupPrimitive
                type="single"
                value={value}
                onValueChange={(val: string) => val && onChange(val)}
                className="bg-muted/50 border border-border rounded-lg p-0.5 shadow-inner w-full"
            >
                {options.map((option, index) => (
                    <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        className={cn(
                            "flex-1 h-9 px-3 text-sm flex items-center justify-center data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:border-primary/50 hover:bg-accent hover:text-accent-foreground",
                            index === 0 && "rounded-l-md",
                            index === options.length - 1 && "rounded-r-md"
                        )}
                    >
                        {option.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroupPrimitive>
        </div>
    )
}

export default ToggleGroup
