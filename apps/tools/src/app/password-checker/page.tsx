"use client"

import { TableType, getStrength, hiveTable_5090, hiveTable_h200 } from "./utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@morsz/ui/card"
import { Input } from "@morsz/ui/input"
import { Label } from "@morsz/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@morsz/ui/toggle-group"
import { cn } from "@morsz/ui/utils"

import { useState } from "react"

const PasswordChecker = () => {
    const [pw, setPw] = useState("")
    const [tableType, setTableType] = useState<TableType>(TableType.H200)
    const table = tableType === TableType.H200 ? hiveTable_h200 : hiveTable_5090
    const strength = getStrength(pw, table)

    return (
        <div className="flex justify-center items-center min-h-screen bg-background">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-center">
                        Password Strength Checker
                    </CardTitle>
                    <CardDescription className="text-center">
                        Based on the{" "}
                        <a
                            href="https://www.hivesystems.com/blog/are-your-passwords-in-the-green?utm_source=header"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Hive Systems 2025 Password Table
                        </a>
                        .
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="flex justify-center items-center mb-2">
                        <ToggleGroup
                            type="single"
                            value={tableType}
                            onValueChange={v =>
                                v && setTableType(v as TableType)
                            }
                            className="flex justify-center items-center border mb-2"
                        >
                            <ToggleGroupItem
                                value={TableType.H200}
                                className="px-4 py-3 text-base"
                            >
                                H200
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value={TableType.RTX5090}
                                className="px-4 py-3 text-base"
                            >
                                RTX 5090
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Label htmlFor="pw" className="text-base">
                            Enter a password
                        </Label>
                        <Input
                            id="pw"
                            type="password"
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            value={pw}
                            onChange={e => setPw(e.target.value)}
                            placeholder="Type your password..."
                            className="mb-0 text-lg py-6 px-4 text-center max-w-xs"
                        />
                    </div>
                    {pw && (
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <div
                                className={cn(
                                    "rounded-lg px-6 py-4 flex flex-col items-center w-full border text-center",
                                    strength.color
                                )}
                            >
                                <span className="text-xl font-bold mb-1">
                                    {strength.label}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Estimated crack time: <b>{strength.time}</b>
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-4 bg-muted/40 rounded-md p-3">
                        <ul className="list-disc ml-4">
                            <li>
                                Use a mix of uppercase, lowercase, numbers, and
                                symbols
                            </li>
                            <li>Longer passwords are exponentially stronger</li>
                            <li>Never reuse passwords across sites</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PasswordChecker
