import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function backup() {
    console.log("⏳ Début de la sauvegarde locale...");

    const users = await prisma.user.findMany({
        include: {
            tenantProfile: {
                include: {
                    documents: true,
                    matches: true,
                }
            },
            listings: {
                include: {
                    matches: true,
                }
            }
        }
    });

    const data = {
        users,
        exportedAt: new Date().toISOString(),
    };

    const backupPath = path.join(process.cwd(), "prisma", "backup_data.json");
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2));

    console.log(`✅ Sauvegarde terminée : ${users.length} utilisateurs exportés.`);
    console.log(`📁 Fichier : ${backupPath}`);
}

backup()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
