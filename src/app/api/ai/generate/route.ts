import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { type, rooms, surface, city, features } = body;

        // Mock AI delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const adjectives = ["lumineux", "spacieux", "moderne", "calme", "rénové"];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

        const description = `
Découvrez ce superbe bien situé à ${city}, idéalement placé.
Ce ${type || "appartement"} ${adj} offre une surface de ${surface}m² et comprend ${rooms} pièce(s).

Points forts :
- Proximité des commerces et transports
- Quartier recherché
- Agencement optimisé
- Belle luminosité naturelle

Idéal pour étudiant ou jeune actif. Dossier complet demandé.
Contactez-nous pour une visite !
        `.trim();

        return NextResponse.json({ description });

    } catch (error) {
        console.error("[AI_GENERATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
