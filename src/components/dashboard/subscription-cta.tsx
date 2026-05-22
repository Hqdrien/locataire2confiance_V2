"use client";

import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SubscriptionCTA() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                body: JSON.stringify({ plan: "TENANT_MONTHLY" }),
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center rounded-full border border-indigo-500/50 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Premium
                    </div>
                    <h2 className="text-3xl font-bold text-white">Boostez votre dossier</h2>
                    <p className="text-neutral-400">
                        Obtenez jusqu'à <span className="text-white font-semibold">5x plus de réponses</span> en certifiant votre solvabilité et en accédant aux annonces exclusives.
                    </p>
                    <ul className="grid gap-2 text-sm text-neutral-300 sm:grid-cols-2">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Garantie Loyers Impayés incluse</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Dossier prioritaire</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Support 24/7</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Accès anticipé aux annonces</li>
                    </ul>
                </div>

                <div className="flex w-full md:w-auto flex-col gap-4 bg-black/40 p-6 rounded-xl border border-neutral-800 backdrop-blur-sm">
                    <div className="text-center">
                        <span className="text-3xl font-bold text-white">9,90€</span>
                        <span className="text-neutral-500">/mois</span>
                    </div>
                    <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className={cn(
                            "inline-flex w-full items-center justify-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50",
                            isLoading && "cursor-not-allowed"
                        )}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Activer mon Boost
                    </button>
                    <p className="text-xs text-center text-neutral-500">Sans engagement, annulable à tout moment.</p>
                </div>
            </div>
        </div>
    );
}
