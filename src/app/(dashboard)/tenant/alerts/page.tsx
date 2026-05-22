import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Mail, Info } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TenantAlertForm } from "@/components/dashboard/tenant-alert-form";
import { DeleteTenantAlertButton } from "@/components/dashboard/delete-tenant-alert-button";

export default async function AlertsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            tenantProfile: {
                include: {
                    searchAlerts: { orderBy: { createdAt: "desc" } },
                },
            },
        },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        redirect("/");
    }

    const userAlias = `${user.email.split("@")[0].replace(/[^a-z0-9.-]/gi, ".")}.${user.id.slice(0, 6)}@l2c-alertes.com`;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Centralisation des Alertes
                </h1>
                <p className="text-neutral-400 mt-2">
                    Ne ratez plus aucune annonce. La demande dépassant largement l'offre, notre système d'alertes en temps réel vous permet d'être le premier sur le coup.
                </p>
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-200">
                        <strong>Conseil Pro :</strong> Plus vous restez inscrit, plus vous augmentez vos chances de recevoir des annonces en avant-première et de postuler rapidement.
                    </p>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 bg-blue-500/10 rounded-full">
                        <Mail className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <h3 className="text-xl font-bold text-white">Votre email unique</h3>
                        <p className="text-sm text-neutral-400">
                            Utilisez cette adresse email lorsque vous créez des alertes sur les sites immobiliers.
                            Nous filtrons les doublons et vous notifions instantanément.
                        </p>

                        <div className="flex items-center gap-2 max-w-md">
                            <div className="bg-black border border-neutral-700 rounded-lg px-4 py-3 flex-1 text-neutral-200 font-mono text-sm">
                                {userAlias}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TenantAlertForm />

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-neutral-500" />
                    Alertes enregistrées
                </h3>
                <div className="grid gap-3">
                    {user.tenantProfile.searchAlerts.map((alert) => (
                        <div key={alert.id} className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{alert.city}</p>
                                <p className="text-xs text-neutral-500">
                                    {alert.maxRent ? `Loyer max ${alert.maxRent}€` : "Loyer libre"}
                                    {alert.minSurface ? ` • ${alert.minSurface}m² min` : ""}
                                    {alert.minRooms ? ` • ${alert.minRooms} pièces min` : ""}
                                </p>
                            </div>
                            <DeleteTenantAlertButton alertId={alert.id} />
                        </div>
                    ))}
                    {user.tenantProfile.searchAlerts.length === 0 && (
                        <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-neutral-400">
                            Aucune alerte enregistrée.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
