import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { DOCUMENT_MIME_TYPES, sanitizeFileName, validateUploadedFile } from "@/lib/file-validation";
import { deleteLocalUpload } from "@/lib/local-upload-storage";
// Removed uuid import to avoid dependency issues
// import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        if (!type) {
            return new NextResponse("Missing document type", { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const validationError = validateUploadedFile(file, DOCUMENT_MIME_TYPES);

        if (validationError) {
            return new NextResponse(validationError, { status: 415 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to public/uploads (MVP only - usage S3 prop in prod)
        // Use crypto.randomUUID() which is native in recent Node.js versions
        const uniqueName = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
        const uploadPath = join(process.cwd(), "public", "uploads", uniqueName);

        await writeFile(uploadPath, buffer);

        // Update DB
        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tenantProfile: true }
        });

        if (!user?.tenantProfile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        const tenantProfileId = user.tenantProfile.id;

        const previousDocument = await prisma.document.findFirst({
            where: {
                tenantProfileId,
                type: type as any,
            },
        });

        const document = await prisma.$transaction(async (tx) => {
            if (previousDocument) {
                await tx.document.delete({ where: { id: previousDocument.id } });
            }

            return tx.document.create({
                data: {
                    tenantProfileId,
                    type: type as any,
                    storageKey: `/uploads/${uniqueName}`,
                    status: "UPLOADED",
                },
            });
        });

        if (previousDocument) {
            await deleteLocalUpload(previousDocument.storageKey);
        }

        await prisma.activityLog.create({
            data: {
                userId,
                action: previousDocument ? "DOCUMENT_REPLACED" : "DOCUMENT_UPLOADED",
                entity: "Document",
                entityId: document.id,
            },
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
