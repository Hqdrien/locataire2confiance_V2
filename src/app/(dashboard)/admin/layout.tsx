import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Users, Building2, LogOut, Activity, CreditCard } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/"); // Or 404
    }

    return (
        <div className="flex h-screen overflow-hidden bg-black">
            {/* Simple Admin Sidebar */}
            <div className="w-64 border-r border-neutral-800 bg-neutral-900 hidden lg:flex flex-col">
                <div className="p-6 border-b border-neutral-800">
                    <span className="font-bold text-xl text-white flex items-center gap-2">
                        <ShieldCheck className="text-red-500" />
                        Admin Panel
                    </span>
                </div>
                <div className="p-4 space-y-2 flex-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-neutral-800 rounded-md transition-colors">
                        <Users className="h-4 w-4 text-neutral-400" /> Vue d'ensemble
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-neutral-800 rounded-md transition-colors">
                        <Users className="h-4 w-4 text-blue-500" /> Utilisateurs
                    </Link>
                    <Link href="/admin/listings" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-neutral-800 rounded-md transition-colors">
                        <Building2 className="h-4 w-4 text-purple-500" /> Annonces
                    </Link>
                    <Link href="/admin/activity" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-neutral-800 rounded-md transition-colors">
                        <Activity className="h-4 w-4 text-green-500" /> Activité
                    </Link>
                    <Link href="/admin/payments" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-neutral-800 rounded-md transition-colors">
                        <CreditCard className="h-4 w-4 text-yellow-500" /> Paiements
                    </Link>
                </div>
                <div className="p-4 border-t border-neutral-800">
                    <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
