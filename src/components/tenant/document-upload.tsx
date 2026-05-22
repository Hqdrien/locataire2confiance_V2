"use client";

import { useState } from "react";
import { Upload, X, File, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentUploadProps {
    type: string; // e.g. "IDENTITY", "INCOME"
    label: string;
    existingUrl?: string;
}

export function DocumentUpload({ type, label, existingUrl }: DocumentUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState<string | undefined>(existingUrl);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            const res = await fetch("/api/tenant/documents", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setUrl(data.url);
            setFile(null);
            router.refresh(); // Refresh to update progress
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'upload");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{label}</span>
                {url && <CheckCircle className="h-4 w-4 text-green-600" />}
            </div>

            {url ? (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                    <File className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">Document envoyé</span>
                    <button
                        onClick={() => setUrl(undefined)}
                        className="ml-auto text-gray-500 hover:text-red-500"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-xs file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-gray-900 text-white py-1 rounded text-xs font-medium flex justify-center items-center"
                        >
                            {uploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                            Envoyer
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
