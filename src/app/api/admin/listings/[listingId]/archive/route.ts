import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { listingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.listing.update({
            where: {
                id: params.listingId,
            },
            data: {
                status: "ARCHIVED",
            },
        });

        return new NextResponse("OK");
    } catch (error) {
        console.error("[ADMIN_LISTING_ARCHIVE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
