"use client";

import { useState } from "react";
import { Upload, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    endpoint: string;
    onUploadComplete: (res: any) => void;
    onUploadError: (error: Error) => void;
    label?: string;
}

export function FileUpload({ endpoint, onUploadComplete, onUploadError, label }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || "Upload failed");
            }

            const data = await res.json();
            onUploadComplete(data);
        } catch (error) {
            setError((error as Error).message);
            onUploadError(error as Error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={cn(
                "relative flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed transition-colors",
                isDragOver ? "border-blue-500 bg-blue-500/10" : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800",
                isUploading && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                    handleFile(e.dataTransfer.files[0]);
                }
            }}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isUploading}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleFile(e.target.files[0]);
                    }
                }}
            />

            {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
            ) : (
                <div className="flex flex-col items-center text-center p-4">
                    <Upload className="h-6 w-6 text-neutral-400 mb-2" />
                    <p className="text-sm text-neutral-400 font-medium">
                        {label || "Cliquez ou glissez un fichier"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">PDF, JPG, PNG (max 5Mo)</p>
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                </div>
            )}
        </div>
    );
}
