"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AdminUserActionsProps {
    userId: string;
    isBanned: boolean;
}

export function AdminUserActions({ userId, isBanned }: AdminUserActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onAction = async () => {
        try {
            setIsLoading(true);
            const action = isBanned ? "unban" : "ban";
            const response = await fetch(`/api/admin/users/${userId}/${action}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            toast.success(isBanned ? "Utilisateur débanni avec succès" : "Utilisateur banni avec succès");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={onAction}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isBanned
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
                }`}
        >
            {isBanned ? (
                <>
                    <CheckCircle className="h-4 w-4" />
                    Débannir l'utilisateur
                </>
            ) : (
                <>
                    <Ban className="h-4 w-4" />
                    Bannir l'utilisateur
                </>
            )}
        </button>
    );
}
