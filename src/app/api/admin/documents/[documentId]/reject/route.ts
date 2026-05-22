import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { documentId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.document.update({
            where: { id: params.documentId },
            data: { status: "REJECTED" },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DOCUMENT_REJECT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
