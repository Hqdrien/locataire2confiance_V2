const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = "locataire2confiance@gmail.com";
    const password = "FOd7G8v295";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                passwordHash: hashedPassword,
                role: 'ADMIN' // Ensure role is ADMIN
            },
            create: {
                email: email,
                passwordHash: hashedPassword,
                role: 'ADMIN'
            },
        });

        console.log(`User ${email} created/updated successfully with ADMIN role.`);
    } catch (e) {
        console.error('Error creating admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
