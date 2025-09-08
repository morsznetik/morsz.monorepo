import { Badge } from "@morsz/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@morsz/ui/card"
import { cn } from "@morsz/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { forwardRef } from "react"

const baseActivityCardVariants = cva("w-full flex flex-col rounded-xl", {
    variants: {
        size: {
            sm: "min-h-[120px]",
            md: "min-h-[140px]",
            lg: "min-h-[160px]",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

export interface BaseActivityCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof baseActivityCardVariants> {
    title: string
    icon: LucideIcon
}

export const BaseActivityCard = forwardRef<
    HTMLDivElement,
    BaseActivityCardProps
>(({ title, icon: Icon, size, className, children, ...props }, ref) => {
    return (
        <Card
            ref={ref}
            className={cn(baseActivityCardVariants({ size }), className)}
            {...props}
        >
            <CardHeader className="flex-shrink-0 pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                    <Icon className="h-6 w-6" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6">
                {children}
            </CardContent>
        </Card>
    )
})
BaseActivityCard.displayName = "BaseActivityCard"

const activityIconVariants = cva("rounded-xl object-cover shadow-md", {
    variants: {
        size: {
            sm: "w-20 h-20",
            md: "w-24 h-24",
            lg: "w-28 h-28",
        },
    },
    defaultVariants: {
        size: "md",
    },
})

interface ActivityIconProps
    extends Omit<
            React.ImgHTMLAttributes<HTMLImageElement>,
            "src" | "width" | "height"
        >,
        VariantProps<typeof activityIconVariants> {
    src?: string | null
    alt: string
    fallbackIcon: LucideIcon
}

export const ActivityIcon = forwardRef<HTMLImageElement, ActivityIconProps>(
    (
        { src, alt, fallbackIcon: FallbackIcon, size, className, ...props },
        ref
    ) => {
        const getImageSize = () => {
            switch (size) {
                case "sm":
                    return { width: 80, height: 80 }
                case "lg":
                    return { width: 112, height: 112 }
                default:
                    return { width: 96, height: 96 }
            }
        }

        const imageSize = getImageSize()

        if (src) {
            return (
                <img
                    ref={ref}
                    src={src}
                    alt={alt}
                    width={imageSize.width}
                    height={imageSize.height}
                    className={cn(activityIconVariants({ size }), className)}
                    onError={e => {
                        e.currentTarget.style.display = "none"
                    }}
                    {...props}
                />
            )
        }

        return (
            <div
                className={cn(
                    activityIconVariants({ size }),
                    "bg-muted flex items-center justify-center",
                    className
                )}
            >
                <FallbackIcon className="h-6 w-6 text-muted-foreground" />
            </div>
        )
    }
)
ActivityIcon.displayName = "ActivityIcon"

interface ActivityBadgesProps extends React.HTMLAttributes<HTMLDivElement> {
    badges: Array<{
        text: string
        variant?: "default" | "secondary" | "destructive" | "outline"
    }>
}

export const ActivityBadges = forwardRef<HTMLDivElement, ActivityBadgesProps>(
    ({ badges, className, ...props }, ref) => {
        if (badges.length === 0) return null

        return (
            <div
                ref={ref}
                className={cn("flex flex-wrap gap-2", className)}
                {...props}
            >
                {badges.map((badge, index) => (
                    <Badge
                        key={index}
                        variant={badge.variant || "outline"}
                        className="text-xs"
                    >
                        {badge.text}
                    </Badge>
                ))}
            </div>
        )
    }
)
ActivityBadges.displayName = "ActivityBadges"
