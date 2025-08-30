"use client"

import CharacterCard from "@/app/unicode/components/character-card"
import CharacterCountExplanation from "@/app/unicode/components/character-count-explanation"
import CharacterSpawner from "@/app/unicode/components/character-spawner"
import Dropdown from "@/app/unicode/components/dropdown"
import ToggleGroup from "@/app/unicode/components/toggle-group"
import type { CharacterInfo } from "@/app/unicode/components/types"
import {
    getUnicodeBlock,
    getUnicodeCategory,
    isEmojiCharacter,
} from "@/app/unicode/components/utils"
import AnimatedWarnings from "@/app/unicode/components/warnings"
import getUnicodeName from "@/helpers/unicode-name"
import { Alert, AlertDescription } from "@morsz/ui/alert"
import { Badge } from "@morsz/ui/badge"
import { Button } from "@morsz/ui/button"
import { Card, CardContent } from "@morsz/ui/card"
import { Input } from "@morsz/ui/input"
import "@morsz/ui/styles/unicode-fonts"
import { Textarea } from "@morsz/ui/textarea"
import GraphemeSplitter from "grapheme-splitter"
import {
    GripVertical,
    Info,
    LineSquiggle,
    Menu,
    Paperclip,
    Search,
    Sparkles,
    Type,
    Upload,
    X,
} from "lucide-react"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

