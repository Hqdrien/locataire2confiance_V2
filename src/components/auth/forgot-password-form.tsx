"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);

        await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        setIsLoading(false);
        setMessage("Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.");
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="nom@exemple.com"
                />
            </div>
            {message && <p className="text-sm text-green-600 text-center">{message}</p>}
            <button disabled={isLoading} className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
                {isLoading ? "Envoi..." : "Envoyer le lien"}
            </button>
        </form>
    );
}
