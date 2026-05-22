import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PlusCircle, Building2, Users } from "lucide-react";
import Link from "next/link";
import { PayListingButton } from "@/components/dashboard/pay-listing-button";

export default async function LandlordDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "LANDLORD") {
        redirect("/login");
    }

    const listings = await prisma.listing.findMany({
        where: { landlordId: (session.user as any).id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Espace Propriétaire
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Gérez vos biens et consultez les dossiers.
                    </p>
                </div>
                <Link
                    href="/landlord/listings/create"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-black hover:bg-neutral-200 h-10 px-6 py-2"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouvelle annonce
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-2">
                            <Building2 className="h-4 w-4" />
                            <span>Annonces en ligne</span>
                        </div>
                        <span className="text-4xl font-bold text-white">{listings.length}</span>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col justify-between opacity-50">
                    <div>
                        <div className="flex items-center gap-2 text-neutral-400 mb-2">
                            <Users className="h-4 w-4" />
                            <span>Candidatures reçues</span>
                        </div>
                        <span className="text-4xl font-bold text-white">0</span>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-white mb-4">Vos dernières annonces</h2>
                {listings.length > 0 ? (
                    <div className="grid gap-4">
                        {listings.map(listing => (
                            <div key={listing.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-white">{listing.title}</h3>
                                    <p className="text-sm text-neutral-400">{listing.city} ({listing.zipCode}) • {listing.rentAmount}€/mois</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {listing.status === "PUBLISHED" ? (
                                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">En ligne</span>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded-full">Brouillon</span>
                                            <PayListingButton listingId={listing.id} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                        <p className="text-neutral-500 mb-4">Vous n'avez aucune annonce pour le moment.</p>
                        <Link href="/landlord/listings/create" className="text-blue-500 hover:underline">Créer ma première annonce</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
