import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/dashboard/listing-card";
import { SearchFilters } from "@/components/dashboard/search-filters";
import { AlertCircle } from "lucide-react";
import { getCoordinates, getDistance } from "@/lib/geocoding";

export default async function TenantSearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
    const minPrice = typeof searchParams.minPrice === "string" ? parseInt(searchParams.minPrice) : undefined;
    const maxPrice = typeof searchParams.maxPrice === "string" ? parseInt(searchParams.maxPrice) : undefined;
    const minSurface = typeof searchParams.minSurface === "string" ? parseInt(searchParams.minSurface) : undefined;
    const maxSurface = typeof searchParams.maxSurface === "string" ? parseInt(searchParams.maxSurface) : undefined;
    const minRooms = typeof searchParams.minRooms === "string" ? parseInt(searchParams.minRooms) : undefined;
    const radius = typeof searchParams.radius === "string" ? parseInt(searchParams.radius) : 0;

    // Build filter query
    const where: any = { status: "PUBLISHED" };

    if (minPrice || maxPrice) {
        where.rentAmount = {};
        if (minPrice) where.rentAmount.gte = minPrice;
        if (maxPrice) where.rentAmount.lte = maxPrice;
    }

    if (minSurface || maxSurface) {
        where.surface = {};
        if (minSurface) where.surface.gte = minSurface;
        if (maxSurface) where.surface.lte = maxSurface;
    }

    if (minRooms) {
        where.rooms = { gte: minRooms };
    }

    // Radius Search Logic
    let listings = [];

    // If exact match required (radius 0) or no city provided
    if (!city || radius === 0) {
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }
        listings = await prisma.listing.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
    } else {
        // Radius Search Enabled
        const centerCoords = await getCoordinates(city);

        if (!centerCoords) {
            // Fallback to text search if city unknown in API
            where.city = { contains: city, mode: 'insensitive' };
            listings = await prisma.listing.findMany({
                where,
                orderBy: { createdAt: "desc" },
            });
        } else {
            // Fetch all listings matching other criteria
            // Optimization: In real app, we would use PostGIS for "WHERE distance < radius"
            const allListings = await prisma.listing.findMany({
                where,
                orderBy: { createdAt: "desc" },
            });

            // Calculate distance for each listing asynchronously
            const listingsWithDistance = await Promise.all(
                allListings.map(async (listing) => {
                    // Use city + zipCode for precise location (avoid ambiguity like Saint-Denis 93 vs 974)
                    const locationQuery = `${listing.city} ${listing.zipCode}`;
                    const listingCoords = await getCoordinates(locationQuery);

                    if (!listingCoords) return { ...listing, distance: Infinity };

                    const distance = getDistance(
                        centerCoords[0], centerCoords[1],
                        listingCoords[0], listingCoords[1]
                    );
                    return { ...listing, distance };
                })
            );

            // Filter by radius
            listings = listingsWithDistance
                .filter(item => item.distance <= radius)
                .map(({ distance, ...listing }) => listing);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                    Rechercher un logement
                </h1>
                <p className="text-neutral-400 mt-2">
                    Trouvez le bien idéal parmi nos annonces vérifiées.
                </p>
            </div>

            <SearchFilters />

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Résultats ({listings.length})</h2>

                {listings.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {listings.map((listing) => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-neutral-800 rounded-xl">
                        <div className="bg-neutral-800 p-4 rounded-full mb-4">
                            <AlertCircle className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Aucun résultat</h3>
                        <p className="text-neutral-400 max-w-sm mt-2">
                            Essayez d'élargir vos critères de recherche (prix, surface, ville).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
