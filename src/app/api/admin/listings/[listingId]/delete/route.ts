import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { listingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete associated matches first (if not cascading)
        await prisma.match.deleteMany({
            where: {
                listingId: params.listingId,
            }
        });

        await prisma.listing.delete({
            where: {
                id: params.listingId,
            },
        });

        return new NextResponse("OK");
    } catch (error) {
        console.error("[ADMIN_LISTING_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
