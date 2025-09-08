import "./globals.css"
import "@morsz/tailwind-config"
import "@morsz/ui/styles"
import { zxProto } from "@morsz/ui/styles/fonts"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body className={zxProto.className}>
                {children}
            </body>
        </html>
    )
}

export default RootLayout