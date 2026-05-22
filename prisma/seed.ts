import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function seed() {
    const backupPath = path.join(process.cwd(), "prisma", "backup_data.json");

    try {
        const data = JSON.parse(await fs.readFile(backupPath, "utf-8"));
        const users = data.users || [];

        console.log(`🌱 Seeding from backup... (${users.length} users)`);

        for (const user of users) {
            // 1. Create User
            const createdUser = await prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: {
                    id: user.id,
                    email: user.email,
                    passwordHash: user.passwordHash,
                    role: user.role,
                    subscriptionStatus: user.subscriptionStatus,
                    isBanned: user.isBanned,
                    stripeCustomerId: user.stripeCustomerId,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            });
            console.log(`  - User: ${user.email}`);

            // 2. Tenant Profile (if exists)
            if (user.tenantProfile) {
                await prisma.tenantProfile.upsert({
                    where: { userId: createdUser.id },
                    update: {},
                    create: {
                        id: user.tenantProfile.id,
                        userId: createdUser.id,
                        firstName: user.tenantProfile.firstName,
                        lastName: user.tenantProfile.lastName,
                        phone: user.tenantProfile.phone,
                        situation: user.tenantProfile.situation,
                        monthlyIncome: user.tenantProfile.monthlyIncome,
                        guarantorType: user.tenantProfile.guarantorType,
                        isDossierFacileCertified: user.tenantProfile.isDossierFacileCertified,
                        dossierFacileUrl: user.tenantProfile.dossierFacileUrl,
                        profileCompletionScore: user.tenantProfile.profileCompletionScore,
                    }
                });

                // 3. Documents
                for (const doc of user.tenantProfile.documents || []) {
                    await prisma.document.upsert({
                        where: { id: doc.id },
                        update: {},
                        create: {
                            id: doc.id,
                            tenantProfileId: user.tenantProfile.id,
                            type: doc.type,
                            storageKey: doc.storageKey,
                            status: doc.status,
                            uploadedAt: doc.uploadedAt,
                        }
                    });
                }
            }

            // 4. Listings (if Landlord)
            if (user.listings && user.listings.length > 0) {
                for (const list of user.listings) {
                    await prisma.listing.upsert({
                        where: { id: list.id },
                        update: {},
                        create: {
                            id: list.id,
                            landlordId: createdUser.id,
                            title: list.title,
                            description: list.description,
                            address: list.address,
                            city: list.city,
                            zipCode: list.zipCode,
                            rentAmount: list.rentAmount,
                            surface: list.surface,
                            rooms: list.rooms,
                            photos: list.photos,
                            status: list.status,
                            paidAt: list.paidAt,
                            createdAt: list.createdAt,
                            updatedAt: list.updatedAt,
                        }
                    });
                }
            }
        }

        console.log("✅ Seeding finished.");
    } catch (error) {
        console.log("⚠️ No backup_data.json found or error reading it. Skipping import.");
        console.error(error);
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
