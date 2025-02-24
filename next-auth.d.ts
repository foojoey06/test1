import NextAuth, {type DefaultSession} from "next-auth"

export type ExtendUser = DefaultSession["user"] & {
    id : string
    role : string
    isTwoFactorEnabled : boolean
    isAuth : boolean
    image : string
}

declare module "next-auth" {
    interface Session {
        user : ExtendUser
    }
}