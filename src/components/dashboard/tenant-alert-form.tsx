"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export function TenantAlertForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const res = await fetch("/api/tenant/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city: formData.get("city"),
                maxRent: formData.get("maxRent"),
                minSurface: formData.get("minSurface"),
                minRooms: formData.get("minRooms"),
                emailEnabled: formData.get("emailEnabled") === "on",
            }),
        });

        setIsLoading(false);

        if (!res.ok) {
            setError("Impossible de créer cette alerte.");
            return;
        }

        event.currentTarget.reset();
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-xl font-bold text-white">Créer une alerte</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input name="city" required minLength={2} placeholder="Ville" className="rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-white" />
                <input name="maxRent" type="number" min={1} placeholder="Loyer max" className="rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-white" />
                <input name="minSurface" type="number" min={1} placeholder="Surface min" className="rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-white" />
                <input name="minRooms" type="number" min={1} placeholder="Pièces min" className="rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm text-white" />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-neutral-300">
                <input name="emailEnabled" type="checkbox" defaultChecked /> Recevoir les notifications email
            </label>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <button disabled={isLoading} className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                {isLoading ? "Création..." : "Enregistrer l'alerte"}
            </button>
        </form>
    );
}
