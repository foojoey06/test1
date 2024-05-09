"use client"
import { useForm } from "react-hook-form"
import { AuthCard } from "./auth-card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from "@/types/register-schema";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailRegister } from "@/server/actions/email-register";
import { useAction } from "next-safe-action/hook";
import { cn } from "@/lib/utils"
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

export const RegisterForm = () => {
    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    })

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const {execute,status}= useAction(emailRegister, {
       onSuccess(data){
        if(data.error) setError(data.error)
        if(data.success) setSuccess(data.success)
       },
    })
    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        console.log(values)
        execute(values)
    }


    return (
        <AuthCard cartTitle="Register Form" backButtonHref="/auth/login" backButtonLabel="Already Have Account" showSocials>
            <div>
                <Form {...form}>

                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Username" type="text"/>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="abc@gmail.com" type="email" autoComplete="email" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="******" type="password" autoComplete="current-password" />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success}/>
                            <FormError message={error}/>
                            <br />
                        </div>
                        <Button type="submit" className={cn("w-full", status === 'executing' ? "animate-pulse" : "")}>{"Register"}</Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}