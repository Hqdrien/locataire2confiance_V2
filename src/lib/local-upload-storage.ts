import { unlink } from "fs/promises";
import { join, normalize } from "path";

export async function deleteLocalUpload(storageKey: string | null | undefined) {
    if (!storageKey || !storageKey.startsWith("/uploads/")) {
        return;
    }

    const uploadsRoot = join(process.cwd(), "public", "uploads");
    const filePath = normalize(join(process.cwd(), "public", storageKey));

    if (!filePath.startsWith(uploadsRoot)) {
        return;
    }

    try {
        await unlink(filePath);
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            console.warn("LOCAL_UPLOAD_DELETE_ERROR", error);
        }
    }
}
