import { Separator } from "@morsz/ui/separator"
import { obviously } from "@morsz/ui/styles/fonts"

const Typography = () => {
    const demoText = "The quick brown fox jumps over the lazy dog."

    const fontSizes = [
        { name: "text-xs", className: "text-xs" },
        { name: "text-sm", className: "text-sm" },
        { name: "text-base", className: "text-base" },
        { name: "text-lg", className: "text-lg" },
        { name: "text-xl", className: "text-xl" },
        { name: "text-2xl", className: "text-2xl" },
        { name: "text-3xl", className: "text-3xl" },
        { name: "text-4xl", className: "text-4xl" },
        { name: "text-5xl", className: "text-5xl" },
        { name: "text-6xl", className: "text-6xl" },
        { name: "text-7xl", className: "text-7xl" },
        { name: "text-8xl", className: "text-8xl" },
        { name: "text-9xl", className: "text-9xl" },
    ]

    const textColors = [
        { name: "text-foreground", className: "text-foreground" },
        { name: "text-muted-foreground", className: "text-muted-foreground" },
        { name: "text-primary", className: "text-primary" },
        { name: "text-secondary", className: "text-secondary" },
        { name: "text-accent", className: "text-accent" },
        { name: "text-destructive", className: "text-destructive" },
    ]

    const fontVariants = [
        {
            title: "Default Font (0xProto)",
            extraClasses: "",
        },
        {
            title: "Default Font Bold (0xProto)",
            extraClasses: "font-bold",
        },
        {
            title: "Header Font (Obviously)",
            extraClasses: `${obviously.className}`,
        },
        {
            title: "Header Font - Black & Expanded",
            extraClasses: `font-black font-stretch-expanded ${obviously.className}`,
        },
    ]

    return (
        <section className="space-y-12">
            <div className="space-y-4">
                <h2 className="font-bold tracking-tight">Typography</h2>
            </div>

            <div className="space-y-6">
                <h3>Font sizes in use</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {fontVariants.map(({ title, extraClasses }) => (
                        <div key={title} className="space-y-4">
                            <div>
                                <h4 className="text-lg font-medium mb-2">
                                    {title}
                                </h4>
                            </div>
                            <div className={`space-y-3 ${extraClasses}`}>
                                {fontSizes.map(({ name, className }) => (
                                    <div
                                        key={name}
                                        className="flex flex-col gap-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {name}
                                            </span>
                                        </div>
                                        <span className={className}>
                                            {demoText}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Text colors in use</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {textColors.map(({ name, className }) => (
                        <div key={name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {name}
                                </span>
                            </div>
                            <p className={`text-lg ${className}`}>{demoText}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-6">
                <h3>Default text styles & elements</h3>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Headings</h4>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">
                                Heading 1; {demoText}
                            </h1>
                            <h2 className="text-3xl font-semibold tracking-tight">
                                Heading 2; {demoText}
                            </h2>
                            <h3 className="text-2xl font-semibold">
                                Heading 3; {demoText}
                            </h3>
                            <h4 className="text-xl font-medium">
                                Heading 4; {demoText}
                            </h4>
                            <h5 className="text-lg font-medium">
                                Heading 5; {demoText}
                            </h5>
                            <h6 className="text-base font-medium">
                                Heading 6; {demoText}
                            </h6>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium">Text Elements</h4>
                        <div className="space-y-4">
                            <p className="text-base leading-relaxed">
                                <strong>bold text</strong>, <em>italic text</em>
                                , <u>underlined text</u>; {demoText}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                this is a smaller paragraph with the muted
                                foreground color {demoText}
                            </p>

                            <blockquote>
                                Blockquote; &quot;{demoText}&quot;
                            </blockquote>

                            <div className="space-y-2">
                                <p>Unordered List:</p>
                                <ul>
                                    <li>First list item with some content</li>
                                    <li>
                                        Second list item with{" "}
                                        <strong>bold text</strong>
                                    </li>
                                    <li>
                                        Third list item with{" "}
                                        <em>italic text</em>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <p>Ordered List:</p>
                                <ol>
                                    <li>First ordered item</li>
                                    <li>Second ordered item</li>
                                    <li>Third ordered item</li>
                                </ol>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Code Elements:
                                </p>
                                <code>
                                    const example = &quot;code snippet&quot;;
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Typography
