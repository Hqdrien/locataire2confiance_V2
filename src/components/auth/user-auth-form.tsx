"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const userAuthSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    role: z.enum(["TENANT", "LANDLORD"]).optional(), // Optional login, required register
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    mode: "login" | "register";
    defaultRole?: "TENANT" | "LANDLORD";
}

export function UserAuthForm({ className, mode, defaultRole, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof userAuthSchema>>({
        resolver: zodResolver(userAuthSchema),
        defaultValues: {
            email: "",
            password: "",
            role: defaultRole || "TENANT",
        },
    });

    async function onSubmit(data: z.infer<typeof userAuthSchema>) {
        setIsLoading(true);
        setError(null);

        if (mode === "register") {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                setIsLoading(false);
                if (res.status === 409) return setError("Cet email est déjà utilisé.");
                return setError("Une erreur est survenue lors de l'inscription.");
            }

            // Auto login after register
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            setIsLoading(false);
            if (!signInResult?.ok) return setError("Erreur de connexion automatique.");

            router.push(data.role === "LANDLORD" ? "/landlord/dashboard" : "/tenant/dashboard");
            router.refresh();
        } else {
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            setIsLoading(false);

            if (!signInResult?.ok) {
                return setError("Email ou mot de passe incorrect.");
            }

            // Fetch session to check role and redirect correctly
            const session = await getSession();

            if (session?.user) {
                const role = (session.user as any).role;
                if (role === "LANDLORD") {
                    router.push("/landlord/dashboard");
                } else if (role === "TENANT") {
                    router.push("/tenant/dashboard");
                } else if (role === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/");
                }
            } else {
                router.push("/tenant/dashboard"); // Fallback
            }

            router.refresh();
        }
    }

    return (
        <div className={className} {...props}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                        <input
                            id="email"
                            placeholder="nom@exemple.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            placeholder="********"
                            type="password"
                            autoComplete={mode === "register" ? "new-password" : "current-password"}
                            disabled={isLoading}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("password")}
                        />
                        {form.formState.errors.password && (
                            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    {mode === "register" && !defaultRole && (
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none">Je suis</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...form.register("role")}
                            >
                                <option value="TENANT">Locataire</option>
                                <option value="LANDLORD">Propriétaire</option>
                            </select>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {mode === "register" ? "Créer un compte" : "Se connecter"}
                    </button>
                </div>
            </form>

            {mode === "login" && (
                <div className="mt-4 space-y-2 text-center text-sm text-gray-500">
                    <div>Pas encore de compte ? <Link href="/register" className="underline hover:text-primary">S&apos;inscrire</Link></div>
                    <Link href="/forgot-password" className="block underline hover:text-primary">Mot de passe oublié ?</Link>
                </div>
            )}
            {mode === "register" && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Déjà un compte ? <Link href="/login" className="underline hover:text-primary">Se connecter</Link>
                </div>
            )}
        </div>
    );
}
