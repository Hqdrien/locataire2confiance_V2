import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function notifyMatchingTenantAlerts(listingId: string) {
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
    });

    if (!listing || listing.status !== "PUBLISHED") {
        return;
    }

    const alerts = await prisma.tenantSearchAlert.findMany({
        where: {
            emailEnabled: true,
            city: { equals: listing.city, mode: "insensitive" },
            OR: [
                { maxRent: null },
                { maxRent: { gte: listing.rentAmount } },
            ],
            AND: [
                {
                    OR: [
                        { minSurface: null },
                        { minSurface: { lte: listing.surface } },
                    ],
                },
                {
                    OR: [
                        { minRooms: null },
                        { minRooms: { lte: listing.rooms } },
                    ],
                },
            ],
        },
        include: {
            tenantProfile: {
                include: { user: true },
            },
        },
    });

    await Promise.all(alerts.map(async (alert) => {
        const user = alert.tenantProfile.user;

        await sendEmail(
            user.email,
            `Nouvelle annonce à ${listing.city}`,
            `<p>Bonjour ${alert.tenantProfile.firstName},</p><p>Une nouvelle annonce correspond à votre alerte : <strong>${listing.title}</strong>.</p><p>Loyer : ${listing.rentAmount}€ - Surface : ${listing.surface}m² - Pièces : ${listing.rooms}</p><p>Connectez-vous à votre espace locataire pour consulter l'annonce.</p>`
        );

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "SEARCH_ALERT_MATCHED",
                entity: "Listing",
                entityId: listing.id,
            },
        });
    }));
}
