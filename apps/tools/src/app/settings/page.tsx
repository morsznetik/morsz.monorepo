import ListLocalStorageButton from "@/app/settings/listLocalStorageButton"
import ThemeSwitch from "@morsz/ui/special/theme-switch"

const Settings = () => {
    return (
        <main className="min-h-screen p-4 flex flex-col items-center justify-center">
            <h1>Settings</h1>
            <p className="text-muted-foreground mt-4">
                This is the settings page. More coming soon!
            </p>
            <div className="flex items-center justify-center gap-2">
                <p className="text-muted-foreground text-sm">
                    all changes are saved locally, in localStorage
                </p>
                <ListLocalStorageButton />
            </div>
            <div className="flex items-center justify-center gap-2">
                <p className="mr-1">
                    I&apos;m feeling nice, so here&apos;s a button to toggle the
                    theme 👉
                </p>
                <ThemeSwitch />
            </div>
        </main>
    )
}

export default Settings
