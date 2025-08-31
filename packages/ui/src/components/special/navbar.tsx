"use client"

import usePreloadPages from "../../hooks/use-preload-pages"
import { cn } from "../../lib/utils"
import { Button } from "../button"
import Logo from "./tools-logo"
import { Home, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

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
const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()

    const navbarButtons = {
        upper: [{ icon: <Home />, label: "Home", href: "/" }],
        lower: [{ icon: <Settings />, label: "Settings", href: "/settings" }],
    }

    // preload all navbar pages for instant navigation
    // i feel like explaining this is a good idea, basically we are flattening the object via reduce ( i love reduce )
    // and then filtering out the ones that don't have a href
    const allNavbarUrls = Object.values(navbarButtons).reduce<string[]>(
        (acc, buttons) => {
            buttons.forEach(btn => {
                if (btn.href) acc.push(btn.href)
            })
            return acc
        },
        []
    )

    usePreloadPages({ urls: allNavbarUrls })

    const renderButtons = (
        buttons: NavbarButtonProps[],
        compact: boolean | undefined = false
    ) =>
        buttons.map(btn => {
            const isActive =
                !!btn.href &&
                (pathname === btn.href || pathname.startsWith(btn.href + "/"))
            return (
                <NavbarButton
                    key={btn.label}
                    clicked={isActive}
                    compact={compact}
                    onClick={() =>
                        btn.href &&
                        pathname !== btn.href &&
                        router.push(btn.href)
                    }
                    {...btn}
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
