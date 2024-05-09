import * as z from "zod";

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /[0-9]/;
const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(
      (password) => {
        return uppercaseRegex.test(password) && lowercaseRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
      },
      { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"}
    ),
  name: z.string().min(3, { message: "Name must be at least 3 characters long" })
});
