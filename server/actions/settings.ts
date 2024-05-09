"use server"

import { SettingsSchema } from "@/types/setting-schema"
import { createSafeActionClient } from "next-safe-action"
import { auth } from "../auth"
import { db } from ".."
import { eq } from "drizzle-orm"
import { twoFactorTokens, users } from "../schema"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

const action = createSafeActionClient()

export const settings = action(SettingsSchema, async (values) => {
    const user = await auth();
    if (!user) return { error: "User not found" }

    const dbuser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id)
    })

    if (!dbuser) return { error: "User not found" }

    if (user.user.isAuth) {
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }

    if (values.password && values.newPassword && dbuser.password) {
        const passwordMatch = await bcrypt.compare(values.password, dbuser.password)
        if (!passwordMatch) {
            return { error: "Password does not match" }
        }
        const samePassword = await bcrypt.compare(
            values.newPassword,
            dbuser.password
        )
        if (samePassword) {
            return { error: "New password is the same as the old password" }
        }
        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = hashedPassword
        values.newPassword = undefined
    }
    
    const updatedUser = await db.update(users).set({
        name: values.name,
        password : values.password,
        email : values.email,
        image : values.image,
        twoFactorEnabled : values.isTwoFactorEnabled
    }).where(eq(users.id, user.user.id))

    revalidatePath("/dashboard/settings")
    return { success: "User Settings updated"}

})