import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const listingSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    address: z.string().optional(), // Optional for now to not break existing tests/drafts if any, but form requires it
    city: z.string().min(2),
    zipCode: z.string().regex(/^\d{5}$/),
    rentAmount: z.number().min(100),
    surface: z.number().min(9),
    rooms: z.number().min(1),
    photos: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "LANDLORD") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const data = listingSchema.parse(body);

        const listing = await prisma.listing.create({
            data: {
                landlordId: (session.user as any).id,
                ...data,
                status: "DRAFT", // Must pay to publish
            },
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("[LISTING_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "LANDLORD") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const listings = await prisma.listing.findMany({
            where: { landlordId: (session.user as any).id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("[LISTING_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
