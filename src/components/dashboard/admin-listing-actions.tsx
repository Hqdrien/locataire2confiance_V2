"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AdminListingActionsProps {
    listingId: string;
    currentStatus: string;
}

export function AdminListingActions({ listingId, currentStatus }: AdminListingActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onArchive = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/listings/${listingId}/archive`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Error");

            toast.success("Annonce archivée avec succès");
            router.refresh();
        } catch (error) {
            toast.error("Erreur lors de l'archivage");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette annonce ? Cette action est irréversible.")) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/listings/${listingId}/delete`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Error");

            toast.success("Annonce supprimée avec succès");
            router.push("/admin/listings");
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {currentStatus !== "ARCHIVED" && (
                <button
                    onClick={onArchive}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors border border-neutral-700 disabled:opacity-50"
                >
                    <Archive className="h-4 w-4" />
                    Archiver l'annonce
                </button>
            )}

            <button
                onClick={onDelete}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium transition-colors border border-red-500/20 disabled:opacity-50"
            >
                <Trash2 className="h-4 w-4" />
                Supprimer définitivement
            </button>
        </div>
    );
}
