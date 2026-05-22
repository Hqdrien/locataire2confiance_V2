"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ShareLink = {
    id: string;
    token: string;
    expiresAt: Date;
    viewedAt: Date | null;
    revokedAt: Date | null;
};

export function ShareLinksList({ links, origin }: { links: ShareLink[]; origin: string }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function revokeLink(linkId: string) {
        setLoadingId(linkId);
        await fetch(`/api/tenant/dossier/share/${linkId}`, { method: "PATCH" });
        setLoadingId(null);
        router.refresh();
    }

    const activeLinks = links.filter((link) => !link.revokedAt && new Date(link.expiresAt) > new Date());

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold text-white">Liens actifs</h3>
            <div className="mt-4 space-y-3">
                {activeLinks.map((link) => {
                    const url = `${origin}/shared-dossier/${link.token}`;

                    return (
                        <div key={link.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                            <p className="break-all text-xs text-neutral-300">{url}</p>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                                <span>Expire le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(link.expiresAt))}</span>
                                <span>{link.viewedAt ? "Consulté" : "Non consulté"}</span>
                                <button onClick={() => revokeLink(link.id)} disabled={loadingId === link.id} className="text-red-400 hover:underline disabled:opacity-50">
                                    {loadingId === link.id ? "Révocation..." : "Révoquer"}
                                </button>
                            </div>
                        </div>
                    );
                })}
                {activeLinks.length === 0 && <p className="text-sm text-neutral-400">Aucun lien actif.</p>}
            </div>
        </div>
    );
}
