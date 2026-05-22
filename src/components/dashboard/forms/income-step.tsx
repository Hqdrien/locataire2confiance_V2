"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const incomeSchema = z.object({
    monthlyIncome: z.number().min(0, "Le revenu ne peut pas être négatif"),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeStepProps {
    initialData?: Partial<IncomeFormData>;
    onSuccess: () => void;
    onBack: () => void;
}

export function IncomeStep({ initialData, onSuccess, onBack }: IncomeStepProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<IncomeFormData>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            monthlyIncome: initialData?.monthlyIncome || 0,
        },
    });

    async function onSubmit(data: IncomeFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/tenant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "INCOME", data }),
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
                <h2 className="text-xl font-semibold mb-4 text-white">Vos Revenus Mensuels</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Revenu net mensuel (avant impôts)</label>
                        <div className="relative">
                            <input
                                type="number"
                                {...form.register("monthlyIncome", { valueAsNumber: true })}
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 pl-3 pr-10 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                placeholder="2000"
                                disabled={isLoading}
                            />
                            <span className="absolute right-3 top-2.5 text-neutral-500 text-sm">€</span>
                        </div>
                        {form.formState.errors.monthlyIncome && (
                            <p className="text-sm text-red-500">{form.formState.errors.monthlyIncome.message}</p>
                        )}
                        <p className="text-xs text-neutral-500">
                            Indiquez l'ensemble de vos revenus nets mensuels (salaire, aides, pensions...).
                        </p>
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
