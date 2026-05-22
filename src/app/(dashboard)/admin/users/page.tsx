import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BadgeCheck, User as UserIcon, Building2, ShieldAlert } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { RoleFilter } from "@/components/ui/role-filter";
import { UserRole } from "@prisma/client";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams?: { q?: string; role?: string };
}) {
    const query = searchParams?.q;
    const roleFilter = searchParams?.role;

    const where: any = {};

    if (query) {
        where.OR = [
            { email: { contains: query } }, // Prisma explicitely case-insensitive depends on DB, but usually okay for basic search
            // For strict case-insensitivity with some DBs we might need mode: 'insensitive'
        ];
    }

    if (roleFilter && Object.values(UserRole).includes(roleFilter as UserRole)) {
        where.role = roleFilter as UserRole;
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            tenantProfile: true,
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h1>
                    <span className="text-sm text-neutral-400">{users.length} utilisateurs trouvés</span>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput placeholder="Rechercher un email..." />
                    <RoleFilter />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-950 text-neutral-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Statut Abonnement</th>
                                <th className="px-6 py-4">Date d'inscription</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                <UserIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">
                                                    {user.tenantProfile
                                                        ? `${user.tenantProfile.firstName} ${user.tenantProfile.lastName}`
                                                        : "N/A"
                                                    }
                                                </div>
                                                <div className="text-neutral-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'TENANT'
                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : user.role === 'LANDLORD'
                                                ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {user.role === 'TENANT' && <UserIcon className="h-3 w-3" />}
                                            {user.role === 'LANDLORD' && <Building2 className="h-3 w-3" />}
                                            {user.role === 'ADMIN' && <ShieldAlert className="h-3 w-3" />}
                                            {user.role === 'TENANT' ? 'LOCATAIRE' : user.role === 'LANDLORD' ? 'PROPRIÉTAIRE' : 'ADMINISTRATEUR'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${user.subscriptionStatus === 'ACTIVE'
                                            ? 'text-green-500 bg-green-500/10'
                                            : 'text-neutral-500 bg-neutral-800'
                                            }`}>
                                            {user.subscriptionStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href={`/admin/users/${user.id}`} className="text-neutral-400 hover:text-white transition-colors text-xs font-medium">
                                            Voir détails
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
