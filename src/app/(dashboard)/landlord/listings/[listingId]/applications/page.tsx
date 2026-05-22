import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/landlord/kanban-board";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ApplicationsPage({ params }: { params: { listingId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "LANDLORD") {
        redirect("/login");
    }

    const listing = await prisma.listing.findUnique({
        where: { id: params.listingId },
        include: {
            matches: {
                include: {
                    tenantProfile: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    });

    if (!listing || listing.landlordId !== (session.user as any).id) {
        redirect("/landlord/listings");
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link href="/landlord/listings" className="text-sm text-neutral-400 hover:text-white flex items-center mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Retour aux annonces
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        Candidatures : {listing.title}
                    </h1>
                </div>
            </div>

            <KanbanBoard matches={listing.matches} />
        </div>
    );
}
