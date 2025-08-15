"use client"

import { useRouter } from "next/navigation"

import { useEffect, useRef } from "react"

interface UsePreloadPagesOptions {
    urls?: string[]
    enabled?: boolean
    delay?: number
}

// expose this because why not
export function preloadPage(
    url: string,
    router: ReturnType<typeof useRouter>,
    preloadedRef: React.RefObject<Set<string>>
) {
    router.prefetch(url)
    preloadedRef.current?.add(url)
}

export const usePreloadPages = ({
    urls = [],
    enabled = true,
    delay = 0,
}: UsePreloadPagesOptions = {}) => {
    const preloadedRef = useRef<Set<string>>(new Set())
    const router = useRouter()

    useEffect(() => {
        if (!enabled || urls.length === 0) return

        const timeoutId = setTimeout(() => {
            urls.forEach(url => {
                preloadPage(url, router, preloadedRef)
            })
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [urls, enabled, delay, router])

    return {
        // this could be used for ... idk; seems redundant but better to expose it than not
        isPreloaded: (url: string) => preloadedRef.current.has(url),
        // could be used for a on hover preload effect
        preloadNow: (url: string) => preloadPage(url, router, preloadedRef),
    }
}

export default usePreloadPages
