import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const actionLabels: Record<string, string> = {
    APPLICATION_CREATED: "Candidature envoyée",
    DOSSIER_SHARE_LINK_CREATED: "Lien de dossier créé",
    DOSSIER_SHARE_LINK_VIEWED: "Dossier partagé consulté",
    DOSSIER_SHARE_LINK_REVOKED: "Lien de dossier révoqué",
    PASSWORD_CHANGED: "Mot de passe modifié",
    SEARCH_ALERT_MATCHED: "Annonce correspondant à une alerte",
    DOCUMENT_UPLOADED: "Document ajouté",
    DOCUMENT_REPLACED: "Document remplacé",
    DOCUMENT_DELETED: "Document supprimé",
    ACCOUNT_ANONYMIZED: "Compte anonymisé",
    LISTING_PAYMENT_SUCCEEDED: "Paiement annonce réussi",
    SUBSCRIPTION_ACTIVATED: "Abonnement activé",
    SUBSCRIPTION_RENEWED: "Abonnement renouvelé",
    SUBSCRIPTION_PAYMENT_FAILED: "Paiement abonnement échoué",
    SUBSCRIPTION_UPDATED: "Abonnement mis à jour",
    SUBSCRIPTION_CANCELLED: "Abonnement annulé",
};

export default async function TenantActivityPage() {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        redirect("/login");
    }

    const logs = await prisma.activityLog.findMany({
        where: { userId: (session.user as any).id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Activité</h1>
                <p className="mt-2 text-neutral-400">Retrouvez les principaux événements liés à votre compte et à votre dossier.</p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900">
                {logs.length > 0 ? (
                    <div className="divide-y divide-neutral-800">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-5">
                                <div className="rounded-full bg-blue-500/10 p-2">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-white">{actionLabels[log.action] || log.action}</p>
                                    <p className="mt-1 text-xs text-neutral-500">
                                        {new Intl.DateTimeFormat("fr-FR", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        }).format(log.createdAt)}
                                    </p>
                                </div>
                                {log.entity && <span className="rounded-full border border-neutral-700 px-2 py-1 text-xs text-neutral-400">{log.entity}</span>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-neutral-400">Aucune activité enregistrée pour le moment.</div>
                )}
            </div>
        </div>
    );
}
