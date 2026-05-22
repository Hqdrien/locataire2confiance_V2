import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { alertId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const alert = await prisma.tenantSearchAlert.findUnique({
        where: { id: params.alertId },
        include: { tenantProfile: true },
    });

    if (!alert || alert.tenantProfile.userId !== (session.user as any).id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.tenantSearchAlert.delete({ where: { id: params.alertId } });

    return NextResponse.json({ success: true });
}
