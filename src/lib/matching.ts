import { prisma } from "@/lib/prisma";
import { TenantProfile } from "@prisma/client";

export interface MatchingFilters {
    minPrice?: number;
    maxPrice?: number;
    minSurface?: number;
    maxSurface?: number;
    minRooms?: number;
}

export async function findMatchesForTenant(profile: TenantProfile, filters?: MatchingFilters) {
    // Logic: 
    // 1. Rent <= 33% of Income (or Income >= 3 * Rent)
    // 2. Location matching (not implemented strictly for all cities yet, assume global for MVP)
    // 3. Apply optional filters if provided

    // Solvency limit (hard limit)
    const solvencyMaxRent = Math.floor(profile.monthlyIncome / 3);

    // Determine actual max rent to query: lesser of user filter or solvency limit
    // Wait, typically we shouldn't show them things they are NOT solvent for, even if they filter for it?
    // Or maybe we should? Let's check solvency as a hard cap.
    let effectiveMaxRent = solvencyMaxRent;
    if (filters?.maxPrice && filters.maxPrice < solvencyMaxRent) {
        effectiveMaxRent = filters.maxPrice;
    }

    const where: any = {
        status: "PUBLISHED",
        rentAmount: {
            lte: effectiveMaxRent
        }
    };

    // Min Price
    if (filters?.minPrice) {
        where.rentAmount.gte = filters.minPrice;
    }

    // Surface Filters
    if (filters?.minSurface || filters?.maxSurface) {
        where.surface = {};
        if (filters.minSurface) where.surface.gte = filters.minSurface;
        if (filters.maxSurface) where.surface.lte = filters.maxSurface;
    }

    // Rooms Filters
    if (filters?.minRooms) {
        where.rooms = {
            gte: filters.minRooms
        };
    }

    const listings = await prisma.listing.findMany({
        where,
        include: {
            landlord: {
                select: { email: true } // just for info if needed, generally kept hidden
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return listings;
}
