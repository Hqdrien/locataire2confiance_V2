import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IMAGE_MIME_TYPES, validateUploadedFile } from "@/lib/file-validation";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const validationError = validateUploadedFile(file, IMAGE_MIME_TYPES);

        if (validationError) {
            return new NextResponse(validationError, { status: 415 });
        }

        const url = await uploadToS3(file, "listings");

        return NextResponse.json({ url });
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
