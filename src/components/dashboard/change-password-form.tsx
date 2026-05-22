"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const res = await fetch("/api/account/password", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: formData.get("currentPassword"),
                newPassword: formData.get("newPassword"),
            }),
        });

        setIsLoading(false);

        if (!res.ok) {
            setError(res.status === 400 ? "Mot de passe actuel incorrect." : "Impossible de modifier le mot de passe.");
            return;
        }

        event.currentTarget.reset();
        setMessage("Mot de passe mis à jour.");
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
                <label className="text-sm text-neutral-400">Mot de passe actuel</label>
                <input name="currentPassword" type="password" minLength={8} required className="rounded-md border border-neutral-800 bg-neutral-950 p-2 text-white" />
            </div>
            <div className="grid gap-2">
                <label className="text-sm text-neutral-400">Nouveau mot de passe</label>
                <input name="newPassword" type="password" minLength={8} required className="rounded-md border border-neutral-800 bg-neutral-950 p-2 text-white" />
            </div>
            {message && <p className="text-sm text-green-500">{message}</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={isLoading} className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50">
                {isLoading ? "Mise à jour..." : "Modifier le mot de passe"}
            </button>
        </form>
    );
}
