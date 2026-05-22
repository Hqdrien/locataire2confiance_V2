import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const deleteSchema = z.object({
    password: z.string().min(8),
    confirmation: z.literal("SUPPRIMER"),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { password } = deleteSchema.parse(await req.json());
        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            include: { tenantProfile: true },
        });

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            return new NextResponse("Invalid password", { status: 400 });
        }

        const anonymizedEmail = `deleted-${user.id}@deleted.local`;

        await prisma.$transaction(async (tx) => {
            if (user.tenantProfile) {
                await tx.dossierShareLink.updateMany({
                    where: { tenantProfileId: user.tenantProfile.id, revokedAt: null },
                    data: { revokedAt: new Date() },
                });

                await tx.tenantProfile.update({
                    where: { id: user.tenantProfile.id },
                    data: {
                        firstName: "Compte",
                        lastName: "supprimé",
                        phone: null,
                        dossierFacileUrl: null,
                    },
                });
            }

            await tx.activityLog.create({
                data: {
                    userId: user.id,
                    action: "ACCOUNT_ANONYMIZED",
                    entity: "User",
                    entityId: user.id,
                },
            });

            await tx.user.update({
                where: { id: user.id },
                data: {
                    email: anonymizedEmail,
                    passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
                    isBanned: true,
                    stripeCustomerId: null,
                    subscriptionStatus: "INACTIVE",
                },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("ACCOUNT_DELETE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
