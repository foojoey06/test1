"use server"
import { db } from "@/server"

export default async function getPosts() {
  try {
    const posts = await db.query.posts.findMany()

    if (!posts) {
      return { error: "No posts found" }
    }
    return { success: posts }
  } catch (error) {
    return { error: "COnnection Error" }
  }
}