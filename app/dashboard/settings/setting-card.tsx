"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SettingsSchema } from "@/types/setting-schema"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAction } from "next-safe-action/hook"
import { settings } from "@/server/actions/settings"
import { UploadButton } from "@/app/api/uploadthing/upload"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type SettingsForm = {
    session: Session
}

export default function SettingsCard(session: SettingsForm) {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [profileupload, setprofileupload] = useState(false)

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            image: session.session.user.image || undefined,
            isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || undefined,
        },
    })

    const { execute, status } = useAction(settings, {
        onSuccess: (data) => {
            if (data?.success) setSuccess(data.success)
            if (data?.error) setError(data.error)
        },
        onError: (error) => {
            setError("Something went wrong")
        },
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            disabled={status === "executing"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            {form.getValues("image") && (
                                                <Image
                                                    src={form.getValues("image") || "default_image_path"}
                                                    alt={form.getValues("name") || "default_image_name"}
                                                    className="rounded-full"
                                                    fill={true}
                                                    sizes="(max-width: 640px) 100vw, 50vw"
                                                />
                                            )}
                                            {!form.getValues("image") && (
                                                <AvatarFallback className="bg-primary/25">
                                                    <div className="font-bold">
                                                        {session.session.user?.name?.charAt(0).toUpperCase()}

                                                    </div>
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <UploadButton
                                            className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                            endpoint="avatarUploader"
                                            onUploadBegin={() => {
                                                setprofileupload(true)
                                            }}
                                            onUploadError={(error) => {
                                                form.setError("image", {
                                                    type: "validate",
                                                    message: error.message,
                                                })
                                                setprofileupload(false)
                                                return
                                            }}
                                            onClientUploadComplete={(res) => {
                                                form.setValue("image", res[0].url!)
                                                setprofileupload(false)
                                                return
                                            }}
                                            content={{
                                                button({ ready }) {
                                                    if (ready) return <div>Change Image</div>;
                                                    return <div>Loading...</div>;
                                                }
                                            }}
                                        />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="User Image"
                                            type="hidden"
                                            disabled={status === "executing"}
                                            {...field}
                                        />
                                    </FormControl>

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
                                        <Input
                                            placeholder="********"
                                            disabled={
                                                status === "executing" || session?.session.user.isAuth
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {session?.session.user.isAuth ? (
                                            <p>Not able for now because you only login with Google Gmail.</p>
                                        ) : null}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*******"
                                            disabled={
                                                status === "executing" || session?.session.user.isAuth
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {session?.session.user.isAuth ? (
                                            <p>Not able for now because you only login with Google Gmail.</p>
                                        ) : null}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Two Factor Authentication</FormLabel>
                                    <FormDescription>
                                        Enable two factor authentication for your account
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            disabled={
                                                status === "executing" ||
                                                session.session.user.isAuth === true
                                            }
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {session?.session.user.isAuth ? (
                                            <p>Not able for now because you only login with Google Gmail.</p>
                                        ) : null}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormError message={error || ""} />
                        <FormSuccess message={success} />
                        <Button type="submit" disabled={status === "executing" || profileupload}>
                            Update your settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
