import React from "react"

interface WarningWrapperProps {
    children: React.ReactNode
}

const WarningWrapper = ({ children }: WarningWrapperProps) => {
    return <div className="space-y-3 mb-4">{children}</div>
}

export default WarningWrapper
