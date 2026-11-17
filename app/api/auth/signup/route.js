import connectDB from "@/app/lib/db"
import User from "@/app/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 character long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 character long")
})


export async function POST(req) {
    try {
        const body = await req.json()

        const result = signupSchema.safeParse(body)

        if (!result.success) {
            return Response.json({
                success: false,
                message: "Invalid input",
                errors: result.error.flatten()
                
            }, { status: 400 })
        }

        const { username, email, password } = result.data


        await connectDB()

        //Check if user already exists 

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return Response.json({
                success: false,
                message: "User already exists"
            }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return Response.json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        }, { status: 201 })

    } catch (error) {
        console.error("Signup error:", error)

        return Response.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}