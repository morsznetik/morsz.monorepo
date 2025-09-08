import {
    ActivityBadges,
    ActivityIcon,
    BaseActivityCard,
    type BaseActivityCardProps,
} from "@/app/presence/components/BaseActivityCard"
import { type Activity, ActivityFlags } from "@morsz/presence/types"
import { getActivityAssetUrl } from "@morsz/presence/utils/assets"
import { Tooltip, TooltipContent, TooltipTrigger } from "@morsz/ui/tooltip"
import { LucideIcon } from "lucide-react"

import { memo } from "react"

interface ActivityCardProps<T extends Activity = Activity>
    extends Omit<BaseActivityCardProps, "title" | "icon"> {
    activity: T
    title: string
    icon: LucideIcon
    showDetailsUrl?: boolean
    showLargeTextUrl?: boolean
}

const ActivityIconWithTooltip = memo(({
    activity,
    fallbackIcon: Icon,
    showLargeTextUrl
}: {
    activity: Activity
    fallbackIcon: LucideIcon
    showLargeTextUrl: boolean
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div>
                <ActivityIcon
                    src={getActivityAssetUrl(
                        activity.assets?.large_image || "",
                        activity.application_id
                    )}
                    alt={`${activity.name} icon`}
                    fallbackIcon={Icon}
                    size="md"
                />
            </div>
        </TooltipTrigger>
        {activity.assets?.large_text && (
            <TooltipContent>
                {showLargeTextUrl &&
                "large_text_url" in activity.assets &&
                activity.assets.large_text_url ? (
                    <a
                        href={activity.assets.large_text_url}
                        className="hover:underline cursor-pointer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {activity.assets.large_text}
                    </a>
                ) : (
                    activity.assets.large_text
                )}
            </TooltipContent>
        )}
    </Tooltip>
))
ActivityIconWithTooltip.displayName = "ActivityIconWithTooltip"

const SmallActivityIconWithTooltip = memo(({
    activity,
    fallbackIcon: Icon
}: {
    activity: Activity
    fallbackIcon: LucideIcon
}) => {
    if (!activity.assets || !("small_image" in activity.assets) || !activity.assets.small_image) {
        return null
    }

    return (
        <div className="absolute -bottom-3 -right-3 z-10">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-12 h-12 rounded-full border-8 border-card shadow-lg overflow-hidden">
                        <ActivityIcon
                            src={getActivityAssetUrl(
                                activity.assets.small_image,
                                activity.application_id
                            )}
                            alt={`${("small_text" in activity.assets && activity.assets.small_text) || activity.name} small icon`}
                            fallbackIcon={Icon}
                            size="sm"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </TooltipTrigger>
                {"small_text" in activity.assets &&
                    activity.assets.small_text && (
                        <TooltipContent>
                            {"small_text_url" in activity.assets &&
                            activity.assets.small_text_url ? (
                                <a
                                    href={activity.assets.small_text_url}
                                    className="hover:underline cursor-pointer"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {activity.assets.small_text}
                                </a>
                            ) : (
                                activity.assets.small_text
                            )}
                        </TooltipContent>
                    )}
            </Tooltip>
        </div>
    )
})
SmallActivityIconWithTooltip.displayName = "SmallActivityIconWithTooltip"

const ActivityDetails = memo(({
    activity,
    showDetailsUrl
}: {
    activity: Activity
    showDetailsUrl: boolean
}) => (
    <div className="flex-1 space-y-2 min-w-0">
        <div className="font-bold text-lg leading-tight">
            {activity.name}
        </div>
        {activity.details && (
            <div className="text-muted-foreground text-sm">
                {activity.details}
            </div>
        )}
        {activity.state && (
            <div className="text-muted-foreground text-xs">
                {showDetailsUrl ? (
                    <a
                        href={activity.state}
                        className="hover:underline cursor-pointer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {activity.state}
                    </a>
                ) : (
                    activity.state
                )}
            </div>
        )}

        {/* buttons */}
        {/* TODO: Uncomment when Discord API supports buttons */}
        {/* {activity.buttons &&
            activity.buttons.length > 0 && (
                <div className="flex gap-2 mt-2">
                    {activity.buttons.map((btn, idx) => (
                        <a
                            key={idx}
                            href={btn.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            {btn.label}
                        </a>
                    ))}
                </div>
        )} */}
    </div>
))
ActivityDetails.displayName = "ActivityDetails"

const ActivityFlagsComponent = memo(({
    activity
}: {
    activity: Activity
}) => {
    if (!activity.flags) return null

    return (
        <div className="mt-2 flex gap-1 flex-wrap">
            {Object.entries(ActivityFlags).map(
                ([name, bit]) =>
                    (activity.flags! & (bit as number)) !== 0 ? (
                        <span
                            key={name}
                            className="px-1 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                        >
                            {name.replace(/_/g, " ")}
                        </span>
                    ) : null
            )}
        </div>
    )
})
ActivityFlagsComponent.displayName = "ActivityFlagsComponent"

export const ActivityCard = memo(
    <T extends Activity>({
        activity,
        title,
        icon: Icon,
        showDetailsUrl = true,
        showLargeTextUrl = true,
        ...props
    }: ActivityCardProps<T>) => {
        const badges = []

        if (
            activity.timestamps &&
            "start" in activity.timestamps &&
            activity.timestamps.start
        ) {
            badges.push({
                text: `Started ${new Date(activity.timestamps.start).toLocaleTimeString()}`,
                variant: "outline" as const,
            })
        }

        if (activity.application_id) {
            badges.push({
                text: `App ID: ${activity.application_id}`,
                variant: "secondary" as const,
            })
        }

        if (activity.party?.size) {
            badges.push({
                text: `Party: ${activity.party.size[0]}/${activity.party.size[1]}`,
                variant: "outline" as const,
            })
        }

        return (
            <BaseActivityCard title={title} icon={Icon} {...props}>
                <div className="flex-1 flex flex-col justify-between">
                    {/* activity icon and info */}
                    <div className="flex gap-4 items-center">
                        <div className="flex-shrink-0 relative">
                            <ActivityIconWithTooltip
                                activity={activity}
                                fallbackIcon={Icon}
                                showLargeTextUrl={showLargeTextUrl}
                            />
                            <SmallActivityIconWithTooltip
                                activity={activity}
                                fallbackIcon={Icon}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <ActivityDetails
                                activity={activity}
                                showDetailsUrl={showDetailsUrl}
                            />
                            <ActivityFlagsComponent activity={activity} />
                        </div>
                    </div>

                    <div className="mt-3">
                        <ActivityBadges badges={badges} />
                    </div>
                </div>
            </BaseActivityCard>
        )
    }
)
ActivityCard.displayName = "ActivityCard"
