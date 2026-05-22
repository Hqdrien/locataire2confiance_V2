"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/landlord/image-upload";
import { AIGenerator } from "@/components/landlord/ai-generator";
import { LocationMap } from "@/components/ui/location-map";

const listingSchema = z.object({
    title: z.string().min(5, "Titre trop court"),
    description: z.string().min(20, "Description trop courte"),
    address: z.string().min(5, "Adresse requise"),
    city: z.string().min(2),
    zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
    rentAmount: z.number().min(100),
    surface: z.number().min(9), // 9m2 legal min
    rooms: z.number().min(1),
    photos: z.array(z.string()).min(1, "Au moins une photo est requise"),
});

type ListingFormData = z.infer<typeof listingSchema>;

export function ListingForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ListingFormData>({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            photos: [],
            title: "",
            description: "",
            address: "",
            city: "",
            zipCode: "",
            rentAmount: undefined,
            surface: undefined,
            rooms: undefined,
        }
    });

    const watchedCity = form.watch("city");
    const watchedSurface = form.watch("surface");
    const watchedRooms = form.watch("rooms");
    const watchedPhotos = form.watch("photos");

    const handleAIUpdate = (text: string) => {
        form.setValue("description", text);
    };

    async function onSubmit(data: ListingFormData) {
        setIsLoading(true);
        try {
            const res = await fetch("/api/landlord/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Erreur lors de la création");

            router.push("/landlord/dashboard");
            router.refresh();
        } catch (err) {
            alert("Impossible de créer l'annonce.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Section Photos */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Photos du bien</h2>
                    <ImageUpload
                        value={watchedPhotos}
                        onChange={(urls) => form.setValue("photos", urls)}
                    />
                    {form.formState.errors.photos && <p className="text-red-500 text-xs">{form.formState.errors.photos.message}</p>}
                </div>

                <div className="h-px bg-neutral-800" />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Titre de l'annonce</label>
                    <input
                        {...form.register("title")}
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                        placeholder="Appartement T2 Centre-ville"
                    />
                    {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Adresse</label>
                    <input
                        {...form.register("address")}
                        className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                        placeholder="12 rue de la Paix"
                    />
                    {form.formState.errors.address && <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Ville</label>
                        <input
                            {...form.register("city")}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                            placeholder="Paris"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Code Postal</label>
                        <input
                            {...form.register("zipCode")}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                            placeholder="75001"
                        />
                    </div>
                </div>

                {/* Map Integration */}
                {watchedCity && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Localisation approximative
                        </div>
                        <LocationMap city={watchedCity} />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Type de bien</label>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { label: "Studio", value: 1 },
                            { label: "T2", value: 2 },
                            { label: "T3", value: 3 },
                            { label: "T4", value: 4 },
                            { label: "T5+", value: 5 },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => form.setValue("rooms", opt.value)}
                                className={`px-4 py-2 text-sm rounded-md border transition-all ${watchedRooms === opt.value
                                        ? "bg-white text-black border-white font-medium"
                                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {/* Hidden input to register the field for validation if needed, though setValue handles it with watch */}
                    <input type="hidden" {...form.register("rooms", { valueAsNumber: true })} />
                    {form.formState.errors.rooms && <p className="text-red-500 text-xs">{form.formState.errors.rooms.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Loyer CC (€)</label>
                        <input
                            type="number"
                            {...form.register("rentAmount", { valueAsNumber: true })}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                            placeholder="850"
                        />
                        {form.formState.errors.rentAmount && <p className="text-red-500 text-xs">{form.formState.errors.rentAmount.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Surface (m²)</label>
                        <input
                            type="number"
                            {...form.register("surface", { valueAsNumber: true })}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                            placeholder="45"
                        />
                        {form.formState.errors.surface && <p className="text-red-500 text-xs">{form.formState.errors.surface.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-neutral-300">Description</label>
                        <AIGenerator
                            onGenerate={handleAIUpdate}
                            context={{
                                city: watchedCity,
                                surface: watchedSurface,
                                rooms: watchedRooms
                            }}
                        />
                    </div>
                    <textarea
                        {...form.register("description")}
                        className="flex min-h-[150px] w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:ring-blue-600"
                        placeholder="Description détaillée du bien..."
                    />
                    {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 h-10 px-8 py-2 w-full disabled:opacity-50 transition-colors"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Publier l'annonce
                </button>
            </form>
        </div>
    );
}
