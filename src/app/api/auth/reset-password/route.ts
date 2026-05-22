import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const resetSchema = z.object({
    token: z.string().min(32),
    password: z.string().min(8),
});

export async function POST(req: Request) {
    try {
        const { token, password } = resetSchema.parse(await req.json());
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            return new NextResponse("Invalid or expired token", { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("RESET_PASSWORD_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
