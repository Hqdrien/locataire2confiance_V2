import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTenantPDF } from "@/lib/pdf-generator";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            include: {
                tenantProfile: {
                    include: { documents: true }
                }
            },
        });

        if (!user || !user.tenantProfile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        const pdfBuffer = await generateTenantPDF(user.tenantProfile, user.email);

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Dossier_Locataire2Confiance_${user.tenantProfile.lastName}.pdf"`,
            },
        });
    } catch (error) {
        console.error("[PDF_GEN_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
