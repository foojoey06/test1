"use server"

import { ProductSchema } from "@/types/product-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { products } from "../schema"
import { eq } from "drizzle-orm"

const action = createSafeActionClient()
export const createProduct = action(
    ProductSchema,
    async ({ title, description, price,id }) => {{
        try{
            if(id){
                const currentproduct = await db.query.products.findFirst({where : eq(products.id,id), })
                if(!currentproduct){
                    {error: "Product not found"}
                }

                const editproduct = await db.update(products).set({description, title, price}).where(eq(products.id,id)).returning()

                return {success: `Product ${editproduct[0].title} updated successfully!`}
            }

            if(!id){
                const newproduct = await db.insert(products).values({description, title, price}).returning()

                return {success: `Product ${newproduct[0].title} created successfully!`}
            }

        }catch(err){
            console.log(err)
            return {error: JSON.stringify(err)}
        }
    }
})