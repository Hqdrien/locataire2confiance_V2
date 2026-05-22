"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { tenantProfileSchema, TenantProfileValues } from "@/lib/validations/tenant";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
    initialData?: Partial<TenantProfileValues>;
}

export function TenantProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<TenantProfileValues>({
        resolver: zodResolver(tenantProfileSchema) as any,
        defaultValues: {
            firstName: initialData?.firstName || "",
            lastName: initialData?.lastName || "",
            phone: initialData?.phone || "",
            situation: initialData?.situation || "CDI",
            monthlyIncome: initialData?.monthlyIncome || 0,
            guarantorType: initialData?.guarantorType || "NONE",
        },
    });

    async function onSubmit(data: TenantProfileValues) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/tenant/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Erreur sauvegarde");

            router.refresh();
            alert("Profil mis à jour avec succès !");
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl bg-white p-8 rounded-xl border shadow-sm">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Prénom</label>
                    <input {...form.register("firstName")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="Jean" />
                    {form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nom</label>
                    <input {...form.register("lastName")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="Dupont" />
                    {form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <input {...form.register("phone")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm" placeholder="06 12 34 56 78" />
                {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Situation Professionnelle</label>
                    <select {...form.register("situation")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm">
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="STUDENT">Étudiant</option>
                        <option value="FREELANCE">Indépendant / Freelance</option>
                        <option value="RETIRED">Retraité</option>
                        <option value="UNEMPLOYED">Sans emploi</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Revenus Mensuels Nains (€)</label>
                    <input type="number" {...form.register("monthlyIncome")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Garant</label>
                <select {...form.register("guarantorType")} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm">
                    <option value="NONE">Aucun</option>
                    <option value="PHYSICAL">Garant Physique (Parent, Ami...)</option>
                    <option value="VISALE">Garantie Visale</option>
                    <option value="OTHER">Autre organisme</option>
                </select>
            </div>

            <button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground h-10 px-4 py-2 rounded-md w-full flex justify-center items-center">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Enregistrer mon profil
            </button>
        </form>
    );
}
