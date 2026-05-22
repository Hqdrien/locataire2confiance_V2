import { prisma } from "@/lib/prisma";
import { calculateDossierScore } from "@/lib/scoring";
import { notFound } from "next/navigation";

export default async function SharedDossierPage({ params }: { params: { token: string } }) {
    const shareLink = await prisma.dossierShareLink.findUnique({
        where: { token: params.token },
        include: {
            tenantProfile: {
                include: {
                    user: true,
                    documents: true,
                },
            },
        },
    });

    if (!shareLink || shareLink.revokedAt || shareLink.expiresAt < new Date()) {
        notFound();
    }

    await prisma.dossierShareLink.update({
        where: { id: shareLink.id },
        data: { viewedAt: new Date() },
    });

    await prisma.activityLog.create({
        data: {
            userId: shareLink.tenantProfile.userId,
            action: "DOSSIER_SHARE_LINK_VIEWED",
            entity: "DossierShareLink",
            entityId: shareLink.id,
        },
    });

    const { score } = calculateDossierScore(shareLink.tenantProfile);
    const profile = shareLink.tenantProfile;

    return (
        <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                    <p className="text-sm uppercase tracking-wide text-blue-400">Dossier partagé sécurisé</p>
                    <h1 className="mt-2 text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                    <p className="mt-2 text-neutral-400">Score dossier : {score}/100</p>
                </div>
                <section className="grid gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                    <h2 className="text-xl font-semibold">Informations locataire</h2>
                    <p>Email : {profile.user.email}</p>
                    <p>Téléphone : {profile.phone || "Non renseigné"}</p>
                    <p>Situation : {profile.situation}</p>
                    <p>Revenus mensuels : {profile.monthlyIncome}€</p>
                    <p>Garant : {profile.guarantorType}</p>
                </section>
                <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
                    <h2 className="text-xl font-semibold">Documents</h2>
                    <div className="mt-4 grid gap-3">
                        {profile.documents.map((document) => (
                            <div key={document.id} className="rounded-lg border border-neutral-800 p-3 text-sm text-neutral-300">
                                {document.type} - {document.status}
                            </div>
                        ))}
                        {profile.documents.length === 0 && <p className="text-neutral-400">Aucun document ajouté.</p>}
                    </div>
                </section>
            </div>
        </main>
    );
}
