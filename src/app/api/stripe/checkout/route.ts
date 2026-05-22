import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID_TENANT || "price_mock_tenant";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { plan } = await req.json(); // plan can be 'TENANT_MONTHLY'
        const userId = (session.user as any).id;
        const userEmail = session.user?.email || undefined;

        const origin = req.headers.get("origin") || "http://localhost:3000";

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
                planType: "TENANT_SUB",
            },
            subscription_data: {
                metadata: {
                    userId,
                    planType: "TENANT_SUB",
                },
            },
            customer_email: userEmail,
            success_url: `${origin}/tenant/dashboard?success=true`,
            cancel_url: `${origin}/tenant/dashboard?canceled=true`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
