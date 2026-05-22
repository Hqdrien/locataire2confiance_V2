import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { findMatchesForTenant } from "@/lib/matching";
import { ListingCard } from "@/components/dashboard/listing-card";

import { RangeFilter } from "@/components/ui/range-filter";
import { RoomsFilter } from "@/components/ui/rooms-filter";
import { requireActiveTenantSubscription } from "@/lib/subscription";

export default async function TenantMatchesPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: { tenantProfile: true },
    });

    if (!user || user.role !== "TENANT" || !user.tenantProfile) {
        redirect("/");
    }

    await requireActiveTenantSubscription(user.id);

    // Parse filters
    const minPrice = searchParams?.priceMin ? Number(searchParams.priceMin) : undefined;
    const maxPrice = searchParams?.priceMax ? Number(searchParams.priceMax) : undefined;
    const minSurface = searchParams?.surfaceMin ? Number(searchParams.surfaceMin) : undefined;
    const maxSurface = searchParams?.surfaceMax ? Number(searchParams.surfaceMax) : undefined;
    const minRooms = searchParams?.minRooms ? Number(searchParams.minRooms) : undefined;

    const matches = await findMatchesForTenant(user.tenantProfile, {
        minPrice,
        maxPrice,
        minSurface,
        maxSurface,
        minRooms
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Biens correspondants
                </h1>
                <p className="text-neutral-400 mt-2">
                    Ces logements correspondent à votre profil financier (Loyer max: {Math.floor(user.tenantProfile.monthlyIncome / 3)}€).
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-sm">
                <RangeFilter
                    label="Budget (Loyer)"
                    min={0}
                    max={Math.floor(user.tenantProfile.monthlyIncome / 3) + 200} // Allow a bit more range visually, but clamped by query logic if higher
                    step={10}
                    unit="€"
                    paramPrefix="price"
                />
                <div className="w-px bg-neutral-800 hidden md:block"></div>
                <RangeFilter
                    label="Surface"
                    min={9} // Legal min in France
                    max={150}
                    step={1}
                    unit="m²"
                    paramPrefix="surface"
                />
                <div className="w-px bg-neutral-800 hidden md:block"></div>
                <RoomsFilter currentValue={minRooms} />
            </div>

            {matches.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matches.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
                    <p className="text-neutral-500">Aucun bien ne correspond à vos critères pour le moment.</p>
                </div>
            )}
        </div>
    );
}
