import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Simulate OAuth Delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock: Link account and set verified
        await prisma.tenantProfile.update({
            where: { userId: (session.user as any).id },
            data: {
                isDossierFacileCertified: true,
                dossierFacileUrl: "https://www.dossierfacile.fr/profil/mock-id-12345",
                profileCompletionScore: { increment: 10 } // Bonus for certification
            },
        });

        // Redirect back to dashboard with success param
        return NextResponse.redirect(new URL("/tenant/dashboard?df_linked=true", req.url));

    } catch (error) {
        console.error("[DF_LINK_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
