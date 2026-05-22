"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function RoleFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);
        if (role && role !== "ALL") {
            params.set("role", role);
        } else {
            params.delete("role");
        }
        router.replace(`?${params.toString()}`);
    };

    return (
        <select
            defaultValue={searchParams.get("role") || "ALL"}
            onChange={(e) => handleFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700"
        >
            <option value="ALL">Tous les rôles</option>
            <option value="TENANT">Locataire</option>
            <option value="LANDLORD">Propriétaire</option>
            <option value="ADMIN">Administrateur</option>
        </select>
    );
}
