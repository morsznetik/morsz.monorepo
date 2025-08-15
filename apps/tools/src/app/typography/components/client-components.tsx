"use client"

import ThemeSwitch from "@morsz/ui/special/theme-switch"
import ToolCard from "@morsz/ui/special/tool-card"
import { Button } from "@morsz/ui/button"
import { Separator } from "@morsz/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@morsz/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@morsz/ui/tooltip"
import { Palette, Settings } from "lucide-react"

const ClientComponents = () => {
    return (
        <section className="space-y-12">
            <div className="space-y-4">
                <h2 className="font-bold tracking-tight">Client Components</h2>
            </div>

            <div className="space-y-6">
                <h3>Theme Switch</h3>
                <div className="flex items-center gap-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            the switch animation will be inheritly laggy, <br />
                            especially on mobile, lower end devices, and big,
                            heavy html pages like this one.
                        </p>
                        <ThemeSwitch />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Tool Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-lg">
                    <ToolCard
                        title="Title"
                        description="Description"
                        icon={<Settings className="h-6 w-6" />}
                        color="bg-blue-100 dark:bg-blue-900/20"
                        href="/"
                    />

                    <ToolCard
                        title="Longer title"
                        description="Description with a lot of text, lorem ipsum dolor sit amet consectetur adipisicing elit."
                        icon={<Palette className="h-6 w-6" />}
                        color="bg-purple-100 dark:bg-purple-900/20"
                        href="https://example.com"
                    />

                    <ToolCard
                        title="Title"
                        description="Description"
                        icon={<Settings className="h-6 w-6" />}
                        color="bg-blue-100 dark:bg-blue-900/20"
                        href="/"
                        comingSoon
                    />

                    <ToolCard
                        title="Longer title"
                        description="Description with a lot of text, lorem ipsum dolor sit amet consectetur adipisicing elit."
                        icon={<Palette className="h-6 w-6" />}
                        color="bg-purple-100 dark:bg-purple-900/20"
                        href="https://example.com"
                        comingSoon
                    />
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Tooltips</h3>
                <div className="flex justify-start">
                    <TooltipProvider>
                        <div className="flex gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline">Hover me</Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Any component can have a tooltip</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Sheets</h3>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">Open Sheet</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Sheet Title</SheetTitle>
                            <SheetDescription>
                                Sheet Description
                            </SheetDescription>
                        </SheetHeader>
                        Sheet Content
                    </SheetContent>
                </Sheet>
            </div>
        </section>
    )
}

export default ClientComponents
