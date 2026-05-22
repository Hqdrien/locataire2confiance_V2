import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireActiveTenantSubscription(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, subscriptionStatus: true }
    });

    if (!user || user.role !== "TENANT") {
        redirect("/login");
    }

    if (user.subscriptionStatus !== "ACTIVE") {
        redirect("/tenant/dashboard?subscription=required");
    }
}
