"use client";

import { useState } from "react";

export function ShareDossierButton() {
    const [url, setUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createShareLink() {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/tenant/dossier/share", { method: "POST" });
        setIsLoading(false);

        if (!res.ok) {
            setError(res.status === 402 ? "Activez votre abonnement pour partager votre dossier." : "Impossible de créer le lien.");
            return;
        }

        const data = await res.json();
        setUrl(data.url);
        await navigator.clipboard?.writeText(data.url);
    }

    return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold text-white">Lien de partage sécurisé</h3>
            <p className="mt-2 text-sm text-neutral-400">Générez un lien temporaire valable 14 jours pour transmettre votre dossier.</p>
            <button onClick={createShareLink} disabled={isLoading} className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                {isLoading ? "Création..." : "Créer un lien de partage"}
            </button>
            {url && <p className="mt-3 break-all text-sm text-green-500">Lien copié : {url}</p>}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
    );
}
