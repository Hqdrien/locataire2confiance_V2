import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function TenantProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { tenantProfile: true },
    });

    if (!user || user.role !== "TENANT") {
        redirect("/");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Mon Dossier Locatif
                </h1>
                <p className="text-neutral-400 mt-2">
                    Complétez les informations ci-dessous pour générer votre dossier certifié.
                </p>
            </div>

            <ProfileForm initialData={user.tenantProfile} />
        </div>
    );
}
