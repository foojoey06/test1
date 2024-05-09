import * as z from "zod"

export const ProductSchema = z.object({
    id:z.number().optional(),
    title: z.string().min(5,{
        message:"Title must be at least 5 characters long"
    }),
    description: z.string().min(5,{
        message:"Description must be at least 5 characters long"
    }),

    price: z.coerce
    .number({message:"Price must be a number"})
    .positive({message:"Price must be a positive number"})
    .min(0.01,{message:"Price must be at least 0.01"}),
})

export type zProductSchema = z.infer<typeof ProductSchema>