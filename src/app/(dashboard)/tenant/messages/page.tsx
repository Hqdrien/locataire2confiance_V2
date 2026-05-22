
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatWindow } from "@/components/chat/chat-window";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

export default async function TenantMessagesPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | undefined };
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { tenantProfile: true },
    });

    if (!user || !user.tenantProfile) {
        redirect("/");
    }

    // Fetch conversations (Matches that are CONTACTED or where User initiated)
    // Actually, any match with messages or status CONTACTED
    const matches = await prisma.match.findMany({
        where: {
            tenantId: user.tenantProfile.id,
            status: { in: ["CONTACTED", "VIEWED", "NEW"] }
        },
        include: {
            listing: {
                include: { landlord: { select: { email: true } } }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const selectedMatchId = searchParams?.matchId;
    const selectedMatch = matches.find(m => m.id === selectedMatchId);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            {/* Conversation List */}
            <div className={cn(
                "w-full md:w-1/3 flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden",
                selectedMatchId ? "hidden md:flex" : "flex"
            )}>
                <div className="p-4 border-b border-neutral-800 bg-neutral-950">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Messages
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {matches.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500">
                            Aucune conversation. Postulez à une annonce pour démarrer !
                        </div>
                    ) : (
                        matches.map((match) => (
                            <Link
                                key={match.id}
                                href={`/tenant/messages?matchId=${match.id}`}
                                className={cn(
                                    "block p-4 border-b border-neutral-800 hover:bg-neutral-800 transition-colors",
                                    selectedMatchId === match.id ? "bg-blue-900/20 border-l-4 border-l-blue-500" : ""
                                )}
                            >
                                <div className="font-semibold text-white truncate">{match.listing.title}</div>
                                <div className="text-xs text-neutral-400 mt-1">{match.listing.city}</div>
                                <div className="text-sm text-neutral-300 mt-2 truncate">
                                    {match.messages[0]?.content || "Aucun message"}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={cn(
                "flex-1 flex flex-col",
                !selectedMatchId ? "hidden md:flex" : "flex"
            )}>
                {selectedMatch ? (
                    <div className="h-full flex flex-col">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-t-xl p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white">{selectedMatch.listing.title}</h3>
                                <p className="text-xs text-neutral-400">Propriétaire : {selectedMatch.listing.landlord.email}</p>
                            </div>
                            <Link href="/tenant/messages" className="md:hidden text-sm text-neutral-400">
                                Retour
                            </Link>
                        </div>
                        <ChatWindow
                            matchId={selectedMatch.id}
                            currentUserId={user.id}
                        />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-500">
                        Sélectionnez une conversation pour afficher les messages.
                    </div>
                )}
            </div>
        </div>
    );
}
