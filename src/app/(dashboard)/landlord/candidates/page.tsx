
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageCircle, FileText, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function LandlordCandidatesPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
    });

    if (!user || user.role !== "LANDLORD") {
        redirect("/");
    }

    // Fetch matches
    const matches = await prisma.match.findMany({
        where: {
            listing: {
                landlordId: user.id
            }
        },
        include: {
            listing: true,
            tenantProfile: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                Mes Candidats
            </h1>

            {matches.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center text-neutral-500">
                    <p>Aucun candidat pour le moment.</p>
                    <p className="text-sm mt-2">Dès qu'un locataire postule à une de vos annonces, il apparaîtra ici.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {matches.map((match) => (
                        <div key={match.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-white">
                                        {match.tenantProfile.firstName} {match.tenantProfile.lastName}
                                    </h3>
                                    {match.tenantProfile.isDossierFacileCertified && (
                                        <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" /> Certifié
                                        </span>
                                    )}
                                </div>
                                <p className="text-neutral-400 text-sm mb-2">
                                    Candidature pour : <span className="text-white font-medium">{match.listing.title}</span>
                                </p>
                                <div className="flex items-center gap-4 text-sm text-neutral-300">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">{match.tenantProfile.monthlyIncome} €</span>
                                        <span className="text-neutral-500">/ mois</span>
                                    </div>
                                    <div className="w-px h-4 bg-neutral-700"></div>
                                    <div>{match.tenantProfile.situation}</div>
                                    <div className="w-px h-4 bg-neutral-700"></div>
                                    <div className="flex items-center gap-1 text-neutral-400">
                                        <Clock className="h-3 w-3" />
                                        {new Date(match.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/landlord/messages?matchId=${match.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Discuter
                                </Link>
                                {/* Future: View Documents */}
                                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors cursor-not-allowed opacity-50">
                                    <FileText className="h-4 w-4" />
                                    Dossier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
