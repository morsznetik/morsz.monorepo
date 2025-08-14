"use client"

import { Button } from "../button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()
    const iconClass = "h-5 w-5 transition-transform duration-theme-switch"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative"
            aria-label="Toggle theme"
        >
            <Sun className={`${iconClass} dark:rotate-90 dark:scale-0`} />
            <Moon
                className={`absolute ${iconClass} rotate-90 scale-0 dark:rotate-0 dark:scale-100`}
            />
        </Button>
    )
}

export default ThemeSwitch
