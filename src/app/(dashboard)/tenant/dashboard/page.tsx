import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateDossierScore } from "@/lib/scoring";
import { ScoreCard } from "@/components/dashboard/score-card";
import { CheckCircle, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DossierFacileLink } from "@/components/dashboard/df-link";
import { SubscriptionCTA } from "@/components/dashboard/subscription-cta";
import { ShareDossierButton } from "@/components/dashboard/share-dossier-button";
import { ShareLinksList } from "@/components/dashboard/share-links-list";

export default async function TenantDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            tenantProfile: {
                include: {
                    documents: true,
                    shareLinks: { orderBy: { createdAt: "desc" } },
                }
            }
        },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        redirect("/");
    }

    const { score, missingItems, recommendations } = calculateDossierScore(user.tenantProfile);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Bonjour, {user.tenantProfile.firstName || "Locataire"}
                </h1>
                <p className="text-neutral-400 mt-2">
                    Voici l'état actuel de votre dossier locatif.
                </p>
            </div>

            {user.subscriptionStatus !== "ACTIVE" && <SubscriptionCTA />}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Score Card */}
                <div className="lg:col-span-1 space-y-6">
                    <ScoreCard score={score} />
                    {/* Move DF Link here for sidebar effect on Score or keep main grid? Placed in main grid better */}
                </div>

                {/* Action / Missing Items Card */}
                <div className="lg:col-span-2 space-y-6">
                    {/* New DF Link Section */}
                    <DossierFacileLink
                        isCertified={user.tenantProfile.isDossierFacileCertified}
                        dossierUrl={user.tenantProfile.dossierFacileUrl}
                    />

                    <ShareDossierButton />
                    <ShareLinksList
                        links={user.tenantProfile.shareLinks}
                        origin={process.env.NEXTAUTH_URL || "http://localhost:3000"}
                    />

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-amber-500 h-5 w-5" />
                            Ce qu'il reste à faire
                        </h3>

                        {missingItems.length > 0 ? (
                            <div className="space-y-3">
                                {missingItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-lg border border-neutral-800">
                                        <span className="text-neutral-300 text-sm">{item}</span>
                                        <Link
                                            href={item.includes("Informations") ? "/tenant/profile" : "/tenant/documents"}
                                            className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1"
                                        >
                                            Compléter <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-green-500 flex items-center gap-2 p-4 bg-green-500/10 rounded-lg">
                                <CheckCircle className="h-5 w-5" />
                                <span>Tout est complet ! Vous êtes prêt à postuler.</span>
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    {recommendations.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-100 mb-2">Conseils pour améliorer votre dossier</h3>
                            <ul className="list-disc list-inside space-y-1 text-blue-200/80 text-sm">
                                {recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats / Summary row */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center gap-4">
                    <div className="h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center">
                        <FileText className="text-neutral-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{user.tenantProfile.documents.length}</div>
                        <div className="text-xs text-neutral-500">Documents ajoutés</div>
                    </div>
                </div>
                {/* Placeholder for future Application stats */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center gap-4 opacity-50">
                    <div className="h-10 w-10 bg-neutral-800 rounded-full flex items-center justify-center">
                        <ArrowRight className="text-neutral-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-xs text-neutral-500">Candidatures envoyées</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
