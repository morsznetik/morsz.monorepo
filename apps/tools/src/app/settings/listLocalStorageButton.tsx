"use client"

import { Button } from "@morsz/ui/button"
import { List } from "lucide-react"

import { useState } from "react"

const ListLocalStorageButton = () => {
    const [localStorageItems, setLocalStorageItems] = useState<string[]>([])

    const handleClick = () => {
        const items = Object.keys(localStorage)
        setLocalStorageItems(items)
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={handleClick}
            >
                <List className="size-4" />
            </Button>
            <div className="fixed bottom-0 right-0">
                <div className="flex flex-col items-start justify-center">
                    {localStorageItems.map(item => (
                        <span key={item}>
                            {item}: {localStorage.getItem(item)}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ListLocalStorageButton
