import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Connexion - Locataire2Confiance",
    description: "Se connecter à votre espace.",
};

export default function LoginPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/register"
                className="absolute right-4 top-4 md:right-8 md:top-8 text-sm font-medium hover:underline underline-offset-4"
            >
                Inscription
            </Link>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <ShieldCheck className="mr-2 h-6 w-6" />
                    Locataire2Confiance
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Un gain de temps considérable pour sélectionner les meilleurs candidats en toute sécurité.&rdquo;
                        </p>
                        <footer className="text-sm">Marc D., Propriétaire</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Bon retour
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Entrez vos identifiants pour accéder à votre espace.
                        </p>
                    </div>
                    <UserAuthForm mode="login" />
                </div>
            </div>
        </div>
    );
}
