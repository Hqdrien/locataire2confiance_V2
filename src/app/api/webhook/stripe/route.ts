import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        // Retrieve metadata
        const userId = session.metadata?.userId;
        const type = session.metadata?.planType || session.metadata?.type;

        if (!userId) {
            return new NextResponse("Webhook Error: Missing Metadata", { status: 400 });
        }

        if (type === "TENANT_SUB") {
            // Activate Subscription
            await prisma.user.update({
                where: { id: userId },
                data: { subscriptionStatus: "ACTIVE" }
            });
        } else if (type === "LISTING_FEE") {
            const listingId = session.metadata?.listingId;
            if (listingId) {
                await prisma.listing.update({
                    where: { id: listingId },
                    data: { status: "PUBLISHED" }
                });
            }
        } else if (type === "LANDLORD_ONE") {
            // Logic for one-time payment (e.g., publish a listing)
            // For now, we just log or could update a listing status if listingId was passed
            console.log(`Payment received for Landlord ${userId}`);
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        // Handle recurring payment success
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        // Ensure user is active (logic would be more complex connecting customer ID to user)
    }

    return new NextResponse(null, { status: 200 });
}
