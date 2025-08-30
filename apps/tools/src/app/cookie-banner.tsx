"use client"

import UICookieBanner from "@morsz/ui/special/cookie-banner"
import { useCookieConsent } from "@/app/providers"

import React from "react"

const CookieBanner = () => {
    const { hasAcceptedCurrent, acceptCurrent, declineCurrent } = useCookieConsent()

    return (
        <UICookieBanner
            visible={!hasAcceptedCurrent}
            onAllow={acceptCurrent}
            onDecline={declineCurrent}
        />
    )
}

export default CookieBanner


