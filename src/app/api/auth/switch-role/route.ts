import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = (session.user as any).id;
        const userRole = (session.user as any).role;

        const newRole = userRole === "TENANT" ? "LANDLORD" : "TENANT";

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        return NextResponse.json({ success: true, newRole });
    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}
