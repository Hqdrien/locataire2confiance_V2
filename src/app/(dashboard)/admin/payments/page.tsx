import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Crown, Home } from "lucide-react";

export default async function AdminPaymentsPage() {
    const [subscribers, paidListings, pastDueSubscribers] = await Promise.all([
        prisma.user.findMany({
            where: { role: "TENANT", subscriptionStatus: { in: ["ACTIVE", "PAST_DUE"] } },
            orderBy: { updatedAt: "desc" },
            select: { id: true, email: true, subscriptionStatus: true, stripeCustomerId: true, updatedAt: true },
        }),
        prisma.listing.findMany({
            where: { paidAt: { not: null } },
            orderBy: { paidAt: "desc" },
            include: { landlord: { select: { email: true } } },
            take: 100,
        }),
        prisma.user.count({ where: { role: "TENANT", subscriptionStatus: "PAST_DUE" } }),
    ]);

    const activeSubscribers = subscribers.filter((user) => user.subscriptionStatus === "ACTIVE");
    const estimatedMonthlyRevenue = activeSubscribers.length * 50;
    const estimatedListingRevenue = paidListings.length * 29;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Paiements & abonnements</h1>
                <p className="text-sm text-neutral-400">Vue opérationnelle des abonnements locataires et paiements d'annonces.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard label="Abonnés actifs" value={activeSubscribers.length} icon={Crown} />
                <StatCard label="Paiements en retard" value={pastDueSubscribers} icon={CreditCard} />
                <StatCard label="Revenus estimés" value={`${estimatedMonthlyRevenue + estimatedListingRevenue} €`} icon={Home} />
            </div>

            <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="text-lg font-bold text-white">Abonnements actifs et en retard</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-neutral-400">
                            <tr>
                                <th className="py-3">Email</th>
                                <th className="py-3">Statut</th>
                                <th className="py-3">Client Stripe</th>
                                <th className="py-3">Dernière mise à jour</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {subscribers.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-3 text-neutral-200">{user.email}</td>
                                    <td className="py-3">
                                        <span className={user.subscriptionStatus === "ACTIVE" ? "text-green-500" : "text-amber-500"}>
                                            {user.subscriptionStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 text-neutral-500">{user.stripeCustomerId || "-"}</td>
                                    <td className="py-3 text-neutral-400">{format(user.updatedAt, "dd MMM yyyy", { locale: fr })}</td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-neutral-400">Aucun abonnement actif ou en retard.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="text-lg font-bold text-white">Annonces payées</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-neutral-400">
                            <tr>
                                <th className="py-3">Annonce</th>
                                <th className="py-3">Propriétaire</th>
                                <th className="py-3">Ville</th>
                                <th className="py-3">Payée le</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {paidListings.map((listing) => (
                                <tr key={listing.id}>
                                    <td className="py-3 text-neutral-200">{listing.title}</td>
                                    <td className="py-3 text-neutral-500">{listing.landlord.email}</td>
                                    <td className="py-3 text-neutral-400">{listing.city}</td>
                                    <td className="py-3 text-neutral-400">{listing.paidAt ? format(listing.paidAt, "dd MMM yyyy", { locale: fr }) : "-"}</td>
                                </tr>
                            ))}
                            {paidListings.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-neutral-400">Aucune annonce payée.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, icon: Icon }: any) {
    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-neutral-800 p-3 text-yellow-500"><Icon className="h-5 w-5" /></div>
                <div>
                    <p className="text-sm text-neutral-400">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}
