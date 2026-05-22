import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const updateSchema = z.object({
    status: z.enum(["NEW", "VIEWED", "CONTACTED", "REJECTED"]),
});

export async function PATCH(req: Request, { params }: { params: { matchId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "LANDLORD") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status } = updateSchema.parse(body);

        // Verify ownership (optional but recommended: check if landlord owns the listing of this match)
        // For speed, just updating assuming ID is UUID and session validation is minimal
        // But better to check:
        const match = await prisma.match.findUnique({
            where: { id: params.matchId },
            include: { listing: true }
        });

        if (!match || match.listing.landlordId !== (session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const updatedMatch = await prisma.match.update({
            where: { id: params.matchId },
            data: { status },
        });

        return NextResponse.json(updatedMatch);

    } catch (error) {
        console.error("[MATCH_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
