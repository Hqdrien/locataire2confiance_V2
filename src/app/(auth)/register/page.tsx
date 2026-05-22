import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Inscription - Locataire2Confiance",
    description: "Créer un compte locataire ou propriétaire.",
};

export default function RegisterPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const role = searchParams.role === "LANDLORD" ? "LANDLORD" :
        searchParams.role === "TENANT" ? "TENANT" : undefined;

    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href="/login"
                className="absolute right-4 top-4 md:right-8 md:top-8 text-sm font-medium hover:underline underline-offset-4"
            >
                Connexion
            </Link>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-blue-600" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <ShieldCheck className="mr-2 h-6 w-6" />
                    Locataire2Confiance
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;J&apos;ai trouvé mon logement en moins de deux semaines grâce à un dossier complet et vérifié.
                            Les propriétaires étaient rassurés immédiatement.&rdquo;
                        </p>
                        <footer className="text-sm">Sophie M.</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {role === "LANDLORD" ? "Espace Propriétaire" : "Créer un compte"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {role === "LANDLORD"
                                ? "Publiez vos annonces et recevez des dossiers certifiés."
                                : "Entrez votre email pour commencer votre dossier locatif."
                            }
                        </p>
                    </div>
                    <UserAuthForm mode="register" defaultRole={role} />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        En cliquant sur continuer, vous acceptez nos{" "}
                        <Link href="/cgu" className="underline underline-offset-4 hover:text-primary">
                            CGU
                        </Link>{" "}
                        et notre{" "}
                        <Link href="/politique-confidentialite" className="underline underline-offset-4 hover:text-primary">
                            Politique de confidentialité
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
