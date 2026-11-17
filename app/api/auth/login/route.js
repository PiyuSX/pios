import connectDB from "@/app/lib/db"
import User from "@/app/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be under 20 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

export async function POST(req) {
    try {
        
        const body = await req.json()

        const result = loginSchema.safeParse(body)

        if (!result.success) {
            return Response.json({
                success: false,
                message: "Invalid username or password"
            }, { status: 400 })
        }

        const { username, password } = result.data

        await connectDB()

        // Finding the user

        const existingUser = await User.findOne({ username })

        if (!existingUser) {
           return Response.json({
             success: false,
             message: "Invalid username or password"
           }, { status: 401 })
        }


        //Comparing the pass

        const isPasswordMatch = await bcrypt.compare(
            password, existingUser.password
        )

        if (!isPasswordMatch) {
            return Response.json({
                success: false,
                message: "Invalid username or password"
            }, { status: 401 })
        }


        // creating JWT 

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET
        )

        const token = await new SignJWT({
            userId: existingUser._id.toString()
        })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret)

        const cookieStore = await cookies()

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7

        })

        return Response.json({
            success: true,
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        }, { status: 200 })
    } catch (error) {
        console.error("Login error:", error)

        return Response.json({
            success: false,
            message: "Something went wrong"
        }, { status: 500 })
    }
}


