"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
            <LogOut className="h-4 w-4" />
            Déconnexion
        </button>
    );
}
