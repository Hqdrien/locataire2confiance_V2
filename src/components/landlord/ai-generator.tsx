"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIGeneratorProps {
    onGenerate: (text: string) => void;
    context: {
        city?: string;
        surface?: number;
        rooms?: number;
    };
}

export function AIGenerator({ onGenerate, context }: AIGeneratorProps) {
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!context.city || !context.surface) {
            alert("Veuillez remplir au moins la ville et la surface pour générer une description.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(context),
            });

            if (!res.ok) throw new Error("Génération échouée");

            const data = await res.json();
            onGenerate(data.description);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la génération");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
            {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
                <Sparkles className="w-3 h-3" />
            )}
            {loading ? "Génération en cours..." : "Générer une description avec l'IA"}
        </button>
    );
}
