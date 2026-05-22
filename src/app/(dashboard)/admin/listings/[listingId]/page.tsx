import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Home, MapPin, Euro, Scaling, BedDouble, User, ArrowLeft, Users, Calendar, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminListingActions } from "@/components/dashboard/admin-listing-actions";

export default async function AdminListingDetailPage({ params }: { params: { listingId: string } }) {
    const listing = await prisma.listing.findUnique({
        where: { id: params.listingId },
        include: {
            landlord: true,
            matches: {
                include: {
                    tenantProfile: true
                }
            }
        }
    });

    if (!listing) {
        redirect("/admin/listings");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/listings" className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Détails de l'annonce</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{listing.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-neutral-400">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        {listing.city} ({listing.zipCode})
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        Ajoutée le {format(new Date(listing.createdAt), 'dd MMMM yyyy', { locale: fr })}
                                    </div>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${listing.status === 'PUBLISHED'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : listing.status === 'DRAFT'
                                    ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                {listing.status === 'PUBLISHED' ? 'PUBLIÉE' : listing.status === 'DRAFT' ? 'BROUILLON' : listing.status === 'ARCHIVED' ? 'ARCHIVÉE' : listing.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-800/30 rounded-lg border border-neutral-800 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                    <Euro className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Loyer</p>
                                    <p className="font-bold text-white">{listing.rentAmount} €</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                    <Scaling className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Surface</p>
                                    <p className="font-bold text-white">{listing.surface} m²</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                    <BedDouble className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500">Pièces</p>
                                    <p className="font-bold text-white">{listing.rooms}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-white mb-3">Description</h3>
                            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    {/* Matches */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Candidatures
                            </h3>
                            <span className="text-sm text-neutral-400">{listing.matches.length} candidats</span>
                        </div>

                        {listing.matches.length > 0 ? (
                            <div className="space-y-3">
                                {listing.matches.map((match) => (
                                    <div key={match.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center text-white text-xs font-bold">
                                                {match.tenantProfile.firstName[0]}{match.tenantProfile.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {match.tenantProfile.firstName} {match.tenantProfile.lastName}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    Matching: {match.score}% • {
                                                        match.status === 'NEW' ? 'Nouveau' :
                                                            match.status === 'VIEWED' ? 'Vu' :
                                                                match.status === 'CONTACTED' ? 'Contacté' :
                                                                    match.status === 'REJECTED' ? 'Rejeté' : match.status
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/admin/users/${match.tenantProfile.userId}`}
                                            className="text-xs text-blue-500 hover:text-blue-400 font-medium"
                                        >
                                            Voir profil
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 text-sm">Aucune candidature pour le moment.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-red-500" />
                            Actions Admin
                        </h3>
                        <AdminListingActions listingId={listing.id} currentStatus={listing.status} />
                    </div>

                    {/* Landlord Info */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-purple-500" />
                            Propriétaire
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{listing.landlord.email}</p>
                                <p className="text-xs text-neutral-500">Inscrit le {format(new Date(listing.landlord.createdAt), 'dd/MM/yyyy')}</p>
                            </div>
                        </div>
                        <Link
                            href={`/admin/users/${listing.landlord.id}`}
                            className="block w-full text-center py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Voir profil propriétaire
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
