import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as z from "zod";

const identitySchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string(),
});

const situationSchema = z.object({
    situation: z.enum(["CDI", "CDD", "STUDENT", "FREELANCE", "RETIRED", "UNEMPLOYED"]),
});

const incomeSchema = z.object({
    monthlyIncome: z.number().min(0),
});

const guarantorSchema = z.object({
    guarantorType: z.enum(["NONE", "PHYSICAL", "VISALE", "OTHER"]),
});

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { step, data } = body;

        const userId = (session.user as any).id;

        let updateData = {};

        switch (step) {
            case "IDENTITY":
                const identityData = identitySchema.parse(data);
                updateData = {
                    firstName: identityData.firstName,
                    lastName: identityData.lastName,
                    phone: identityData.phone,
                };
                break;

            case "SITUATION":
                const situationData = situationSchema.parse(data);
                updateData = {
                    situation: situationData.situation,
                };
                break;

            case "INCOME":
                const incomeData = incomeSchema.parse(data);
                updateData = {
                    monthlyIncome: incomeData.monthlyIncome,
                };
                break;

            case "GUARANTOR":
                const guarantorData = guarantorSchema.parse(data);
                updateData = {
                    guarantorType: guarantorData.guarantorType,
                    // Calculate score based on completion, could be more sophisticated
                };
                break;

            default:
                return new NextResponse("Invalid step", { status: 400 });
        }

        await prisma.tenantProfile.update({
            where: { userId },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
