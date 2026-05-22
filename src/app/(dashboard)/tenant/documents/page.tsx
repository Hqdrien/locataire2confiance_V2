import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DocumentsList } from "@/components/dashboard/documents-list";

export default async function TenantDocumentsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            tenantProfile: {
                include: { documents: true }
            }
        },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        redirect("/");
    }

    // Define required documents based on profile
    const requiredDocs = [
        { type: "ID_CARD", label: "Pièce d'identité", description: "Carte d'identité, Passeport ou Titre de séjour" },
        { type: "PAYSLIP", label: "Justificatifs de revenus", description: "3 derniers bulletins de salaire ou bilans" },
        { type: "TAX_NOTICE", label: "Avis d'imposition", description: "Dernier avis d'imposition complet" },
    ];

    if (user.tenantProfile.guarantorType !== "NONE") {
        requiredDocs.push({
            type: "GUARANTOR_DOC",
            label: "Documents du Garant",
            description: "Identité et revenus du garant"
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Mes Documents
                </h1>
                <p className="text-neutral-400 mt-2">
                    Téléversez vos pièces justificatives. Elles seront protégées et filigranées.
                </p>
            </div>

            <DocumentsList
                initialDocuments={user.tenantProfile.documents.map(d => ({
                    id: d.id,
                    type: d.type,
                    status: d.status,
                    uploadedAt: d.uploadedAt.toISOString()
                }))}
                requiredTypes={requiredDocs}
            />
        </div>
    );
}
