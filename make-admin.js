const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address as an argument.');
        console.error('Usage: node make-admin.js <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { role: 'ADMIN' },
        });
        console.log(`User ${email} has been promoted to ADMIN.`);
    } catch (e) {
        if (e.code === 'P2025') {
            console.error(`User with email ${email} not found.`);
        } else {
            console.error('Error updating user:', e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
