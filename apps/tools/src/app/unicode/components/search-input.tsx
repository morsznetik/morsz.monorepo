import { Input } from "@morsz/ui/input"
import { cn } from "@morsz/ui/utils"
import { Search } from "lucide-react"

import React from "react"

interface SearchInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label?: string
    className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    label = "Search",
    className = "",
}) => {
    return (
        <div className={cn("relative w-full", className)}>
            {label && (
                <span className="text-xs text-muted-foreground mb-1 block">
                    {label}
                </span>
            )}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="pl-10"
                />
            </div>
        </div>
    )
}

export default SearchInput
