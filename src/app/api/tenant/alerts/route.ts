import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const alertSchema = z.object({
    city: z.string().min(2),
    maxRent: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
    minSurface: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
    minRooms: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
    emailEnabled: z.boolean().default(true),
});

async function getTenantProfileId() {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).id) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { tenantProfile: true },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        return null;
    }

    return user.tenantProfile.id;
}

export async function POST(req: Request) {
    try {
        const tenantProfileId = await getTenantProfileId();

        if (!tenantProfileId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = alertSchema.parse(await req.json());
        const alert = await prisma.tenantSearchAlert.create({
            data: {
                tenantProfileId,
                city: data.city,
                maxRent: data.maxRent || null,
                minSurface: data.minSurface || null,
                minRooms: data.minRooms || null,
                emailEnabled: data.emailEnabled,
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse("Invalid data", { status: 422 });
        }
        console.error("TENANT_ALERT_CREATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
