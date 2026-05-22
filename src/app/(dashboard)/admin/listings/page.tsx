import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Euro, Home } from "lucide-react";
import Link from "next/link";

export default async function AdminListingsPage() {
    const listings = await prisma.listing.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            landlord: true,
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Gestion des Annonces</h1>
                <span className="text-sm text-neutral-400">{listings.length} annonces total</span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-950 text-neutral-400 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Annonce</th>
                                <th className="px-6 py-4">Localisation</th>
                                <th className="px-6 py-4">Loyer</th>
                                <th className="px-6 py-4">Propriétaire</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">Date de création</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {listings.map((listing) => (
                                <tr key={listing.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/listings/${listing.id}`} className="flex items-center gap-3 group">
                                            <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 group-hover:bg-neutral-700 transition-colors">
                                                <Home className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white max-w-[200px] truncate group-hover:text-blue-400 transition-colors" title={listing.title}>
                                                    {listing.title}
                                                </div>
                                                <div className="text-neutral-500 text-xs">
                                                    {listing.rooms} pièces • {listing.surface}m²
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3 text-neutral-500" />
                                            {listing.city} <span className="text-neutral-500">({listing.zipCode})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        <div className="flex items-center gap-1">
                                            {listing.rentAmount} <Euro className="h-3 w-3" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {listing.landlord.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${listing.status === 'PUBLISHED'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : listing.status === 'DRAFT'
                                                ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {listing.status === 'PUBLISHED' ? 'PUBLIÉE' : listing.status === 'DRAFT' ? 'BROUILLON' : listing.status === 'ARCHIVED' ? 'ARCHIVÉE' : listing.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {format(new Date(listing.createdAt), 'dd MMM yyyy', { locale: fr })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/listings/${listing.id}`} className="text-neutral-400 hover:text-white transition-colors text-xs font-medium">
                                            Voir
                                        </Link>
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
