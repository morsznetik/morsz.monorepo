import Logo from "@morsz/ui/special/logo"
import ToolCard, { ToolCardProps } from "@morsz/ui/special/tool-card"
import { obviously } from "@morsz/ui/styles/fonts"
import {
    CodeXml,
    Cpu,
    Diff,
    ForkKnife,
    ForkKnifeCrossed,
    Image as ImageIcon,
    // jsx-a11y/alt-text gets pissed off if you use the name Image
    KeyRound,
    Languages,
    LetterText,
    Palette,
    Play,
    Search,
    Type,
} from "lucide-react"
import type { Metadata } from "next"

const tools = [
    {
        title: "Unicode Inspector",
        description: "inspect unicode characters and their properties",
        icon: <Search className="h-6 w-6" />,
        href: "/unicode",
        color: "bg-green-500/10 text-green-700 dark:text-green-300",
    },
    {
        title: "PyPlayer",
        description: "an ansi text video player in the terminal",
        icon: <Play className="h-6 w-6" />,
        href: "https://github.com/morsznetik/PyPlayer",
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    },
    {
        title: "Sample Slicer",
        description: "evenly slice samples, made for a friend",
        icon: <ForkKnife className="h-6 w-6" />,
        href: "https://github.com/morsznetik/sample-slicer",
        color: "bg-red-500/10 text-red-700 dark:text-red-300",
    },
    {
        title: "Polish Latin to Cyrillic",
        description:
            "convert polish latin to cyrillic, made for, and with the help of, a friend",
        icon: <Languages className="h-6 w-6" />,
        href: "/polish-latin-to-cyrillic",
        color: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
    },
    {
        title: "Password Strength",
        description: "check a password's strength, data via HiveSystems",
        icon: <KeyRound className="h-6 w-6" />,
        href: "/password-checker",
        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    },
    {
        // always make this one last
        title: "Component Gallery",
        description: "design, colors, and components used across this site",
        icon: <Type className="h-6 w-6" />,
        href: "/typography",
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
]

const upcomingTools = [
    {
        title: "Unicode Ascii Tags",
        description: "convert ascii into unicode tags (ie. invisible text)",
        icon: <LetterText className="h-6 w-6" />,
        color: "bg-green-500/10 text-green-700 dark:text-green-300",
    },
    {
        title: "Diff Checker",
        description: "check the difference between two files",
        icon: <Diff className="h-6 w-6" />,
        href: "/diff-checker",
        color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
        title: "Color Palette Generator",
        description: "create and export color schemes",
        icon: <Palette className="h-6 w-6" />,
        color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    },
    {
        title: "Color Inspector",
        description: "inspect color values and their properties",
        icon: <Palette className="h-6 w-6" />,
        href: "/color",
        color: "bg-green-500/10 text-green-700 dark:text-green-300",
    },
]

const featuredTools = [
    {
        title: "cobalt.tools",
        description:
            "a media downloader that doesn't piss you off, and the inspiration behind this site's design",
        credits: {
            name: "imput",
            link: "https://github.com/imputnet",
            source: "https://github.com/imputnet/cobalt",
            authors: [
                {
                    name: "and contributors",
                    link: "https://github.com/imputnet/cobalt/graphs/contributors",
                },
            ],
        },
        icon: <Palette className="h-6 w-6" />,
        href: "https://cobalt.tools",
        color: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
        title: "CyberChef",
        description:
            "*the* tool messing around with encryption, encoding, decoding, and data analysis",
        credits: {
            name: "the GCHQ",
            link: "https://github.com/gchq",
            source: "https://github.com/gchq/CyberChef",
            authors: [
                {
                    name: "and contributors",
                    link: "https://github.com/gchq/CyberChef/graphs/contributors",
                },
            ],
        },
        icon: <ForkKnifeCrossed className="h-6 w-6" />,
        href: "https://cobalt.tools",
        color: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    },
    {
        title: "carbon",
        description: "create beautiful images of your code",
        credits: {
            name: "the carbon team",
            link: "https://github.com/carbon-app",
            source: "https://github.com/carbon-app/carbon",
            authors: [
                {
                    name: "Mike Fix (@mfix22)",
                    link: "https://github.com/mfix22",
                },
                {
                    name: "Brian Dennis (@briandennis)",
                    link: "https://github.com/briandennis",
                },
                {
                    name: "Jake Dexheimer (@jakedex)",
                    link: "https://github.com/jakedex",
                },
                {
                    name: "and contributors",
                    link: "https://github.com/carbon-app/carbon/graphs/contributors",
                },
            ],
        },
        icon: <CodeXml className="h-6 w-6" />,
        href: "https://carbon.now.sh",
        color: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    },
    {
        title: "SVGOMG!",
        description: "a web ui for svgo, optimize your svgs",
        credits: {
            name: "jakearchibald",
            link: "https://github.com/jakearchibald",
            source: "https://github.com/jakearchibald/svgomg",
            authors: [
                {
                    name: "and contributors",
                    link: "https://github.com/jakearchibald/svgomg/graphs/contributors",
                },
            ],
        },
        icon: <ImageIcon className="h-6 w-6" />,
        href: "https://jakearchibald.github.io/svgomg/",
        color: "bg-green-500/10 text-green-700 dark:text-green-300",
    },
    {
        title: "v86",
        description: "x86 virtualization in the browser",
        credits: {
            name: "copy",
            link: "https://github.com/copy",
            source: "https://github.com/copy/v86",
            authors: [
                {
                    name: "and contributors",
                    link: "https://github.com/copy/v86/graphs/contributors",
                },
            ],
        },
        icon: <Cpu className="h-6 w-6" />,
        href: "https://copy.sh/v86/",
        color: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    },
]

const Home = () => {
    const section = (tools: ToolCardProps[], comingSoon: boolean = false) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                    <ToolCard
                        key={tool.title}
                        {...tool}
                        comingSoon={comingSoon}
                    />
                ))}
            </div>
        )
    }
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-12">
                <div className="flex mb-4 gap-2">
                    <Logo className="size-12" />
                    <h1 className={`text-3xl font-bold ${obviously.className}`}>
                        tools<span className="text-brand">.</span>morsz
                        <span className="text-brand">.</span>dev
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    a collection of tools i built for myself or friends. mostly
                    for web development stuff that i keep needing or fun
                    projects.
                </p>
            </div>

            {/* Available Tools */}
            <div className="mb-12">
                <h2
                    className={`text-2xl font-semibold mb-6 ${obviously.className}`}
                >
                    tools
                </h2>
                {section(tools)}
            </div>

            {/* Coming Soon Section */}
            <div className="mb-12">
                <h2
                    className={`text-2xl font-semibold mb-6 ${obviously.className}`}
                >
                    being worked on
                </h2>
                {section(upcomingTools, true)}
            </div>

            <div className="mb-12">
                <h2
                    className={`text-2xl font-semibold mb-6 ${obviously.className}`}
                >
                    external tools
                </h2>
                <p className="text-muted-foreground mb-4">
                    tools i find useful and want to share
                </p>
                {section(featuredTools)}
            </div>
        </div>
    )
}

export default Home
