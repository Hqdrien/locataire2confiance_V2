import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
                    <p className="text-sm text-muted-foreground">Entrez votre email pour recevoir un lien sécurisé.</p>
                </div>
                <ForgotPasswordForm />
                <Link href="/login" className="text-center text-sm underline hover:text-primary">Retour à la connexion</Link>
            </div>
        </div>
    );
}
