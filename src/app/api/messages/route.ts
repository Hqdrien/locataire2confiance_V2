
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { matchId, content } = await req.json();

        if (!matchId || !content) {
            return new NextResponse("Missing data", { status: 400 });
        }

        const userId = (session.user as any).id;

        // Verify user is part of the match
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { listing: true, tenantProfile: true }
        });

        if (!match) {
            return new NextResponse("Match not found", { status: 404 });
        }

        const isTenant = match.tenantProfile.userId === userId;
        const isLandlord = match.listing.landlordId === userId;

        if (!isTenant && !isLandlord) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                matchId,
                senderId: userId,
                content,
            }
        });

        // Update match status to CONTACTED if it was NEW or VIEWED
        if (match.status === "NEW" || match.status === "VIEWED") {
            await prisma.match.update({
                where: { id: matchId },
                data: { status: "CONTACTED" }
            });
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error("MESSAGE_SEND_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get("matchId");

    if (!matchId) {
        // Alternative: Get all conversations (matches with messages)
        return new NextResponse("Match ID required", { status: 400 });
    }

    try {
        const userId = (session.user as any).id;

        // Verify access
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: { listing: true, tenantProfile: true }
        });

        if (!match) {
            return new NextResponse("Match not found", { status: 404 });
        }

        const isTenant = match.tenantProfile.userId === userId;
        const isLandlord = match.listing.landlordId === userId;

        if (!isTenant && !isLandlord) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { matchId },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { email: true, role: true } } }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error("MESSAGES_GET_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
