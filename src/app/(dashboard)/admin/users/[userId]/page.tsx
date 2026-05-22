import { prisma } from "@/lib/prisma";
import { AdminUserActions } from "@/components/dashboard/admin-user-actions";
import { AdminDocumentActions } from "@/components/dashboard/admin-document-actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BadgeCheck, User as UserIcon, Building2, ShieldAlert, FileText, Calendar, Mail, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUserDetailPage({ params }: { params: { userId: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.userId },
        include: {
            tenantProfile: {
                include: {
                    documents: true,
                }
            },
            listings: true,
        }
    });

    if (!user) {
        redirect("/admin/users");
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Détails de l'utilisateur</h1>
                </div>
                <AdminUserActions userId={user.id} isBanned={user.isBanned} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                                    <UserIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {user.tenantProfile
                                            ? `${user.tenantProfile.firstName} ${user.tenantProfile.lastName}`
                                            : "Utilisateur sans profil"
                                        }
                                    </h2>
                                    <div className="flex items-center gap-2 text-neutral-400 mt-1">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    {user.isBanned && (
                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-medium">
                                            <ShieldAlert className="h-3 w-3" />
                                            Utilisateur Banni
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${user.role === 'TENANT'
                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                : user.role === 'LANDLORD'
                                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                {user.role === 'TENANT' && <UserIcon className="h-4 w-4" />}
                                {user.role === 'LANDLORD' && <Building2 className="h-4 w-4" />}
                                {user.role === 'ADMIN' && <ShieldAlert className="h-4 w-4" />}
                                {user.role === 'TENANT' ? 'LOCATAIRE' : user.role === 'LANDLORD' ? 'PROPRIÉTAIRE' : 'ADMINISTRATEUR'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">Date d'inscription</p>
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(user.createdAt), 'PPP', { locale: fr })}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">ID Utilisateur</p>
                                <p className="text-sm text-neutral-300 font-mono truncate" title={user.id}>{user.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tenant Profile (if exists) */}
                    {user.tenantProfile && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Profil Locataire
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">Situation</p>
                                    <p className="text-white font-medium">{user.tenantProfile.situation}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">Revenus mensuels</p>
                                    <p className="text-white font-medium">{user.tenantProfile.monthlyIncome} €</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">Garant</p>
                                    <p className="text-white font-medium">{user.tenantProfile.guarantorType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">Téléphone</p>
                                    <p className="text-white font-medium">{user.tenantProfile.phone || 'Non renseigné'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">Score Dossier</p>
                                    <p className="text-white font-medium">{user.tenantProfile.profileCompletionScore}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">DossierFacile</p>
                                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${user.tenantProfile.isDossierFacileCertified
                                        ? 'text-green-500 bg-green-500/10'
                                        : 'text-neutral-500 bg-neutral-800'
                                        }`}>
                                        {user.tenantProfile.isDossierFacileCertified ? 'Certifié' : 'Non certifié'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {user.tenantProfile?.documents && user.tenantProfile.documents.length > 0 && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Documents</h3>
                            <div className="space-y-3">
                                {user.tenantProfile.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-8 w-8 text-neutral-500" />
                                            <div>
                                                <p className="text-sm font-medium text-white">{doc.type}</p>
                                                <p className="text-xs text-neutral-500">
                                                    {format(new Date(doc.uploadedAt), 'dd MMM yyyy', { locale: fr })} • {doc.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <a
                                                href={doc.storageKey}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-blue-500 hover:text-blue-400 font-medium"
                                            >
                                                Voir
                                            </a>
                                            <div className="h-4 w-px bg-neutral-700"></div>
                                            <AdminDocumentActions documentId={doc.id} status={doc.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Subscription Status */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-green-500" />
                            Abonnement
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">Statut</p>
                                <span className={`inline-flex px-2.5 py-1 rounded-md text-sm font-medium ${user.subscriptionStatus === 'ACTIVE'
                                    ? 'text-green-500 bg-green-500/10 border border-green-500/20'
                                    : 'text-neutral-500 bg-neutral-800 border border-neutral-700'
                                    }`}>
                                    {user.subscriptionStatus}
                                </span>
                            </div>
                            {user.stripeCustomerId && (
                                <div>
                                    <p className="text-sm text-neutral-500 mb-1">ID Client Stripe</p>
                                    <p className="text-xs text-neutral-300 font-mono break-all">{user.stripeCustomerId}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Listings Summary (for Landlords) */}
                    {user.listings.length > 0 && (
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Annonces ({user.listings.length})</h3>
                            <div className="space-y-3">
                                {user.listings.map((listing) => (
                                    <Link key={listing.id} href={`/admin/listings/${listing.id}`} className="block p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800">
                                        <p className="text-sm font-medium text-white truncate">{listing.title}</p>
                                        <div className="flex justify-between mt-1 text-xs text-neutral-500">
                                            <span>{listing.city}</span>
                                            <span>{listing.rentAmount}€</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
