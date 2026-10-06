import * as z from "zod";

export const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be at most 50 characters"),

    username: z
      .string()
      .trim()
      .min(2, "username must be at least 2 characters")
      .max(20, "username must be at most 20 characters"),
    // .regex(/^[a-zA-z0-9_]$/,"Username can only contains letter,numbers and underscore"),

    email: z.string().email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one capital letter")
      .regex(/[a-z]/, "Password must contain at least one small letter")
      .regex(/[0-9]/, "Password must contain at  one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at  least one character"),

    rePassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one capital letter")
      .regex(/[a-z]/, "Password must contain at least one small letter")
      .regex(/[0-9]/, "Password must contain at  one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at  least one character"),

    dateOfBirth: z
      .string()
      .nonempty("Date of birth is required")
      .refine((value) => {
        const selectedYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();

        return currentYear - selectedYear >= 16;
      }, "Your age must be greater than or equal 16 years old"),
    gender: z.enum(["male", "female"], {
      message: "Please Select Your Gender",
    }),
  })
  .refine((data) => {
    return data.password === data.rePassword
  }, {message:"rePassword is not equal Password",path: ['rePassword']});



export type RegisterFormSchema =  z.infer<typeof schema>


