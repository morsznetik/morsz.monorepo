import { Badge } from "@morsz/ui/badge"
import { Button } from "@morsz/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@morsz/ui/card"
import { Input } from "@morsz/ui/input"
import { Separator } from "@morsz/ui/separator"
import { Skeleton } from "@morsz/ui/skeleton"
import Logo from "@morsz/ui/special/logo"
import { NavbarButton } from "@morsz/ui/special/navbar"
import { TextShimmerWave } from "@morsz/ui/text-shimmer-wave"
import { Home } from "lucide-react"

const demoText = "The quick brown fox jumps over the lazy dog."

const UIComponents = () => {
    return (
        <section className="space-y-12">
            <h2 className="font-bold tracking-tight">UI Components</h2>

            <div className="space-y-6">
                <h3>Buttons</h3>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="font-medium">Button Variants</h4>
                        <div className="flex flex-wrap gap-3">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium">Button Sizes</h4>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon">Icon</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium">Disabled States</h4>
                        <div className="flex flex-wrap gap-3">
                            <Button disabled>Disabled</Button>
                            <Button variant="secondary" disabled>
                                Disabled Secondary
                            </Button>
                            <Button variant="outline" disabled>
                                Disabled Outline
                            </Button>
                            <Button variant="ghost" disabled>
                                Disabled Ghost
                            </Button>
                            <Button variant="link" disabled>
                                Disabled Link
                            </Button>
                            <Button variant="destructive" disabled>
                                Disabled Destructive
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-medium">Input States</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Default Input
                                </label>
                                <Input placeholder="Type something..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    With Value
                                </label>
                                <Input defaultValue="Pre-filled content" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Disabled Input
                                </label>
                                <Input placeholder="Disabled input" disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    With Error
                                </label>
                                <Input
                                    placeholder="Error state"
                                    className="border-destructive"
                                />
                                <p className="text-sm text-destructive">
                                    This field is required
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium">Input Types</h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email Input
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Password Input
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Number Input
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Enter a number"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Search Input
                                </label>
                                <Input type="search" placeholder="Search..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Navbar buttons</h3>
                <p className="text-sm text-muted-foreground">
                    default, clicked, disabled
                    <br />
                    compact, compact clicked, compact disabled
                </p>
                <div className="flex flex-col gap-4 flex-wrap">
                    <div className="flex gap-4 flex-wrap">
                        <NavbarButton icon={<Home />} label="Home" href="/" />
                        <NavbarButton
                            icon={<Home />}
                            label="Home"
                            href="/"
                            clicked
                        />
                        <NavbarButton
                            icon={<Home />}
                            label="Home"
                            href="/"
                            disabled
                        />
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        <NavbarButton
                            icon={<Home />}
                            label="Home"
                            href="/"
                            compact
                        />
                        <NavbarButton
                            icon={<Home />}
                            label="Home"
                            href="/"
                            compact
                            clicked
                        />
                        <NavbarButton
                            icon={<Home />}
                            label="Home"
                            href="/"
                            compact
                            disabled
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Card</h3>
                <div className="flex gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Card content
                            </p>
                        </CardContent>
                        <CardFooter>
                            Footer here :3
                            <CardAction>
                                <Button size="sm">Card Action</Button>
                            </CardAction>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                These are pretty much universal
                            </CardTitle>
                            <CardDescription>
                                You can use them for anything
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            they&apos;re pretty cool, below is a card action in
                            the footer
                        </CardContent>
                        <CardFooter>
                            <CardAction>
                                <Button size="sm" variant="destructive">
                                    Explode
                                </Button>
                            </CardAction>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Badges</h3>
                <div className="space-y-4">
                    <h4 className="font-medium">Badge Variants</h4>
                    <div className="flex flex-wrap gap-3">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Skeletons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="font-medium">Text Skeletons</h4>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-medium">Component Skeletons</h4>
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-32 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                    <p>
                        both of these are the same element just with different
                        sizes
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Text shimmer</h3>
                <div className="space-y-4 flex flex-col gap-4">
                    Low distances, default duration
                    <TextShimmerWave zDistance={1} xDistance={1} yDistance={1}>
                        Short text...
                    </TextShimmerWave>
                    High distances, high duration, high spread
                    <TextShimmerWave
                        duration={2}
                        zDistance={15}
                        xDistance={3}
                        yDistance={-3}
                        spread={3}
                    >
                        Short text...
                    </TextShimmerWave>
                    Long texts
                    <TextShimmerWave>{"Default; " + demoText}</TextShimmerWave>
                    <TextShimmerWave duration={2}>
                        {"Duration: 2; " + demoText}
                    </TextShimmerWave>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Separators</h3>
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Content above the separator
                    </p>
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                        Content below the separator
                    </p>
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Other</h3>
                <div className="space-y-4">
                    <h4 className="font-medium">Logo</h4>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-12">
                            <Logo />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UIComponents
