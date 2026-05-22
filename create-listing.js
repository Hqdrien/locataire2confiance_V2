const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting test listing creation...");

    // 1. Find or Create Landlord
    let landlord = await prisma.user.findFirst({
        where: { role: 'LANDLORD' }
    });

    if (!landlord) {
        console.log("No landlord found. Creating one...");
        landlord = await prisma.user.create({
            data: {
                email: 'test-landlord@example.com',
                passwordHash: '$2b$10$EpDhYfFx.a8i/i/e/e/e/e', // dummy hash
                role: 'LANDLORD',
            }
        });
    }

    console.log(`Using landlord: ${landlord.email} (${landlord.id})`);

    // 2. Create Listing
    const listing = await prisma.listing.create({
        data: {
            landlordId: landlord.id,
            title: "Appartement Test - Vue Tour Eiffel",
            description: "Magnifique appartement de test pour vérifier la fonctionnalité de recherche. Vue imprenable, proche commerces.",
            city: "Paris",
            zipCode: "75007",
            address: "5 Avenue Anatole France",
            rentAmount: 2500,
            surface: 80,
            rooms: 4,
            photos: [
                "https://placehold.co/600x400?text=Salon+Vue+Tour+Eiffel",
                "https://placehold.co/600x400?text=Chambre"
            ],
            status: "PUBLISHED",
            paidAt: new Date(),
        }
    });

    console.log("✅ Test listing created successfully!");
    console.log(`ID: ${listing.id}`);
    console.log(`Title: ${listing.title}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
