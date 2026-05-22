import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const passwordSchema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
});

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { currentPassword, newPassword } = passwordSchema.parse(await req.json());
        const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!isValid) {
            return new NextResponse("Invalid password", { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: await bcrypt.hash(newPassword, 10) },
        });

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "PASSWORD_CHANGED",
                entity: "User",
                entityId: user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("ACCOUNT_PASSWORD_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
