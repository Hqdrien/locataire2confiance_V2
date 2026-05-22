"use client";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    User,
    FileText,
    Home,
    Settings,
    LogOut,
    LayoutDashboard,
    MessageCircle,
    Euro,
    Clock
} from "lucide-react";

const sidebarItems = [
    {
        title: "Vue d'ensemble",
        href: "/tenant/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Mon Dossier",
        href: "/tenant/profile",
        icon: User,
    },
    {
        title: "Mes Documents",
        href: "/tenant/documents",
        icon: FileText,
    },
    {
        title: "Ma Recherche",
        href: "/tenant/search",
        icon: Home,
    },
    {
        title: "Messagerie",
        href: "/tenant/messages",
        icon: MessageCircle,
    },
    {
        title: "Activité",
        href: "/tenant/activity",
        icon: Clock,
    },
    {
        title: "Simulateur d'aides",
        href: "/tenant/aids", // Assuming this is the correct route
        icon: Euro,
    },
    {
        title: "Paramètres",
        href: "/tenant/settings",
        icon: Settings,
    },
];

export function TenantSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full border-r bg-muted/10 w-64 hidden lg:flex">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Locataire2Confiance
                    </span>
                </Link>
            </div>
            <div className="flex-1 py-6 px-4 space-y-2">
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
            <div className="p-4 border-t space-y-2">
                <RoleSwitcher currentRole="TENANT" />
                <LogoutButton />
            </div>
        </div>
    );
}
