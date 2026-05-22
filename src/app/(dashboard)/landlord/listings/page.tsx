import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PayListingButton } from "@/components/dashboard/pay-listing-button";

export default async function LandlordListingsPage() {
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
                        Mes Annonces
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Retrouvez ici toutes vos annonces immobilières.
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

            {listings.length > 0 ? (
                <div className="grid gap-4">
                    {listings.map(listing => (
                        <div key={listing.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-xl text-white">{listing.title}</h3>
                                <p className="text-neutral-400 mt-1">
                                    {listing.city} ({listing.zipCode}) • {listing.surface}m² • {listing.rooms} pièces
                                </p>
                                <p className="font-bold text-white mt-2">
                                    {listing.rentAmount}€ <span className="text-sm font-normal text-neutral-500">/mois</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {listing.status === "PUBLISHED" ? (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-medium rounded-full">En ligne</span>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-neutral-800 text-neutral-400 text-sm font-medium rounded-full">Brouillon</span>
                                        <PayListingButton listingId={listing.id} />
                                    </div>
                                )}
                                <Link
                                    href={`/landlord/listings/${listing.id}/applications`}
                                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-md transition-colors"
                                >
                                    Candidatures
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
                    <div className="bg-neutral-800 p-4 rounded-full mb-4">
                        <PlusCircle className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Aucune annonce</h3>
                    <p className="text-neutral-400 max-w-sm mb-6">
                        Vous n'avez pas encore créé d'annonce. Commencez dès maintenant pour trouver votre locataire.
                    </p>
                    <Link
                        href="/landlord/listings/create"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Créer une annonce
                    </Link>
                </div>
            )}
        </div>
    );
}
