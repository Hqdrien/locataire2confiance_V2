import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ListingForm } from "@/components/dashboard/listing-form";

export default async function CreateListingPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "LANDLORD") {
        redirect("/login");
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Créer une annonce</h1>
                <p className="text-neutral-400 mt-2">
                    Publiez votre bien pour recevoir des dossiers locataires certifiés.
                </p>
            </div>
            <ListingForm />
        </div>
    );
}
