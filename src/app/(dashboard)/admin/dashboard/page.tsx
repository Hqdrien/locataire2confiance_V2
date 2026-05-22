import { prisma } from "@/lib/prisma";
import { Users, Building2, FileText, DollarSign } from "lucide-react";
import { AdminGrowthChart } from "@/components/dashboard/admin-growth-chart";

export default async function AdminDashboardPage() {
    const [userCount, listingCount, matchCount] = await Promise.all([
        prisma.user.count(),
        prisma.listing.count(),
        prisma.match.count(),
    ]);

    // Mock revenue calculation based on active subscriptions or listings
    const revenue = await prisma.user.count({ where: { subscriptionStatus: "ACTIVE" } }) * 50;

    // Mock data for the chart (in a real app, we would aggregate this from DB)
    const chartData = [
        { name: 'Jan', users: 2, listings: 0 },
        { name: 'Fév', users: 5, listings: 2 },
        { name: 'Mar', users: 12, listings: 4 },
        { name: 'Avr', users: 18, listings: 8 },
        { name: 'Mai', users: 25, listings: 12 },
        { name: 'Juin', users: userCount, listings: listingCount },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Vue d'ensemble</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard label="Utilisateurs" value={userCount} icon={Users} color="text-blue-500" />
                <StatsCard label="Annonces" value={listingCount} icon={Building2} color="text-purple-500" />
                <StatsCard label="Candidatures" value={matchCount} icon={FileText} color="text-green-500" />
                <StatsCard label="Revenus (Est.)" value={`${revenue} €`} icon={DollarSign} color="text-yellow-500" />
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Croissance de la plateforme</h3>
                <AdminGrowthChart data={chartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Derniers Inscrits</h3>
                    <UserListLimit />
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Dernières Annonces</h3>
                    <ListingListLimit />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center gap-4">
            <div className={`p-3 rounded-full bg-neutral-800 ${color}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-neutral-400">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
}

async function UserListLimit() {
    const users = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { email: true, role: true, createdAt: true }
    });

    return (
        <div className="space-y-3">
            {users.map((u, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2 last:border-0">
                    <span className="text-neutral-300">{u.email}</span>
                    <span className="text-xs text-neutral-500">
                        {u.role === 'TENANT' ? 'LOCATAIRE' : u.role === 'LANDLORD' ? 'PROPRIÉTAIRE' : 'ADMINISTRATEUR'}
                    </span>
                </div>
            ))}
        </div>
    )
}

async function ListingListLimit() {
    const listings = await prisma.listing.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { title: true, city: true, rentAmount: true }
    });

    return (
        <div className="space-y-3">
            {listings.map((l, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2 last:border-0">
                    <span className="text-neutral-300 truncate max-w-[150px]">{l.title}</span>
                    <span className="text-xs text-neutral-500">{l.city} - {l.rentAmount}€</span>
                </div>
            ))}
        </div>
    )
}
