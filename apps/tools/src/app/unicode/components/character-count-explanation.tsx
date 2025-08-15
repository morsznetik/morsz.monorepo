import { Button } from "@morsz/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@morsz/ui/tooltip"
import { Info } from "lucide-react"

import React from "react"

const CharacterCountExplanation = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
                        aria-label="Character count explanation"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-background/90 border border-border rounded-lg shadow-lg z-10 p-3">
                    <div className="text-xs text-foreground space-y-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-brand"></div>
                            <strong className="text-brand">Characters:</strong>
                            <span>
                                Actual Unicode characters (grapheme clusters)
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-brand-reverse"></div>
                            <strong className="text-brand-reverse">
                                Code Units:
                            </strong>
                            <span>
                                JavaScript&apos;s string.length (UTF-16 code
                                units)
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-emerald-500">Bytes:</span>
                            <span>UTF-8 encoded byte size</span>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default CharacterCountExplanation
