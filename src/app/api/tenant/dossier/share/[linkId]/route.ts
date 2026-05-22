import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(_req: Request, { params }: { params: { linkId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const shareLink = await prisma.dossierShareLink.findUnique({
        where: { id: params.linkId },
        include: { tenantProfile: true },
    });

    if (!shareLink || shareLink.tenantProfile.userId !== (session.user as any).id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const revoked = await prisma.dossierShareLink.update({
        where: { id: shareLink.id },
        data: { revokedAt: new Date() },
    });

    await prisma.activityLog.create({
        data: {
            userId: (session.user as any).id,
            action: "DOSSIER_SHARE_LINK_REVOKED",
            entity: "DossierShareLink",
            entityId: shareLink.id,
        },
    });

    return NextResponse.json(revoked);
}
