"use client";

import { CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface DossierFacileLinkProps {
    isCertified: boolean;
    dossierUrl?: string | null;
}

export function DossierFacileLink({ isCertified, dossierUrl }: DossierFacileLinkProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("df_linked") === "true") {
            // Clean URL
            router.replace("/tenant/dashboard");
        }
    }, [searchParams, router]);

    const handleLink = () => {
        setIsLoading(true);
        // Redirect to our mock API
        window.location.href = "/api/dossierfacile/link";
    };

    if (isCertified) {
        return (
            <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-700/50 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle className="h-24 w-24 text-blue-400" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                        <CheckCircle className="text-blue-400 h-6 w-6" />
                        Dossier Certifié
                    </h3>
                    <p className="text-blue-200 text-sm mb-4 max-w-md">
                        Votre dossier est synchronisé avec l'État via DossierFacile. Il apparaît comme "Vérifié" aux propriétaires, augmentant vos chances de 30%.
                    </p>
                    {dossierUrl && (
                        <a
                            href={dossierUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                        >
                            Voir sur DossierFacile <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group hover:border-blue-700/50 transition-colors">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        Certifier mon dossier
                    </h3>
                    <p className="text-neutral-400 text-sm max-w-sm">
                        Liez votre compte <strong>DossierFacile</strong> (service de l'État) pour obtenir le badge certifié.
                    </p>
                </div>
                <button
                    onClick={handleLink}
                    disabled={isLoading}
                    className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-6 py-2",
                        "bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    )}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Connexion..." : "Lier DossierFacile"}
                </button>
            </div>
        </div>
    );
}
