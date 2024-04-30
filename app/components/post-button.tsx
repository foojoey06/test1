"use client"
import { useFormStatus } from "react-dom"
export default function PostButton() {
    const { pending } = useFormStatus()
    return (
        pending ? (
            <button className="bg-blue-400 px-5" disabled >Posting...</button>
        ) : (
            <button className="bg-blue-400 px-5 text-special">Submit</button>
        )
    )
}
