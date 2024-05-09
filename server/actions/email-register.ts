"use server"

import { RegisterSchema } from "@/types/register-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { users } from "../schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcrypt"
import { generateEmailVerificationToken } from "./tokens"
import { send } from "process"
import { sendVerificationEmail } from "./email"
const action = createSafeActionClient()


export const emailRegister = action(RegisterSchema, async ({ email, name, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const existingemail = await db.query.users.findFirst({ where: eq(users.email, email) })
    if(existingemail){
        if(!existingemail.emailVerified){
            const verificationToken = await generateEmailVerificationToken(email)
            await sendVerificationEmail(verificationToken[0].email,verificationToken[0].token)
            return{error:"This email is already registered, but haven verified yet. Verification email sent."}
        }
        return{error:"Email already registered. Please sign in or use a different email."}
    }
    
    await db.insert(users).values({email,name,password: hashedPassword})
    const verificationToken = await generateEmailVerificationToken(email)
    await sendVerificationEmail(verificationToken[0].email,verificationToken[0].token)
    return{success:"Verification email sent"}
})