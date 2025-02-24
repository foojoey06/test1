"use client"

import { useForm } from "react-hook-form"
import { zProductSchema, ProductSchema } from "@/types/product-schema"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { DollarSign } from "lucide-react"
import Tiptap from "./tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hook"
import { createProduct } from "@/server/actions/create-product"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProductForm() {
    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange",
    })

    const router = useRouter()

    const { execute, status } = useAction(createProduct, {
        onSuccess: (data) => {
            if (data?.error) {
                toast.error(data.error)
            }
            if (data?.success) {
                router.push("/dashboard/products")
                toast.success(data.success)
            }
        },
        onError: (error) => {
            console.error(error)
            toast.error("An error occurred")
        },
    })

    async function onSubmit(values: zProductSchema) {
        execute(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="p-2 bg-muted  rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="0.00"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-full"
                            disabled={
                                status === "executing" ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
