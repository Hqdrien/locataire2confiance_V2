import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token || "";

    return (
        <div className="container flex min-h-screen items-center justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col space-y-6">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Nouveau mot de passe</h1>
                    <p className="text-sm text-muted-foreground">Choisissez un mot de passe sécurisé.</p>
                </div>
                {token ? (
                    <ResetPasswordForm token={token} />
                ) : (
                    <p className="text-center text-sm text-red-600">Lien de réinitialisation invalide.</p>
                )}
                <Link href="/login" className="text-center text-sm underline hover:text-primary">Retour à la connexion</Link>
            </div>
        </div>
    );
}
