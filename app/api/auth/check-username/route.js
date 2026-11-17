import connectDB from "@/app/lib/db"
import User from "@/app/models/User"
import { z } from "zod"

const usernameSchema = z.string().min(3, "username must be at least 3 characters long").max(20, "username must be under 20 characters long")

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get("username")

        const result = usernameSchema.safeParse(username)

        if (!result.success) {
            return Response.json({
                available: false,
                message: "Username must be 3-20 characters"
            }, { status: 400 })

        }

        await connectDB()

        const existingUser = await User.findOne({
            username: result.data
        })

        return Response.json({
            available: !existingUser,
            message: existingUser ? "Username is already taken" : "Username is available"
        }, { status: 200 })


    } catch (error) {
        console.error(error)

        return Response.json({
            available: false,
            message: "Unable to check username"
        }, { status: 500 })
    }
}

