"use server"
import { db } from "@/server"
import { posts } from "../schema"
import { revalidatePath } from "next/cache"

export default async function createPost(formData: FormData) {
    console.log(formData)
    try {
        const title = formData.get("title")?.toString()
        if (!title) {
            throw new Error("Title is required")
        }
        const post = await db.insert(posts).values({
            title,
        })

        revalidatePath("/")
        return { success: post }
    } catch (error) {
        return { error: "Connection Error" }
    }
}
