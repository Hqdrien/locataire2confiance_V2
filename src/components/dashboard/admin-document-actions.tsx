"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface AdminDocumentActionsProps {
    documentId: string;
    status: string;
}

export function AdminDocumentActions({ documentId, status }: AdminDocumentActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onValidate = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/documents/${documentId}/validate`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("Error");
            toast.success("Document validé");
            router.refresh();
        } catch (error) {
            toast.error("Erreur lors de la validation");
        } finally {
            setIsLoading(false);
        }
    };

    const onReject = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/admin/documents/${documentId}/reject`, {
                method: "POST",
            });
            if (!response.ok) throw new Error("Error");
            toast.success("Document rejeté");
            router.refresh();
        } catch (error) {
            toast.error("Erreur lors du rejet");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            {status === "VALIDATED" && (
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                    <Check className="h-4 w-4" /> Validé
                </span>
            )}
            {status === "REJECTED" && (
                <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                    <X className="h-4 w-4" /> Rejeté
                </span>
            )}

            <div className="flex items-center gap-1">
                {status !== "VALIDATED" && (
                    <button
                        onClick={onValidate}
                        disabled={isLoading}
                        className="p-1.5 rounded bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                        title="Valider / Re-valider"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                )}
                {status !== "REJECTED" && (
                    <button
                        onClick={onReject}
                        disabled={isLoading}
                        className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Rejeter / Invalider"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
