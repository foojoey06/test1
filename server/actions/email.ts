"use server"
import getBaseUrl from "@/lib/base-url"
const domain = getBaseUrl()
import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NEXT_MAIL_USER,
            pass: process.env.NEXT_MAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: process.env.NEXT_MAIL_USER,
        to: email,
        subject: "Project - Comfirm your Email Address",
        text: "Comfirm your email address",
        html: `<p>Click to comfirm your email : <a href='${confirmLink}'>verification</a></p>`,
    });
    
    if (info.accepted) return {sucess:"email sent"}
    if (info.rejected) return {error:"email rejected"}
}


export const sendPasswordResetEmail= async (email: string, token: string) => {
    
    const confirmLink = `${domain}/auth/new-password?token=${token}`

    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NEXT_MAIL_USER,
            pass: process.env.NEXT_MAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: process.env.NEXT_MAIL_USER,
        to: email,
        subject: "Project - Reset Password",
        text: "Reset your password",
        html: `<p>Click to reset your password : <a href='${confirmLink}'>reset password</a></p>`,
    });
    
    if (info.accepted) return {sucess:"email sent"}
    if (info.rejected) return {error:"email rejected"}
}

export const sendTwoFactorTokenByEmail= async (email: string, token: string) => {
    
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NEXT_MAIL_USER,
            pass: process.env.NEXT_MAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: process.env.NEXT_MAIL_USER,
        to: email,
        subject: "Project - Two Factor Token",
        text: "Two Verification Code",
        html: `<p>Here is your two verification code : ${token}`,
    });
    
    if (info.accepted) return {sucess:"email sent"}
    if (info.rejected) return {error:"email rejected"}
}