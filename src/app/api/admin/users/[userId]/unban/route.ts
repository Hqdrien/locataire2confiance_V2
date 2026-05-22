import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { userId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.user.update({
            where: { id: params.userId },
            data: { isBanned: false },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[USER_UNBAN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
