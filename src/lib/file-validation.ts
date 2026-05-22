export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const DOCUMENT_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
] as const;

export const IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export function validateUploadedFile(file: File, allowedTypes: readonly string[] = DOCUMENT_MIME_TYPES) {
    if (!file || file.size === 0) {
        return "Le fichier est vide.";
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        return "Le fichier dépasse la taille maximale de 5 Mo.";
    }

    if (!allowedTypes.includes(file.type)) {
        return "Type de fichier non autorisé.";
    }

    return null;
}

export function sanitizeFileName(fileName: string) {
    const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "");
    return cleaned || "upload";
}
