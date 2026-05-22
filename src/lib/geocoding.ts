export const CITY_COORDS: Record<string, [number, number]> = {
    "Paris": [48.8566, 2.3522],
    "Lyon": [45.7640, 4.8357],
    "Marseille": [43.2965, 5.3698],
    "Bordeaux": [44.8378, -0.5792],
    "Lille": [50.6292, 3.0573],
    "Toulouse": [43.6047, 1.4442],
    "Nice": [43.7102, 7.2620],
    "Nantes": [47.2184, -1.5536],
    "Strasbourg": [48.5734, 7.7521],
    "Montpellier": [43.6108, 3.8767],
    "Rennes": [48.1173, -1.6778],
    "Reims": [49.2583, 4.0317],
    "Le Havre": [49.4944, 0.1079],
    "Saint-Étienne": [45.4397, 4.3872],
    "Toulon": [43.1242, 5.928],
};

// Haversine formula to calculate distance between two points in km
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export async function getCoordinates(city: string): Promise<[number, number] | null> {
    // 1. Check Cache/Mock
    // Basic normalization: capitalize first letter, rest lowercase
    const normalizedCity = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === city.toLowerCase());

    if (normalizedCity) {
        return CITY_COORDS[normalizedCity];
    }

    // 2. Fetch from External API (Data Gouv)
    try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}&type=municipality&limit=1`);
        if (response.ok) {
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const geometry = data.features[0].geometry;
                if (geometry && geometry.coordinates) {
                    // API returns [lon, lat], we use [lat, lon]
                    const [lon, lat] = geometry.coordinates;
                    return [lat, lon];
                }
            }
        }
    } catch (error) {
        console.error("Error fetching coordinates for", city, error);
    }

    return null;
}
