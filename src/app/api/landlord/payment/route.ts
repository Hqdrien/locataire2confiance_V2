import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const STRIPE_PRICE_ID_LISTING = process.env.STRIPE_PRICE_ID_LISTING || "price_mock_listing_100";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "LANDLORD") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { listingId } = await req.json();
        const userId = (session.user as any).id;
        const userEmail = session.user?.email || undefined;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId, landlordId: userId }
        });

        if (!listing) return new NextResponse("Listing not found", { status: 404 });
        if (listing.status === "PUBLISHED") return new NextResponse("Already published", { status: 400 });

        const origin = req.headers.get("origin") || "http://localhost:3000";

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment", // One-time payment
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Publication Annonce : ${listing.title}`,
                        },
                        unit_amount: 10000, // 100.00 EUR
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "LISTING_FEE",
                userId: userId,
                listingId: listingId
            },
            customer_email: userEmail,
            success_url: `${origin}/landlord/dashboard?success=listing_published`,
            cancel_url: `${origin}/landlord/dashboard?canceled=true`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_LISTING_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
