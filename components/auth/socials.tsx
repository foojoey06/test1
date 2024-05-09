"use client"

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function Socials() {
    return (
        <div className="flex w-full gap-4 flex-col sm:flex-row">
            <Button variant={"outline"} className="flex gap-4 w-full" onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}>Sign in With Google<FcGoogle className="w-5 h-5" /></Button>
            <Button variant={"outline"} className="flex gap-4 w-full" onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}>Sign in With Github<FaGithub className="w-5 h-5" /></Button>
        </div>
    )
}