"use client";

import { useState } from "react";
import { Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

export function RoleSwitcher({ currentRole }: { currentRole: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSwitch = async () => {
        setLoading(true);
        await fetch("/api/auth/switch-role", { method: "POST" });
        // Refresh to update session and redirect (handled by guards mostly, but better to force reload)
        window.location.href = currentRole === "TENANT" ? "/landlord/dashboard" : "/tenant/dashboard";
    };

    return (
        <button
            onClick={handleSwitch}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors mb-2"
        >
            <Repeat className="h-4 w-4" />
            {currentRole === "TENANT" ? "Passer Propriétaire" : "Passer Locataire"}
        </button>
    );
}
