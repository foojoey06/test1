"use client"

import { signIn } from "next-auth/react"
import { Button } from "../ui/button"

export default function Socials() {
    return(
        <div>
            <Button onClick={()=>signIn("google",{redirect:false,callbackUrl:"/"})}>Sign in With Google</Button>
            <Button onClick={()=>signIn("github",{redirect:false,callbackUrl:"/"})}>Sign in With Github</Button>
        </div>
    )
}