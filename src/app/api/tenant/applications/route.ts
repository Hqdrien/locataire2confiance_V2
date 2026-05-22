import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { listingId } = await req.json();
        const userId = (session.user as any).id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tenantProfile: true }
        });

        if (!user?.tenantProfile) return new NextResponse("Profile failed", { status: 404 });

        // Check if already applied
        let match = await prisma.match.findFirst({
            where: {
                listingId,
                tenantId: user.tenantProfile.id
            },
            include: { listing: { include: { landlord: true } } }
        });

        if (!match) {
            match = await prisma.match.create({
                data: {
                    listingId,
                    tenantId: user.tenantProfile.id,
                    status: "NEW", // Initial status
                    score: 100
                },
                include: {
                    listing: {
                        include: {
                            landlord: true
                        }
                    }
                }
            });

            // Notify Landlord only on new application
            if (match.listing.landlord.email) {
                await sendEmail(
                    match.listing.landlord.email,
                    `Nouvelle candidature pour ${match.listing.title}`,
                    `<p>Bonjour,</p><p>Vous avez reçu une nouvelle candidature de <strong>${user.tenantProfile.firstName}</strong> pour votre bien à ${match.listing.city}.</p><p>Connectez-vous à votre espace propriétaire pour consulter le dossier.</p>`
                );
            }

            await prisma.activityLog.create({
                data: {
                    userId,
                    action: "APPLICATION_CREATED",
                    entity: "Match",
                    entityId: match.id,
                },
            });
        }

        return NextResponse.json({ success: true, matchId: match.id });
    } catch (error) {
        console.error("[APPLICATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
