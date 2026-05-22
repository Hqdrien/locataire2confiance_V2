"use client";

import { useState } from "react";
import { CheckCircle, Link as LinkIcon, Loader2 } from "lucide-react";

export function DossierFacileConnect() {
    const [status, setStatus] = useState<"IDLE" | "LOADING" | "CONNECTED">("IDLE");
    const [dfUrl, setDfUrl] = useState("");

    const handleConnect = async () => {
        if (!dfUrl.includes("dossierfacile.fr")) {
            alert("Veuillez entrer une URL valide dossierfacile.fr");
            return;
        }
        setStatus("LOADING");
        // Simulate API verification
        setTimeout(() => {
            setStatus("CONNECTED");
        }, 1500);
    };

    if (status === "CONNECTED") {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-green-800">Compte DossierFacile Relié</h3>
                    <p className="text-sm text-green-600">Votre statut "Vérifié par l'État" est actif.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Officiel</span>
                Importer DossierFacile
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                Vous avez déjà un compte validé sur <strong>DossierFacile.fr</strong> ? Reliez-le pour obtenir le badge de confiance instantané.
            </p>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="url"
                        placeholder="https://www.dossierfacile.fr/dossier/..."
                        value={dfUrl}
                        onChange={(e) => setDfUrl(e.target.value)}
                        className="pl-9 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <button
                    onClick={handleConnect}
                    disabled={status === "LOADING"}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {status === "LOADING" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Importer"}
                </button>
            </div>
        </div>
    );
}
