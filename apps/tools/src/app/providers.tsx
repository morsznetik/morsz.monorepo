import { TooltipProvider } from "@morsz/ui/tooltip"
import { ThemeProvider } from "next-themes"

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
    )
}

export default Providers
