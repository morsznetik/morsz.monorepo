"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ConditionalTooltip } from "@/components/ui/conditional-tooltip"
import { usePreloadPages } from "@/hooks/use-preload-pages"
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

export interface ToolCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description: string
    icon: React.ReactNode
    href?: string
    color: string
    credits?: {
        name: string
        link: string
        source?: string
        authors?: {
            name: string
            link: string
        }[]
    }
    comingSoon?: boolean
}

const ToolCard = ({
    title,
    description,
    icon,
    href,
    color,
    comingSoon = false,
    credits,
    ...props
}: ToolCardProps) => {
    const { preloadNow } = usePreloadPages()
    const router = useRouter()

    const isExternal = href?.startsWith("http")
    const label = comingSoon ? "coming soon" : "open"

    const handleClick = () => {
        if (comingSoon || !href) return

        if (isExternal) {
            window.open(href, "_blank")
        } else {
            router.push(href)
        }
    }

    return (
        <Card
            onMouseEnter={() => href && !isExternal && preloadNow(href)}
            className={cn("flex flex-col justify-between gap-1")}
            {...props}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold">
                            {title}
                        </CardTitle>
                        {credits && (
                            <p className="text-xs text-muted-foreground mt-1">
                                <ConditionalTooltip
                                    condition={
                                        !!credits.authors &&
                                        credits.authors.length > 0
                                    }
                                    content={
                                        <ul className="text-sm space-y-0.5">
                                            {credits.authors?.map(
                                                (author, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-muted-foreground"
                                                    >
                                                        <a
                                                            href={author.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline hover:text-foreground transition-colors"
                                                        >
                                                            {author.name}
                                                        </a>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    }
                                    side="top"
                                    className="max-w-xs"
                                >
                                    <a
                                        href={credits.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-foreground transition-colors"
                                    >
                                        by {credits.name}
                                    </a>
                                </ConditionalTooltip>
                                {credits.source && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <a
                                            href={credits.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-foreground transition-colors"
                                        >
                                            source
                                        </a>
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                    <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 justify-between">
                <CardDescription className="mb-4 text-base leading-snug">
                    {description}
                </CardDescription>
                <ConditionalTooltip
                    condition={!!isExternal}
                    content="This leads to an external site"
                    side="bottom"
                >
                    <Button
                        className="w-full mt-auto cursor-pointer"
                        disabled={comingSoon}
                        variant={comingSoon ? "outline" : "default"}
                        onClick={handleClick}
                    >
                        <span>{label}</span>
                        {isExternal && <ExternalLink className="size-4 ml-1" />}
                    </Button>
                </ConditionalTooltip>
            </CardContent>
        </Card>
    )
}

export default ToolCard
