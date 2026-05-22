import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import * as z from "zod";
import crypto from "crypto";

const requestSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const { email } = requestSchema.parse(await req.json());
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

            await prisma.passwordResetToken.create({
                data: {
                    token,
                    userId: user.id,
                    expiresAt,
                },
            });

            const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
            const resetUrl = `${origin}/reset-password?token=${token}`;

            await sendEmail(
                user.email,
                "Réinitialisation de votre mot de passe",
                `<p>Bonjour,</p><p>Vous pouvez définir un nouveau mot de passe ici : <a href="${resetUrl}">${resetUrl}</a></p><p>Ce lien expire dans 1 heure.</p>`
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("FORGOT_PASSWORD_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
