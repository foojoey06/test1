import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Socials from "./socials"
import { BackButton } from "./back-button"

type CardWrapperProps = {
    children: React.ReactNode
    cartTitle: string
    backButtonHref: string
    backButtonLabel: string
    showSocials?: boolean
}

export const AuthCard = ({
    children,
    cartTitle,
    backButtonHref,
    backButtonLabel,
    showSocials,
}: CardWrapperProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{cartTitle}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocials && (
                <CardFooter>
                    <Socials />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
}
