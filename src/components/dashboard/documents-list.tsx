"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Document {
    id: string;
    type: string;
    status: string;
    uploadedAt: string;
}

interface DocumentsListProps {
    initialDocuments: Document[];
    requiredTypes: { type: string; label: string; description?: string }[];
}

export function DocumentsList({ initialDocuments, requiredTypes }: DocumentsListProps) {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const getDocStatus = (type: string) => {
        const doc = documents.find((d) => d.type === type);
        if (!doc) return "MISSING";
        return doc.status;
    };

    const handleUploadSuccess = (newDoc: Document) => {
        setDocuments((prev) => [...prev.filter((d) => d.type !== newDoc.type), newDoc]);
        router.refresh();
    };

    const handleDelete = async (doc: Document) => {
        if (!confirm("Voulez-vous supprimer ce document ?")) {
            return;
        }

        setDeletingId(doc.id);
        const res = await fetch(`/api/tenant/documents/${doc.id}`, { method: "DELETE" });
        setDeletingId(null);

        if (!res.ok) {
            alert("Impossible de supprimer ce document.");
            return;
        }

        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        router.refresh();
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {requiredTypes.map(({ type, label, description }) => {
                const status = getDocStatus(type);
                const doc = documents.find((d) => d.type === type);

                return (
                    <div key={type} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-neutral-800 rounded-lg">
                                    <FileText className="h-5 w-5 text-neutral-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{label}</h3>
                                    {description && <p className="text-xs text-neutral-500">{description}</p>}
                                </div>
                            </div>
                            {status === "UPLOADED" || status === "VERIFIED_DOSSIER_FACILE" ? (
                                <div className="flex items-center gap-1 text-green-500 text-xs font-medium bg-green-500/10 px-2 py-1 rounded-full">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Reçu</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-full">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Manquant</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            {status === "MISSING" ? (
                                <FileUpload
                                    endpoint={`/api/tenant/documents?type=${type}`}
                                    onUploadComplete={handleUploadSuccess}
                                    onUploadError={() => undefined}
                                    label={`Ajouter ${label}`}
                                />
                            ) : (
                                <div className="h-32 flex flex-col items-center justify-center border border-neutral-800 rounded-lg bg-neutral-950/50">
                                    <p className="text-sm text-neutral-400 mb-2">Fichier envoyé</p>
                                    <button
                                        onClick={() => doc && handleDelete(doc)}
                                        disabled={!doc || deletingId === doc.id}
                                        className="text-xs text-blue-500 hover:underline"
                                    >
                                        {doc && deletingId === doc.id ? "Suppression..." : "Supprimer / remplacer"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
