import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity } from "lucide-react";

const actionLabels: Record<string, string> = {
    APPLICATION_CREATED: "Candidature envoyée",
    DOSSIER_SHARE_LINK_CREATED: "Lien dossier créé",
    DOSSIER_SHARE_LINK_VIEWED: "Dossier partagé consulté",
    DOSSIER_SHARE_LINK_REVOKED: "Lien dossier révoqué",
    PASSWORD_CHANGED: "Mot de passe modifié",
    SEARCH_ALERT_MATCHED: "Alerte logement déclenchée",
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

export default async function AdminActivityPage() {
    const logs = await prisma.activityLog.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, role: true } } },
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Activité plateforme</h1>
                <p className="text-sm text-neutral-400">100 derniers événements enregistrés.</p>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-950 text-neutral-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Entité</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-neutral-800/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 text-white">
                                            <Activity className="h-4 w-4 text-blue-500" />
                                            {actionLabels[log.action] || log.action}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-neutral-300">{log.user?.email || "Utilisateur supprimé"}</div>
                                        <div className="text-xs text-neutral-500">{log.user?.role || "N/A"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {log.entity || "-"}
                                        {log.entityId && <span className="block max-w-[180px] truncate text-xs text-neutral-600">{log.entityId}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {format(log.createdAt, "dd MMM yyyy HH:mm", { locale: fr })}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-400">Aucune activité.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
