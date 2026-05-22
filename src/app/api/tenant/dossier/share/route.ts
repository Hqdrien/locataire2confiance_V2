import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { tenantProfile: true },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    if (user.subscriptionStatus !== "ACTIVE") {
        return new NextResponse("Subscription required", { status: 402 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const shareLink = await prisma.dossierShareLink.create({
        data: {
            token,
            tenantProfileId: user.tenantProfile.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        },
    });

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action: "DOSSIER_SHARE_LINK_CREATED",
            entity: "DossierShareLink",
            entityId: shareLink.id,
        },
    });

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    return NextResponse.json({
        url: `${origin}/shared-dossier/${shareLink.token}`,
        expiresAt: shareLink.expiresAt,
    });
}
