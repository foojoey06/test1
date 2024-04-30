"use client"

import { AuthCard } from "./auth-card"

export const LoginForm = () => {
    return (
        <AuthCard cartTitle="Login Form" backButtonHref="/auth/register" backButtonLabel="Create a new Account" showSocials>
            <div>
                This is your login form
            </div>
        </AuthCard>
    )
}