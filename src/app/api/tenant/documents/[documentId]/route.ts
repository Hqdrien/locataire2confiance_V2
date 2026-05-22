import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteLocalUpload } from "@/lib/local-upload-storage";

export async function DELETE(_req: Request, { params }: { params: { documentId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const document = await prisma.document.findUnique({
        where: { id: params.documentId },
        include: { tenantProfile: true },
    });

    if (!document || document.tenantProfile.userId !== (session.user as any).id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.document.delete({ where: { id: document.id } });
    await deleteLocalUpload(document.storageKey);

    await prisma.activityLog.create({
        data: {
            userId: (session.user as any).id,
            action: "DOCUMENT_DELETED",
            entity: "Document",
            entityId: document.id,
        },
    });

    return NextResponse.json({ success: true });
}
