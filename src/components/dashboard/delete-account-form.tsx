"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import type { FormEvent } from "react";

export function DeleteAccountForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const res = await fetch("/api/account/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: formData.get("password"),
                confirmation: formData.get("confirmation"),
            }),
        });

        setIsLoading(false);

        if (!res.ok) {
            setError(res.status === 400 ? "Mot de passe incorrect." : "Impossible de supprimer le compte.");
            return;
        }

        await signOut({ callbackUrl: "/" });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-red-900/50 bg-red-950/20 p-6">
            <div>
                <h2 className="text-xl font-semibold text-red-200">Zone dangereuse</h2>
                <p className="mt-2 text-sm text-red-200/70">Cette action anonymise votre compte, révoque vos liens de partage actifs et désactive votre accès.</p>
            </div>
            <div className="grid gap-2">
                <label className="text-sm text-neutral-400">Mot de passe</label>
                <input name="password" type="password" minLength={8} required className="rounded-md border border-neutral-800 bg-neutral-950 p-2 text-white" />
            </div>
            <div className="grid gap-2">
                <label className="text-sm text-neutral-400">Tapez SUPPRIMER pour confirmer</label>
                <input name="confirmation" pattern="SUPPRIMER" required className="rounded-md border border-neutral-800 bg-neutral-950 p-2 text-white" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={isLoading} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                {isLoading ? "Suppression..." : "Supprimer mon compte"}
            </button>
        </form>
    );
}
