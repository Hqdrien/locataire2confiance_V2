"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const identitySchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
});

type IdentityFormData = z.infer<typeof identitySchema>;

interface IdentityStepProps {
    initialData?: Partial<IdentityFormData>;
    onSuccess: () => void;
}

export function IdentityStep({ initialData, onSuccess }: IdentityStepProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<IdentityFormData>({
        resolver: zodResolver(identitySchema),
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            phone: initialData?.phone || "",
        },
    });

    async function onSubmit(data: IdentityFormData) {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/tenant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ step: "IDENTITY", data }),
            });

            if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

            router.refresh();
            onSuccess();
        } catch (err) {
            setError("Impossible de sauvegarder les modifications. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Informations Personnelles</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Prénom</label>
                            <input
                                {...form.register("firstName")}
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                placeholder="Jean"
                                disabled={isLoading}
                            />
                            {form.formState.errors.firstName && (
                                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Nom</label>
                            <input
                                {...form.register("lastName")}
                                className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                placeholder="Dupont"
                                disabled={isLoading}
                            />
                            {form.formState.errors.lastName && (
                                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Téléphone</label>
                        <input
                            {...form.register("phone")}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            placeholder="06 12 34 56 78"
                            disabled={isLoading}
                        />
                        {form.formState.errors.phone && (
                            <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end pt-4">
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
