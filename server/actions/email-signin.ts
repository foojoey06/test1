"use server"
import { createSafeActionClient } from "next-safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from ".."
import { eq } from "drizzle-orm"
const action = createSafeActionClient();
import { users,twoFactorTokens } from "../schema"
import { sendVerificationEmail,sendTwoFactorTokenByEmail } from "./email";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens"
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = action(LoginSchema,
    async ({ email, password, code }) => {
        try {

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            })

            if (existingUser?.email !== email) {
                return { error: "Email or Password Incorrect." }
            }

            if (!existingUser.password) {
                return { error: "sorry, you have signed in with a google/github account but haven have password. Please sign in with the same google/github account if you want to signin with same email account." }
            }

            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(
                    existingUser.email
                )
                await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                )
                return { success: "Email is regiater but haven verification yet" }
            }

            if (existingUser.twoFactorEnabled && existingUser.email) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(
                        existingUser.email
                    )
                    if (!twoFactorToken) {
                        return { error: "Invalid Token" }
                    }
                    if (twoFactorToken.token !== code) {
                        return { error: "Invalid Token" }
                    }

                    const hasExpired = new Date(twoFactorToken.expires) < new Date()
                    if (hasExpired) {
                        return { error: "Token has expired" }
                    }

                    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, twoFactorToken.id))
                } else {
                    const token = await generateTwoFactorToken(existingUser.email)

                    if (!token) {
                        return { error: "Token not generated!" }
                    }

                    await sendTwoFactorTokenByEmail(token[0].email, token[0].token)
                    return { twoFactor: "Two Factor Token Sent!" }
                }
            }


            await signIn("credentials", {
                email,
                password,
                redirectTo: "/",
            })

            return { success: "User Signed In!" }

        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return { error: "Email or Password Incorrect." }
                    case "AccessDenied":
                        return { error: error.message }
                    case "OAuthSignInError":
                        return { error: error.message }
                    default:
                        return { error: "Connection Error." }
                }
            }
            throw error
        }
    }
)