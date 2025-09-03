interface PageHeaderProps {
    title?: string
    description?: string
}

const PageHeader = ({
    title = "Countdown Timer",
    description = "Time remaining until your target date",
}: PageHeaderProps) => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-primary">
                    {title}
                </h1>
                <p className="text-muted-foreground text-lg">{description}</p>
            </div>
        </div>
    )
}

export default PageHeader
