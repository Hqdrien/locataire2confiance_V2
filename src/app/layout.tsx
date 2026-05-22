import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Locataire2Confiance",
    description: "Votre dossier locatif vérifié et sécurisé.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                {children}
                <Toaster position="bottom-right" richColors theme="dark" />
            </body>
        </html>
    );
}
