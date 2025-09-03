"use client"

import { Badge } from "../badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../tooltip"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

import { useCallback, useEffect, useState } from "react"

interface CommitInfo {
    current: string
    latest: string | null
    isLatest: boolean
    isLoading: boolean
    error: string | null
}

interface VersionIndicatorProps {
    repo: string
    app: string
    currentCommitHash?: string
    currentCommitMessage?: string
    className?: string
    dependencies?: string[]
}

interface CachedCommitData {
    commitHash: string
    timestamp: number
    app: string
}

const CACHE_KEY = "commit_cache"

const VersionIndicator = ({
    repo = "morsznetik/morsz.monorepo",
    app,
    currentCommitHash,
    currentCommitMessage,
    className = "",
    dependencies,
}: VersionIndicatorProps) => {
    const isDevelopment = process.env.NODE_ENV === "development"

    const getCachedData = useCallback((): CachedCommitData | null => {
        if (typeof window === "undefined") return null
        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return null
            const data: CachedCommitData = JSON.parse(cached)
            if (data.app !== app) {
                localStorage.removeItem(CACHE_KEY)
                return null
            }
            return data
        } catch {
            return null
        }
    }, [app])

    const setCachedData = useCallback(
        (commitHash: string) => {
            if (typeof window === "undefined") return
            try {
                const data: CachedCommitData = {
                    commitHash,
                    timestamp: Date.now(),
                    app,
                }
                localStorage.setItem(CACHE_KEY, JSON.stringify(data))
            } catch {
                // silently
            }
        },
        [app]
    )

    // compute the paths that should trigger updates for this app
    const getWatchedPaths = useCallback((): string[] => {
        const paths = [`apps/${app}`]

        const sharedPackages = ["ui", "tailwind-config"]
        sharedPackages.forEach(pkg => {
            paths.push(`packages/${pkg}`)
        })

        // add any additional dependencies if explicitly provided
        if (dependencies) {
            dependencies.forEach(dep => {
                if (!sharedPackages.includes(dep)) {
                    paths.push(`packages/${dep}`)
                }
            })
        }

        return paths
    }, [app, dependencies])

    const [commitInfo, setCommitInfo] = useState<CommitInfo>(() => {
        return {
            current: currentCommitHash ?? "unknown",
            latest: null,
            isLatest: true, // assume it's latest
            isLoading: false,
            error: null,
        }
    })

    useEffect(() => {
        const fetchLatestCommit = async () => {
            const cached = getCachedData()

            // if we have recent cached data (less than 5 minutes old), don't fetch
            if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
                setCommitInfo(prev => ({
                    ...prev,
                    latest: cached.commitHash,
                    isLatest: cached.commitHash === currentCommitHash,
                    isLoading: false,
                }))
                return
            }

            setCommitInfo(prev => ({
                ...prev,
                isLoading: true,
                error: null,
            }))

            try {
                const watchedPaths = getWatchedPaths()
                let latestCommitHash: string | null = null
                let latestCommitDate = new Date(0)

                for (const path of watchedPaths) {
                    const commitsResponse = await fetch(
                        `https://api.github.com/repos/${repo}/commits?per_page=1&path=${path}`,
                        {
                            headers: {
                                Accept: "application/vnd.github.v3+json",
                            },
                        }
                    )

                    if (commitsResponse.ok) {
                        const commitsData = await commitsResponse.json()
                        if (commitsData.length > 0) {
                            const commit = commitsData[0]
                            const commitDate = new Date(
                                commit.commit.committer.date
                            )

                            // what's the most recent commit?
                            if (commitDate > latestCommitDate) {
                                latestCommitDate = commitDate
                                latestCommitHash = commit.sha
                            }
                        }
                    }
                }

                if (latestCommitHash) {
                    setCachedData(latestCommitHash)
                    setCommitInfo(prev => ({
                        ...prev,
                        latest: latestCommitHash,
                        isLatest: latestCommitHash === currentCommitHash,
                        isLoading: false,
                    }))
                    return
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
    }, [
        repo,
        app,
        currentCommitHash,
        dependencies,
        getCachedData,
        getWatchedPaths,
        setCachedData,
    ])

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
            return (
                <div className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Checking for updates...</span>
                </div>
            )
        }
        if (commitInfo.error) {
            return (
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    <span>{commitInfo.error}</span>
                </div>
            )
        }

        const commitHash = commitInfo.current.slice(0, 7)
        const isLatest = commitInfo.isLatest

        return (
            <div className="space-y-2 min-w-[200px]">
                <div className="flex items-center gap-2">
                    {isLatest ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="font-medium">
                        {isLatest ? "Up to date" : "Update available"}
                    </span>
                </div>

                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">App:</span>
                        <span className="font-mono">{app}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Current:</span>
                        <span className="font-mono">{commitHash}</span>
                    </div>
                                    {!isLatest && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Latest:
                        </span>
                        <span className="font-mono">
                            {commitInfo.latest?.slice(0, 7)}
                        </span>
                    </div>
                )}
                
                {!isLatest && (
                    <div className="pt-2 border-t border-border/50">
                        <div className="text-xs text-muted-foreground">
                            If refresh doesn't update, the latest build may be failing.
                        </div>
                    </div>
                )}
                </div>

                {currentCommitMessage && (
                    <div className="pt-2 border-t border-border/50">
                        <div className="text-xs text-muted-foreground mb-1">
                            Commit message:
                        </div>
                        <div className="text-xs italic">
                            &ldquo;{currentCommitMessage}&rdquo;
                        </div>
                    </div>
                )}
            </div>
        )
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
                                    <div className="font-bold">
                                        {getStatusIcon()}
                                    </div>
                                )}
                                <span className="text-xs text-muted-foreground font-mono">
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
                    className="font-mono text-xs max-w-xs p-3"
                >
                    {isDevelopment ? (
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                            <span>Development environment</span>
                        </div>
                    ) : (
                        getTooltipContent()
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default VersionIndicator
