import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { notifyMatchingTenantAlerts } from "@/lib/listing-alerts";
import Stripe from "stripe";

async function updateSubscriptionFromStripe(subscription: Stripe.Subscription, status: "ACTIVE" | "INACTIVE" | "PAST_DUE", action: string) {
    const userId = subscription.metadata?.userId;
    const customerId = subscription.customer as string;

    const user = userId
        ? await prisma.user.findUnique({ where: { id: userId } })
        : await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });

    if (!user) {
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            stripeCustomerId: customerId,
            subscriptionStatus: status,
        },
    });

    await prisma.activityLog.create({
        data: {
            userId: user.id,
            action,
            entity: "StripeSubscription",
            entityId: subscription.id,
        },
    });
}

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

        // Handle Listing Payment
        if (session.metadata?.type === "LISTING_FEE") {
            const listingId = session.metadata.listingId;
            if (listingId) {
                await prisma.listing.update({
                    where: { id: listingId },
                    data: {
                        status: "PUBLISHED",
                        paidAt: new Date()
                    }
                });
                await prisma.activityLog.create({
                    data: {
                        userId: session.metadata.userId || null,
                        action: "LISTING_PAYMENT_SUCCEEDED",
                        entity: "Listing",
                        entityId: listingId,
                    },
                });
                await notifyMatchingTenantAlerts(listingId);
            }
            return new NextResponse(null, { status: 200 });
        }

        // Handle Tenant Subscription
        const subscriptionId = session.subscription as string;
        if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            if (!session?.metadata?.userId) {
                return new NextResponse("User id is required", { status: 400 });
            }

            await prisma.user.update({
                where: {
                    id: session.metadata.userId,
                },
                data: {
                    stripeCustomerId: subscription.customer as string,
                    subscriptionStatus: "ACTIVE",
                },
            });
            await prisma.activityLog.create({
                data: {
                    userId: session.metadata.userId,
                    action: "SUBSCRIPTION_ACTIVATED",
                    entity: "StripeSubscription",
                    entityId: subscription.id,
                },
            });
        }
    }

    if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string | null;

        if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await updateSubscriptionFromStripe(subscription, "ACTIVE", "SUBSCRIPTION_RENEWED");
        }
    }

    if (event.type === "invoice.payment_failed") {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string | null;

        if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            await updateSubscriptionFromStripe(subscription, "PAST_DUE", "SUBSCRIPTION_PAYMENT_FAILED");
        }
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status === "active" || subscription.status === "trialing"
            ? "ACTIVE"
            : subscription.status === "past_due" || subscription.status === "unpaid"
                ? "PAST_DUE"
                : "INACTIVE";

        await updateSubscriptionFromStripe(subscription, status, "SUBSCRIPTION_UPDATED");
    }

    if (event.type === "customer.subscription.deleted") {
        // Mark as inactive if user cancels
        const subscription = event.data.object as Stripe.Subscription;
        // Find user by customer ID ? We don't have it directly mapped easily without metadata in sub object
        // Ideally metadata flows down, but for MVP we assume creation works.
        const user = await prisma.user.findFirst({
            where: { stripeCustomerId: subscription.customer as string }
        });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { subscriptionStatus: "INACTIVE" }
            });
            await prisma.activityLog.create({
                data: {
                    userId: user.id,
                    action: "SUBSCRIPTION_CANCELLED",
                    entity: "StripeSubscription",
                    entityId: subscription.id,
                },
            });
        }
    }


    return new NextResponse(null, { status: 200 });
}
