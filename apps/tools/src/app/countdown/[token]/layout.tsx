import PageHeader from "@/app/countdown/components/page-header"

const CountdownTokenLayout = ({
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

export default CountdownTokenLayout
