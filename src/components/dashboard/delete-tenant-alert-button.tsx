"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteTenantAlertButton({ alertId }: { alertId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function removeAlert() {
        setIsLoading(true);
        await fetch(`/api/tenant/alerts/${alertId}`, { method: "DELETE" });
        setIsLoading(false);
        router.refresh();
    }

    return (
        <button onClick={removeAlert} disabled={isLoading} className="text-xs text-red-400 hover:underline disabled:opacity-50">
            {isLoading ? "Suppression..." : "Supprimer"}
        </button>
    );
}
