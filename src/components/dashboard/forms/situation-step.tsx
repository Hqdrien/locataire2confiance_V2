"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const situationSchema = z.object({
    situation: z.enum(["CDI", "CDD", "STUDENT", "FREELANCE", "RETIRED", "UNEMPLOYED"]),
});

type SituationFormData = z.infer<typeof situationSchema>;

interface SituationStepProps {
    initialData?: Partial<SituationFormData>;
    onSuccess: () => void;
    onBack: () => void;
}

const SITUATION_LABELS: Record<string, string> = {
    CDI: "CDI - Contrat à Durée Indéterminée",
    CDD: "CDD - Contrat à Durée Déterminée",
    STUDENT: "Étudiant",
    FREELANCE: "Indépendant / Freelance",
    RETIRED: "Retraité",
    UNEMPLOYED: "Sans emploi / En recherche",
};

export function SituationStep({ initialData, onSuccess, onBack }: SituationStepProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SituationFormData>({
        resolver: zodResolver(situationSchema),
        defaultValues: {
            situation: (initialData?.situation as any) || "CDI",
        },
    });

    async function onSubmit(data: SituationFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/tenant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "SITUATION", data }),
            });

            if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

            router.refresh();
            onSuccess();
        } catch (err) {
            setError("Impossible de sauvegarder. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Votre Situation Professionnelle</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-neutral-300">Statut actuel</label>
                        <div className="grid gap-3">
                            {Object.entries(SITUATION_LABELS).map(([value, label]) => (
                                <label
                                    key={value}
                                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${form.watch("situation") === value
                                            ? "border-blue-600 bg-blue-600/10 text-white"
                                            : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={value}
                                        {...form.register("situation")}
                                        className="h-4 w-4 border-neutral-600 text-blue-600 focus:ring-blue-600"
                                    />
                                    <span className="font-medium">{label}</span>
                                </label>
                            ))}
                        </div>
                        {form.formState.errors.situation && (
                            <p className="text-sm text-red-500">{form.formState.errors.situation.message}</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isLoading}
                            className="px-6 py-2 rounded-md text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                        >
                            Retour
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 h-10 px-8 py-2 disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Suivant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
