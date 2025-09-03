"use client"

import usePreloadPages from "../../hooks/use-preload-pages"
import { cn } from "../../lib/utils"
import { Button } from "../button"
import Logo from "./tools-logo"
import { Home, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

export interface SidebarItem {
    id: string
    icon: React.ReactNode
    label: string
    href?: string
    onClick?: () => void
    priority?: number // for ordering
    section?: "upper" | "lower"
}

interface NavbarProps {
    sidebarItems?: SidebarItem[]
}

interface NavbarButtonProps extends React.ComponentProps<typeof Button> {
    icon: React.ReactNode
    label: string
    clicked?: boolean
    compact?: boolean
    href?: string
    onClick?: () => void
}
// just in case we want a custom button but this is the default
export const NavbarButton = ({
    icon,
    label,
    className,
    clicked,
    compact,
    ...props
}: NavbarButtonProps) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-pressed={clicked}
            disabled={clicked}
            className={cn(
                "h-14 rounded-sm [&_svg]:size-6 hover:cursor-pointer",
                clicked
                    ? "bg-foreground text-background disabled:opacity-100"
                    : "",
                compact ? "w-14" : "w-20",
                className
            )}
            {...props}
        >
            <div className="flex flex-col items-center justify-center gap-1">
                {icon}
                {!compact && (
                    <span
                        className={`text-xs font-medium ${clicked ? "text-background" : "text-muted-foreground"}`}
                    >
                        {label}
                    </span>
                )}
            </div>
        </Button>
    )
}

// TODO: add a toggle button to hide the sidebar
/* hide this :3 ~ rant
    this is a cool idea, but it would add a lot of complexity to the codebase.
    not that it’s super hard to do, just not worth the effort right now.
    it would need a Context Provider to manage sidebar state and a bunch of other stuff,
    so i’m not going to implement it for now. maybe later i’ll find a better solution (that *is* probably the only solution.)
    definitely something to consider down the line, but for now it just makes things infinitely more complicated.
 */
const Navbar = ({ sidebarItems = [] }: NavbarProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const defaultItems: SidebarItem[] = [
        {
            id: "home",
            icon: <Home />,
            label: "Home",
            href: "/",
            section: "upper",
            priority: 0,
        },
        {
            id: "settings",
            icon: <Settings />,
            label: "Settings",
            href: "/settings",
            section: "lower",
            priority: 0,
        },
    ]

    const allItems = [...defaultItems, ...sidebarItems].sort(
        (a, b) => (a.priority || 0) - (b.priority || 0)
    )

    const navbarButtons = {
        upper: allItems.filter(item => item.section !== "lower"),
        lower: allItems.filter(item => item.section === "lower"),
    }

    // preload all navbar pages for instant navigation
    // i feel like explaining this is a good idea, basically we are flattening the object via reduce ( i love reduce )
    // and then filtering out the ones that don't have a href
    const allNavbarUrls = allItems.reduce<string[]>((acc, item) => {
        if (item.href) acc.push(item.href)
        return acc
    }, [])

    usePreloadPages({ urls: allNavbarUrls })

    const renderButtons = (
        buttons: SidebarItem[],
        compact: boolean | undefined = false
    ) =>
        buttons.map(btn => {
            const isActive =
                !!btn.href &&
                (pathname === btn.href || pathname.startsWith(btn.href + "/"))
            return (
                <NavbarButton
                    key={btn.id}
                    icon={btn.icon}
                    label={btn.label}
                    clicked={isActive}
                    compact={compact}
                    onClick={() => {
                        if (btn.onClick) {
                            btn.onClick()
                        } else if (btn.href && pathname !== btn.href) {
                            router.push(btn.href)
                        }
                    }}
                />
            )
        })

    return (
        <>
            {/* desktop */}
            <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-24 flex-col items-center py-4 gap-4 border-r border-sidebar-border bg-sidebar">
                <div className="flex items-center justify-center size-12">
                    <Logo />
                </div>
                <div className="flex flex-1 justify-start-safe gap-4">
                    <div className="flex flex-col items-center gap-4">
                        {renderButtons(navbarButtons.upper)}
                    </div>
                </div>
                <div className="flex flex-1 justify-end-safe gap-4">
                    <div className="flex flex-col-reverse items-center gap-4">
                        {renderButtons(navbarButtons.lower)}
                    </div>
                </div>
            </aside>

            {/* mobile */}
            <footer className="flex sm:hidden fixed bottom-0 left-0 right-0 h-16 items-center justify-between border-t border-sidebar-border bg-sidebar px-2 z-50">
                <div className="flex flex-1 items-center justify-start-safe gap-2">
                    {renderButtons(navbarButtons.upper, true)}
                </div>
                <div className="flex flex-1 flex-row-reverse items-center justify-start-safe gap-2">
                    {renderButtons(navbarButtons.lower, true)}
                </div>
            </footer>
        </>
    )
}

export default Navbar
