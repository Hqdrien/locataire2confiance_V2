import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["TENANT", "LANDLORD"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role } = userSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role,
                // Initialize appropriate profile
                ...(role === "TENANT" ? {
                    tenantProfile: {
                        create: {
                            // Initialize with minimal data or defaults
                            firstName: "",
                            lastName: "",
                            situation: "CDI", // Default, will be updated
                            monthlyIncome: 0,
                            guarantorType: "NONE"
                        }
                    }
                } : {})
            },
        });

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("REGISTRATION_ERROR", error, { cause: error });
        return new NextResponse("Internal Error", { status: 500 });
    }
}
