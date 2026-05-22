"use client";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Building2,
    Users,
    LayoutDashboard,
    LogOut,
    PlusCircle,
    MessageCircle
} from "lucide-react";

const sidebarItems = [
    {
        title: "Vue d'ensemble",
        href: "/landlord/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Mes Annonces",
        href: "/landlord/listings",
        icon: Building2,
    },
    {
        title: "Mes Candidats",
        href: "/landlord/candidates",
        icon: Users,
    },
    {
        title: "Messagerie",
        href: "/landlord/messages",
        icon: MessageCircle,
    },
];

export function LandlordSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full border-r bg-muted/10 w-64 hidden lg:flex">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Locataire2Confiance
                    </span>
                </Link>
                <span className="text-xs text-neutral-500 font-medium px-1">Espace Propriétaire</span>
            </div>
            <div className="flex-1 py-6 px-4 space-y-6">
                <div className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/landlord/listings/create"
                    className="flex items-center gap-2 w-full justify-center bg-white text-black text-sm font-semibold py-2 rounded-md hover:bg-neutral-200 transition-colors"
                >
                    <PlusCircle className="h-4 w-4" />
                    Créer une annonce
                </Link>
            </div>
            <div className="p-4 border-t space-y-2">
                <RoleSwitcher currentRole="LANDLORD" />
                <LogoutButton />
            </div>
        </div>
    );
}