const UnicodeInspector = () => {
    // useState ftw (i dont wanna learn zustand yet)
    const [input, setInput] = useState<string>("")
    const [characters, setCharacters] = useState<CharacterInfo[]>([])
    const [groupMode, setGroupMode] = useState<boolean>(false)
    const [searchFilter, setSearchFilter] = useState<string>("")
    const [compactView, setCompactView] = useState<boolean>(false)
    const [selectedFont, setSelectedFont] = useState<string>("font-default")
    const [showRgiWarning, setShowRgiWarning] = useState<boolean>(false)
    const [customFont, setCustomFont] = useState<string | null>(null)
    const [customFontName, setCustomFontName] = useState<string>("Custom Font")
    const [customFontError, setCustomFontError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // do we really need to memoize this?
    // maybe, but we shouldnt be changing it too often
    const fontOptions = useMemo(() => {
        const options = [
            {
                value: "font-system",
                label: <span className="inline font-system">System</span>,
            },
            {
                value: "font-default",
                label: <span className="inline">0xProto</span>,
            },
            {
                value: "font-gnu-unifont",
                label: (
                    <span className="inline font-gnu-unifont">GNU Unifont</span>
                ),
            },
            {
                value: "font-noto-sans",
                label: <span className="inline font-noto-sans">Noto Sans</span>,
            },
            {
                value: "font-gg-sans",
                label: <span className="inline font-gg-sans">ggSans</span>,
            },
        ]

        if (customFont) {
            options.push({
                value: "font-custom",
                label: (
                    <span
                        className="flex items-center gap-1.5"
                        style={{ fontFamily: "CustomFont" }}
                    >
                        {customFontName}
                    </span>
                ),
            })
        } else {
            options.push({
                value: "font-custom-upload",
                label: (
                    <span className="flex items-center gap-1.5 text-primary">
                        <Upload className="w-3.5 h-3.5" />
                        Upload Font
                    </span>
                ),
            })
        }

        return options
    }, [customFont, customFontName])

    // CSSOM hax to inject the custom font
    // is this even a hack? im not sure
    useEffect(() => {
        if (!customFont) return
    
        const font = new FontFace('CustomFont', `url(${customFont})`)
        document.fonts.add(font)
    
        font.load().then(() => {
          document.body.classList.add('font-custom')
        })
    
        return () => {
          document.fonts.delete(font)
          document.body.classList.remove('font-custom')
        }
      }, [customFont])

    // toggle group options for view mode
    const viewModeOptions = [
        {
            value: "detailed",
            label: (
                <span className="flex items-center justify-center gap-1.5">
                    <LineSquiggle className="w-3.5 h-3.5" />
                    Detailed
                </span>
            ),
        },
        {
            value: "compact",
            label: (
                <span className="flex items-center justify-center gap-1.5">
                    <Menu className="w-3.5 h-3.5" />
                    Compact
                </span>
            ),
        },
    ]

    // toggle group options for character mode
    const characterModeOptions = [
        {
            value: "individual",
            label: (
                <span className="flex items-center justify-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    Individual
                </span>
            ),
        },
        {
            value: "grapheme",
            label: (
                <span className="flex items-center justify-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5" />
                    Grapheme
                </span>
            ),
        },
    ]

    const getCharacterName = useCallback(
        (input: number | string): string | null => {
            if (!input) return null

            try {
                if (typeof input === "string") {
                    const name = getUnicodeName(input)
                    if (name !== undefined) {
                        return name
                    }

                    const codePoint = input.codePointAt(0) || 0
                    const fallbackName = getUnicodeName(codePoint)

                    // raw html bad
                    if (fallbackName !== undefined) {
                        return `${fallbackName} <span class="text-xs italic text-muted-foreground">+ additional characters</span>`
                    }
                    return null
                } else {
                    const name = getUnicodeName(input)
                    return name === undefined ? null : name
                }
            } catch {
                return null
            }
        },
        []
    )

    // the show must go on
    useEffect(() => {
        if (!input) {
            setCharacters([])
            return
        }

        try {
            let units: string[]
            if (groupMode) {
                units = new GraphemeSplitter().splitGraphemes(input)
            } else {
                units = Array.from(input)
            }

            const chars = units
                .map(char => {
                    if (!char) return null

                    const codePoint = char.codePointAt(0) || 0
                    const byteSize = new TextEncoder().encode(char).length

                    const allCodePoints: number[] = []
                    const allHexCodePoints: string[] = []
                    let categoryInfo = null
                    let blockInfo = null

                    // if we are grouping by grapheme, we need to get all the code points
                    if (groupMode && char.length > 1) {
                        for (let i = 0; i < char.length; i++) {
                            const cp = char.codePointAt(i)
                            if (cp !== undefined) {
                                // if we are in a surrogate pair, we need to skip it
                                if (
                                    i > 0 &&
                                    0xd800 <= char.charCodeAt(i - 1) &&
                                    char.charCodeAt(i - 1) <= 0xdbff &&
                                    0xdc00 <= char.charCodeAt(i) &&
                                    char.charCodeAt(i) <= 0xdfff
                                ) {
                                    continue
                                }
                                allCodePoints.push(cp)
                                allHexCodePoints.push(
                                    `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`
                                )
                            }
                        }
                        categoryInfo = null
                        blockInfo = null
                    } else {
                        // otherwise, we can get the category and block
                        categoryInfo = getUnicodeCategory(codePoint)
                        blockInfo = getUnicodeBlock(codePoint)
                    }

                    return {
                        char,
                        codePoint,
                        hexCodePoint: `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
                        name: groupMode
                            ? getCharacterName(char)
                            : getCharacterName(codePoint),
                        category: categoryInfo,
                        block: blockInfo,
                        byteSize,
                        allCodePoints:
                            allCodePoints.length > 0
                                ? allCodePoints
                                : undefined,
                        allHexCodePoints:
                            allHexCodePoints.length > 0
                                ? allHexCodePoints
                                : undefined,
                        isEmoji: isEmojiCharacter(char),
                    }
                })
                .filter(Boolean) as CharacterInfo[]

            setCharacters(chars)
            setShowRgiWarning(chars.some(c => c.isEmoji))
        } catch (error) {
            console.error("Error processing input:", error)
            setCharacters([])
            setShowRgiWarning(false)
        }
    }, [input, groupMode, getCharacterName])

    // handle input change for the textarea
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setInput(e.target.value)
        },
        []
    )

    // handle clear input for the textarea
    const handleClearInput = useCallback(() => {
        setInput("")
    }, [])

    // handle search filter change for the input
    const handleSearchFilterChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.toLowerCase()
            setSearchFilter(value)
        },
        []
    )

    // handle delete character for the character card
    const handleDeleteCharacter = useCallback((index: number) => {
        setCharacters(prevCharacters => {
            const newCharacters = [...prevCharacters]
            newCharacters.splice(index, 1)

            const newInput = newCharacters.map(c => c.char).join("")
            setInput(newInput)

            return newCharacters
        })
    }, [])

    // we probably should want a library for these kinds of things
    // TODO: above
    const handleCopyToClipboard = useCallback((text: string) => {
        if (!text) return

        navigator.clipboard
            .writeText(text)
            .then(() => {
                // could add a toast notification here
                // vanilla.js ftw
                const flashElement = document.getElementById("copy-flash")
                if (flashElement) {
                    flashElement.classList.remove("opacity-0")
                    flashElement.classList.add("opacity-100")

                    setTimeout(() => {
                        flashElement.classList.remove("opacity-100")
                        flashElement.classList.add("opacity-0")
                    }, 1500)
                }
            })
            .catch(error => {
                console.error("Failed to copy text:", error)
            })
    }, [])

    const handleGroupModeChange = useCallback((value: string) => {
        setGroupMode(value === "grapheme")
    }, [])

    const handleViewModeChange = useCallback((value: string) => {
        setCompactView(value === "compact")
    }, [])

    const handleFontChange = useCallback((value: string) => {
        if (value === "font-custom-upload") {
            // Trigger file input click
            if (fileInputRef.current) {
                fileInputRef.current.click()
            }
            return
        }
        setSelectedFont(value)
    }, [])

    const handleFontUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            // check if the file has an extension that has wide browser support
            const validExtensions = [".woff", ".woff2", ".ttf", ".otf"]
            const fileExtension = file.name
                .substring(file.name.lastIndexOf("."))
                .toLowerCase()

            if (!validExtensions.includes(fileExtension)) {
                setCustomFontError(
                    `Unsupported font format. Please upload a font in one of these formats: ${validExtensions.join(", ")}`
                )
                return
            }

            // create blob
            const objectUrl = URL.createObjectURL(file)
            setCustomFont(objectUrl)

            // get the font name & set it
            const fontName = file.name.substring(0, file.name.lastIndexOf("."))
            setCustomFontName(fontName)

            // set the selected font to custom
            setSelectedFont("font-custom")
            setCustomFontError(null)

            // reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        },
        []
    )

    const handleCharacterSpawn = useCallback((char: string) => {
        setInput(prev => prev + char)
    }, [])

    const filteredCharacters = !searchFilter
        ? characters
        : characters.filter(charInfo => {
              if (!charInfo) return false
              const normalizedFilter = searchFilter.toLowerCase().trim()
              const plainName = charInfo.name
                  ? charInfo.name.replace(/<[^>]*>/g, "")
                  : ""
              return (
                  charInfo.char.toLowerCase().includes(normalizedFilter) ||
                  charInfo.hexCodePoint
                      .toLowerCase()
                      .includes(normalizedFilter) ||
                  (plainName &&
                      plainName.toLowerCase().includes(normalizedFilter)) ||
                  (charInfo.category &&
                      charInfo.category
                          .toLowerCase()
                          .includes(normalizedFilter)) ||
                  (charInfo.block &&
                      charInfo.block.toLowerCase().includes(normalizedFilter))
              )
          })

    const inputByteSize = input ? new TextEncoder().encode(input).length : 0

    const hasCharacters = characters.length > 0
    const hasFilteredCharacters = filteredCharacters.length > 0
    const showNoCharactersMessage = hasCharacters && !hasFilteredCharacters

    // we honestly should have a virtual infinite scroll here to improve performance
    // if you have more than ~300 characters, it will start to lag BADLY
    // its probably like 50mb of raw html in the dom
    return (
        <div className="grow flex flex-col p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6">
                {/* input for the font upload (hidden so you can just drag something onto the page) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFontUpload}
                    accept=".woff,.woff2,.ttf,.otf"
                    className="hidden"
                    aria-label="Upload custom font"
                />
                {/* Header */}
                <header className="text-center space-y-2 sm:space-y-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple dark:from-brand-blue-light dark:to-brand-purple-light bg-clip-text text-transparent flex items-center justify-center gap-3">
                        <Type className="w-8 h-8 text-brand-blue dark:text-brand-blue-light" />
                        Unicode Character Inspector
                        <Sparkles className="w-8 h-8 text-brand-purple dark:text-brand-purple-light" />
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-base sm:text-sm px-2">
                        Paste text to inspect Unicode characters and their
                        properties
                    </p>
                </header>
                {customFontError && (
                    <Alert className="relative border-destructive/50 bg-destructive/10 backdrop-blur-sm">
                        <Button
                            onClick={() => setCustomFontError(null)}
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 right-3 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            aria-label="Close error"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Info className="h-5 w-5 text-destructive" />
                        <AlertDescription>
                            <h3 className="text-lg font-semibold text-destructive mb-1">
                                Font Upload Error
                            </h3>
                            <p className="text-foreground text-sm">
                                {customFontError}
                            </p>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Input Section */}
                <Card className="bg-card rounded-xl border border-border shadow-sm">
                    <CardContent className="space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <span className="text-lg sm:text-base font-medium text-brand-blue dark:text-brand-blue-light">
                                Input Text
                            </span>
                            {input && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs text-brand bg-brand/20 border-brand/30"
                                        >
                                            {Array.from(input).length}{" "}
                                            {Array.from(input).length === 1
                                                ? "character"
                                                : "characters"}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs text-brand-reverse bg-brand-reverse/20 border-brand-reverse/30"
                                        >
                                            {input.length}{" "}
                                            {input.length === 1
                                                ? "code unit"
                                                : "code units"}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs text-emerald-500 bg-emerald-500/20 border-emerald-500/30"
                                        >
                                            {inputByteSize} bytes
                                        </Badge>
                                        <CharacterCountExplanation />
                                    </div>
                                </div>
                            )}
                        </div>
                        <AnimatedWarnings
                            input={input}
                            showRgiWarning={showRgiWarning}
                        />
                        <div className="relative">
                            <Textarea
                                value={input}
                                onChange={handleInputChange}
                                className="resize-none h-32 sm:h-40 md:h-48 text-base"
                                placeholder="Paste text with Unicode characters to inspect..."
                            />
                            {input && (
                                <Button
                                    onClick={handleClearInput}
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-3 top-3 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                    aria-label="Clear input"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Character Spawner */}
                <CharacterSpawner
                    onSpawn={handleCharacterSpawn}
                    selectedFont={selectedFont}
                />

                {/* Character Details */}
                <div className={`space-y-6 ${!hasCharacters && "hidden"}`}>
                    <div className="space-y-4 md:space-y-5">
                        <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-blue dark:text-brand-blue-light">
                                Character Analysis
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <ToggleGroup
                                options={characterModeOptions}
                                value={groupMode ? "grapheme" : "individual"}
                                onChange={handleGroupModeChange}
                                label="Character Mode"
                                className="w-full"
                            />
                            <ToggleGroup
                                options={viewModeOptions}
                                value={compactView ? "compact" : "detailed"}
                                onChange={handleViewModeChange}
                                label="View Mode"
                                className="w-full"
                            />
                            <Dropdown
                                options={fontOptions}
                                value={selectedFont}
                                onChange={handleFontChange}
                                label="Display Font"
                                className="w-full"
                            />
                            <div className="flex flex-col w-full min-w-0 col-span-2 lg:col-span-1 justify-between">
                                <div className="flex flex-row flex-wrap justify-between items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Search
                                    </span>
                                    {searchFilter && (
                                        <Button
                                            onClick={() => setSearchFilter("")}
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        type="text"
                                        placeholder="Search characters..."
                                        value={searchFilter}
                                        onChange={handleSearchFilterChange}
                                        className="pr-10 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* No search results message */}
                        {showNoCharactersMessage && (
                            <div className="py-10 text-center">
                                <div className="inline-block p-3 rounded-full bg-muted/60 mb-3">
                                    <Search className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground mb-1">
                                    No matching characters
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    No characters match your search filter. Try
                                    adjusting your search terms or clear the
                                    filter.
                                </p>
                            </div>
                        )}

                        {/* Character grid/list */}
                        {hasFilteredCharacters && (
                            <div
                                className={`${
                                    compactView
                                        ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                                        : "flex flex-col gap-3 sm:gap-4"
                                }`}
                            >
                                {filteredCharacters.map((charInfo, index) => (
                                    <CharacterCard
                                        key={`${charInfo.codePoint}-${index}`}
                                        charInfo={charInfo}
                                        index={index}
                                        compactView={compactView}
                                        onDelete={handleDeleteCharacter}
                                        onCopy={handleCopyToClipboard}
                                        fontFamily={selectedFont}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnicodeInspector
