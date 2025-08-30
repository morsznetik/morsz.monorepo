import ByteSizeDisplay from "@/app/unicode/components/byte-size-count"
import CharacterDisplay from "@/app/unicode/components/character-display"
import CodeBlock from "@/app/unicode/components/codeblock"
import type { CharacterInfo } from "@/app/unicode/components/types"
import {
    getExternalLinksForChar,
    toUtf16,
} from "@/app/unicode/components/utils"
import getUnicodeName from "@/helpers/unicode-name"
import { Badge } from "@morsz/ui/badge"
import { Button } from "@morsz/ui/button"
import { Card, CardContent } from "@morsz/ui/card"
import CopyButton from "@morsz/ui/special/copy-button"
import { CodeXml, ExternalLink, Info, Tag, Trash2 } from "lucide-react"

import React from "react"

interface CharacterCardProps {
    charInfo: CharacterInfo
    index: number
    compactView: boolean
    onDelete: (index: number) => void
    onCopy: (text: string) => void
    fontFamily: string
}

const CharacterCard = ({
    charInfo,
    index,
    compactView,
    onDelete,
    onCopy,
    fontFamily,
}: CharacterCardProps) => {
    // Safety check for invalid character info
    if (!charInfo || !charInfo.char) {
        return null
    }

    const isGrapheme =
        charInfo.allCodePoints && charInfo.allCodePoints.length > 1

    return (
        <Card
            className={`bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md hover:z-10 w-full ${compactView ? "h-full" : ""}`}
        >
            {compactView ? (
                <CardContent className="p-3 h-full flex items-center gap-3">
                    {/* Character Display */}
                    <div
                        className={`flex-shrink-0 size-12 flex items-center justify-center rounded-lg border border-border`}
                    >
                        <span
                            className={`text-2xl ${fontFamily}`}
                            style={{ lineHeight: 1 }}
                            onClick={() => onCopy(charInfo.char)}
                        >
                            {charInfo.char}
                        </span>
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-brand-blue dark:text-brand-blue-light truncate flex items-center gap-1.5">
                                {charInfo.hexCodePoint}
                                <CopyButton
                                    text={charInfo.hexCodePoint}
                                    size={12}
                                    variant="inline"
                                    ariaLabel="Copy code point"
                                    copyOptions={{
                                        onSuccess: () =>
                                            onCopy(charInfo.hexCodePoint),
                                    }}
                                />
                            </h3>
                            <ByteSizeDisplay
                                byteSize={charInfo.byteSize || 0}
                                compact={true}
                            />
                        </div>

                        <p className="text-foreground text-xs max-w-full overflow-hidden mt-0.5">
                            {charInfo.name ? (
                                charInfo.name.includes("<span") ? (
                                    <span
                                        className="inline-block max-w-full overflow-hidden text-ellipsis"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                charInfo.name.length > 35
                                                    ? charInfo.name.substring(
                                                          0,
                                                          35
                                                      ) + "..."
                                                    : charInfo.name,
                                        }}
                                    />
                                ) : (
                                    <span className="inline-block max-w-full overflow-hidden text-ellipsis">
                                        {charInfo.name.length > 25
                                            ? charInfo.name.substring(0, 25) +
                                              "..."
                                            : charInfo.name}
                                    </span>
                                )
                            ) : (
                                "Unknown"
                            )}
                        </p>

                        {/* Tags */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {isGrapheme && (
                                <Badge
                                    variant="secondary"
                                    className="text-xs text-emerald-500 bg-emerald-500/20 border-emerald-500/30"
                                >
                                    Grapheme
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                        <Button
                            onClick={() => onDelete(index)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete character"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            ) : (
                // Detailed View (unchanged)
                <CardContent>
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-center">
                            <CharacterDisplay
                                char={charInfo.char}
                                onCopy={onCopy}
                                compactView={compactView}
                                fontFamily={fontFamily}
                            />
                            <div className="flex-grow min-w-0 pl-6">
                                <div className="flex justify-self-start items-center gap-2">
                                    <h3 className="text-lg md:text-xl font-semibold text-brand-blue dark:text-brand-blue-light truncate">
                                        {charInfo.hexCodePoint}
                                    </h3>
                                    <ByteSizeDisplay
                                        byteSize={charInfo.byteSize || 0}
                                    />
                                </div>
                                <p className="text-foreground text-sm md:text-base mt-1">
                                    Decimal: {charInfo.codePoint}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-1.5 md:gap-2 ml-2">
                                <Badge
                                    variant="secondary"
                                    className="hidden md:inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm truncate max-w-[350px]"
                                >
                                    {isGrapheme
                                        ? "Grapheme"
                                        : charInfo.block || "Unknown"}
                                </Badge>
                                <Button
                                    onClick={() => onDelete(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 md:h-10 md:w-10 p-0 text-muted-foreground hover:text-destructive/10 flex-shrink-0"
                                    title="Delete character"
                                >
                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Character Details - Only show if not in compact view */}
                        <div className="p-4 md:p-5 space-y-4 md:space-y-5">
                            {/* Properties & Resources in 2 columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                {/* Properties Section */}
                                <div className="space-y-2.5">
                                    <h4 className="text-base md:text-lg font-medium text-brand-purple-light flex items-center gap-1.5">
                                        <Tag className="w-4 h-4 md:w-5 md:h-5" />
                                        Properties
                                    </h4>
                                    <div className="bg-muted/50 p-3 md:p-4 rounded-md md:rounded-lg shadow-inner border border-border">
                                        <dl className="space-y-2 md:space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-start gap-1.5 sm:gap-3">
                                                <dt className="text-brand-purple-light text-xs md:text-sm sm:col-span-1">
                                                    Name:
                                                </dt>
                                                <dd className="text-foreground text-sm md:text-base font-medium break-words sm:col-span-2 min-w-0">
                                                    {charInfo.name ? (
                                                        charInfo.name.includes("<span") ? (
                                                            <span
                                                                className="inline-block w-full break-words"
                                                                dangerouslySetInnerHTML={{ __html: charInfo.name }}
                                                            />
                                                        ) : (
                                                            <span className="inline-block w-full break-words">
                                                                {charInfo.name}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span>Unknown</span>
                                                    )}
                                                </dd>
                                            </div>
                                            {charInfo.category && (
                                                <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-start gap-1.5 sm:gap-3">
                                                    <dt className="text-brand-purple-light text-xs md:text-sm sm:col-span-1">
                                                        Category:
                                                    </dt>
                                                    <dd className="text-foreground text-sm md:text-base sm:col-span-2 break-words">
                                                        {charInfo.category}
                                                    </dd>
                                                </div>
                                            )}
                                            {charInfo.block && (
                                                <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-start gap-1.5 sm:gap-3">
                                                    <dt className="text-brand-purple-light text-xs md:text-sm sm:col-span-1">
                                                        Block:
                                                    </dt>
                                                    <dd className="text-foreground text-sm md:text-base sm:col-span-2 break-words">
                                                        {charInfo.block}
                                                    </dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                </div>

                                {/* External Resources Section */}
                                <div className="space-y-2.5">
                                    <h4 className="text-base md:text-lg font-medium text-brand-blue-light flex items-center gap-1.5">
                                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                                        External Resources
                                    </h4>
                                    <div className="bg-muted/40 md:bg-muted/50 p-3 md:p-4 rounded-md md:rounded-lg border border-border">
                                        <div className="flex flex-wrap gap-2">
                                            {getExternalLinksForChar(
                                                charInfo.codePoint
                                            ).map((link, linkIndex) => (
                                                <a
                                                    key={linkIndex}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2.5 py-1.5 bg-muted/50 hover:bg-muted rounded-md text-xs md:text-sm text-foreground hover:text-foreground flex items-center gap-1.5 border border-border transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                    {link.name}
                                                </a>
                                            ))}
                                        </div>
                                        {isGrapheme && (
                                            <p className="mt-3 text-xs text-muted-foreground italic flex items-start gap-1.5">
                                                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    These links will lead to the{" "}
                                                    {getUnicodeName(
                                                        charInfo.codePoint
                                                    ) || "base"}{" "}
                                                    unicode character, not the
                                                    entire grapheme cluster.
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Technical Information Section */}
                            <div className="space-y-2.5">
                                <h4 className="text-base md:text-lg font-medium text-brand-blue-light flex items-center gap-1.5">
                                    <CodeXml className="w-4 h-4 md:w-5 md:h-5" />
                                    Encodings
                                </h4>
                                <div className="bg-muted/40 md:bg-muted/50 p-3 md:p-4 rounded-md md:rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 border border-border">
                                    {isGrapheme ? (
                                        <>
                                            <div className="md:col-span-3">
                                                <CodeBlock
                                                    label="All Code Points in Grapheme Cluster"
                                                    code={
                                                        charInfo.allHexCodePoints?.join(
                                                            " "
                                                        ) || ""
                                                    }
                                                    onCopy={onCopy}
                                                />
                                            </div>
                                            <CodeBlock
                                                label="HTML Entity"
                                                code={
                                                    charInfo.allCodePoints
                                                        ?.map(cp => `&#${cp};`)
                                                        .join("") || ""
                                                }
                                                onCopy={onCopy}
                                            />
                                            <CodeBlock
                                                label="JavaScript"
                                                code={
                                                    charInfo.allCodePoints
                                                        ?.map(cp => {
                                                            return toUtf16(cp)
                                                                .map(
                                                                    part =>
                                                                        `\\u${part}`
                                                                )
                                                                .join("")
                                                        })
                                                        .join("") || ""
                                                }
                                                onCopy={onCopy}
                                            />
                                            <CodeBlock
                                                label="CSS"
                                                code={
                                                    charInfo.allCodePoints
                                                        ?.map(
                                                            cp =>
                                                                `\\${cp.toString(16)}`
                                                        )
                                                        .join("") || ""
                                                }
                                                onCopy={onCopy}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <CodeBlock
                                                label="HTML Entity"
                                                code={`&#${charInfo.codePoint};`}
                                                onCopy={onCopy}
                                            />
                                            <CodeBlock
                                                label="JavaScript"
                                                code={charInfo.char
                                                    .split("")
                                                    .map(unit => {
                                                        const utf16Parts =
                                                            toUtf16(
                                                                unit.codePointAt(
                                                                    0
                                                                ) ||
                                                                    unit.charCodeAt(
                                                                        0
                                                                    )
                                                            )
                                                        return utf16Parts
                                                            .map(
                                                                part =>
                                                                    `\\u${part}`
                                                            )
                                                            .join("")
                                                    })
                                                    .join("")}
                                                onCopy={onCopy}
                                            />
                                            <CodeBlock
                                                label="CSS"
                                                code={`\\${charInfo.codePoint.toString(16)}`}
                                                onCopy={onCopy}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default CharacterCard
