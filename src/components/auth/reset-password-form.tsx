"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        setIsLoading(false);

        if (!res.ok) {
            setError("Le lien est invalide ou expiré.");
            return;
        }

        router.push("/login?reset=success");
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">Nouveau mot de passe</label>
                <input
                    id="password"
                    type="password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="********"
                />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button disabled={isLoading} className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
                {isLoading ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
        </form>
    );
}
