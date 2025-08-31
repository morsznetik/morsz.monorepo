"use client"

import { Badge } from "../badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../tooltip"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

import { useEffect, useState } from "react"

interface CommitInfo {
    current: string
    latest: string | null
    isLatest: boolean
    isLoading: boolean
    error: string | null
}

interface VersionIndicatorProps {
    repo: string
    app?: string
    currentCommitHash?: string
    currentCommitMessage?: string
    className?: string
}

const VersionIndicator = ({
    repo = "morsznetik/morsz.monorepo",
    app,
    currentCommitHash,
    currentCommitMessage,
    className = "",
}: VersionIndicatorProps) => {
    const isDevelopment = process.env.NODE_ENV === "development"
    const [commitInfo, setCommitInfo] = useState<CommitInfo>({
        current: currentCommitHash ?? "unknown",
        latest: null,
        isLatest: true,
        isLoading: true,
        error: null,
    })

    useEffect(() => {
        const fetchLatestCommit = async () => {
            try {
                // get latest commit from master branch filtered by app path
                const pathParam = app ? `&path=apps/${app}` : ""
                console.log(`https://api.github.com/repos/${repo}/commits?per_page=1${pathParam}`)
                const commitsResponse = await fetch(
                    `https://api.github.com/repos/${repo}/commits?per_page=1${pathParam}`,
                    {
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                        },
                    }
                )

                if (commitsResponse.ok) {
                    const commitsData = await commitsResponse.json()
                    if (commitsData.length > 0) {
                        const latestCommitHash = commitsData[0].sha
                        setCommitInfo(prev => ({
                            ...prev,
                            latest: latestCommitHash,
                            isLatest: latestCommitHash === currentCommitHash,
                            isLoading: false,
                        }))
                        return
                    }
                }

                // if the user is offline or something else goes wrong,
                // assume current commit is latest
                setCommitInfo(prev => ({
                    ...prev,
                    latest: currentCommitHash ?? null,
                    isLatest: true,
                    isLoading: false,
                }))
            } catch (error) {
                console.error("Failed to fetch commit info:", error)
                setCommitInfo(prev => ({
                    ...prev,
                    error: "Failed to check for updates",
                    isLoading: false,
                }))
            }
        }

        fetchLatestCommit()
    }, [repo, app, currentCommitHash])

    const getStatusIcon = () => {
        if (commitInfo.isLoading) {
            return <RefreshCw className="h-3 w-3 animate-spin" />
        }
        if (commitInfo.error) {
            return <AlertCircle className="h-3 w-3 text-yellow-500" />
        }
        return commitInfo.isLatest ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
            <AlertCircle className="h-3 w-3 text-orange-500" />
        )
    }

    const getTooltipContent = () => {
        if (commitInfo.isLoading) {
            return "Checking for updates..."
        }
        if (commitInfo.error) {
            return commitInfo.error
        }

        const commitHash = commitInfo.current.slice(0, 7)
        const appInfo = app ? ` for ${app} app` : ""
        const baseMessage = commitInfo.isLatest
            ? `You're on the latest commit${appInfo} (${commitHash})`
            : `Update available${appInfo}: ${commitInfo.latest?.slice(0, 7)} (current: ${commitHash})`

        if (currentCommitMessage) {
            return `${baseMessage}\n"${currentCommitMessage}"`
        }

        return baseMessage
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`fixed bottom-4 right-4 z-50 max-md:hidden ${className}`}
                    >
                        <Badge
                            variant="outline"
                            className={`cursor-pointer bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-colors ${
                                isDevelopment
                                    ? "border-purple-500/50 bg-purple-500/10"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {isDevelopment ? (
                                    <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                                ) : (
                                    getStatusIcon()
                                )}
                                <span className="text-xs font-mono">
                                    {isDevelopment
                                        ? "development"
                                        : commitInfo.current.slice(0, 7)}
                                </span>
                            </div>
                        </Badge>
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="font-mono text-xs whitespace-pre-line max-w-xs"
                >
                    {isDevelopment
                        ? "Development environment"
                        : getTooltipContent()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default VersionIndicator
