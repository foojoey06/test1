import { auth } from "@/server/auth"
import { redirect } from "next/navigation"
import Settingscard from "./setting-card"

export default async function settings(){
    const session = await auth()
    if(!session) redirect("/")
    if(session)return <Settingscard session={session} />

}