import PageHeader from "@/app/countdown-timer/components/page-header"

const CountdownTimerTokenLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <>
            <PageHeader />
            {children}
        </>
    )
}

export default CountdownTimerTokenLayout
