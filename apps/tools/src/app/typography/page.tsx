import ClientComponentsShowcase from "@/app/typography/components/client-components"
import ColorPaletteShowcase from "@/app/typography/components/color-palette"
import TypographyShowcase from "@/app/typography/components/typography"
import UIComponentsShowcase from "@/app/typography/components/ui-components"
import { Separator } from "@morsz/ui/separator"

export default function TypographyPage() {
    return (
        <main className="min-h-screen p-8 space-y-16">
            {/* Header Section */}
            <section className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                    Typography & UI
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    A comprehensive showcase of all typography styles, UI
                    components, and their variations.
                </p>
            </section>

            <Separator />

            {/* UI Components Showcase - Server Component */}
            <UIComponentsShowcase />

            <Separator />

            {/* Client Components Showcase - Client Component */}
            <ClientComponentsShowcase />

            <Separator />

            {/* Color Palette Showcase - Client Component */}
            <ColorPaletteShowcase />

            <Separator />

            {/* Typography Showcase - Server Component */}
            <TypographyShowcase />
        </main>
    )
}
