"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Map } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { RoomsFilter } from "@/components/ui/rooms-filter";
import { Modal } from "@/components/ui/modal";
import { MapPicker } from "@/components/ui/map-picker";

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [city, setCity] = useState(searchParams.get("city") || "");
    const [radius, setRadius] = useState(searchParams.get("radius") || "0");
    const [error, setError] = useState("");
    const [isMapOpen, setIsMapOpen] = useState(false);

    // State for budget
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [priceRange, setPriceRange] = useState([0, 3000]);

    // State for surface
    const [minSurface, setMinSurface] = useState(searchParams.get("minSurface") || "");
    const [maxSurface, setMaxSurface] = useState(searchParams.get("maxSurface") || "");
    const [surfaceRange, setSurfaceRange] = useState([0, 200]);

    // Sync slider with inputs on load and when inputs change
    useEffect(() => {
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : 3000;
        setPriceRange([min, max]);
    }, [minPrice, maxPrice]);

    useEffect(() => {
        const min = minSurface ? parseInt(minSurface) : 0;
        const max = maxSurface ? parseInt(maxSurface) : 200;
        setSurfaceRange([min, max]);
    }, [minSurface, maxSurface]);

    const handlePriceSliderChange = (value: number[]) => {
        setPriceRange(value);
        setMinPrice(value[0].toString());
        setMaxPrice(value[1].toString());
    };

    const handleSurfaceSliderChange = (value: number[]) => {
        setSurfaceRange(value);
        setMinSurface(value[0].toString());
        setMaxSurface(value[1].toString());
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (minPrice && maxPrice && parseInt(minPrice) > parseInt(maxPrice)) {
            setError("Le budget minimum ne peut pas être supérieur au maximum.");
            return;
        }

        if (minSurface && maxSurface && parseInt(minSurface) > parseInt(maxSurface)) {
            setError("La surface minimum ne peut pas être supérieure au maximum.");
            return;
        }

        const params = new URLSearchParams();
        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (minSurface) params.set("minSurface", minSurface);
        if (maxSurface) params.set("maxSurface", maxSurface);
        if (radius) params.set("radius", radius);

        // Preserve minRooms
        const currentMinRooms = searchParams.get("minRooms");
        if (currentMinRooms) params.set("minRooms", currentMinRooms);

        router.push(`/tenant/search?${params.toString()}`);
    };

    const handleMapSelect = (location: string) => {
        setCity(location);
        setIsMapOpen(false);
    };

    return (
        <>
            <form onSubmit={handleSearch} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 mb-8 space-y-6">
                {/* Top Row: City + Radius + Map Button */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 w-full space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Ville cible</label>
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <CityAutocomplete
                                    value={city}
                                    onChange={setCity}
                                    placeholder="Paris, Lyon..."
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMapOpen(true)}
                                className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white p-2 rounded-md transition-colors"
                                title="Sélectionner sur la carte"
                            >
                                <Map className="h-5 w-5" />
                            </button>
                            <select
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                className="w-24 bg-neutral-950 border border-neutral-800 rounded-md p-2 text-white text-sm"
                            >
                                <option value="0">+ 0 km</option>
                                <option value="5">+ 5 km</option>
                                <option value="10">+ 10 km</option>
                                <option value="20">+ 20 km</option>
                                <option value="50">+ 50 km</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Price Slider Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-neutral-400">Budget (€)</label>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-white text-sm pr-8"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                />
                                <span className="absolute right-3 top-2 text-neutral-500 text-sm">€</span>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-white text-sm pr-8"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                />
                                <span className="absolute right-3 top-2 text-neutral-500 text-sm">€</span>
                            </div>
                        </div>
                        <Slider
                            defaultValue={[0, 3000]}
                            value={priceRange}
                            max={5000}
                            step={50}
                            onValueChange={handlePriceSliderChange}
                            className="py-4"
                        />
                    </div>

                    {/* Surface Slider Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-neutral-400">Surface (m²)</label>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-white text-sm pr-8"
                                    value={minSurface}
                                    onChange={(e) => setMinSurface(e.target.value)}
                                    placeholder="Min"
                                />
                                <span className="absolute right-3 top-2 text-neutral-500 text-sm">m²</span>
                            </div>
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-white text-sm pr-8"
                                    value={maxSurface}
                                    onChange={(e) => setMaxSurface(e.target.value)}
                                    placeholder="Max"
                                />
                                <span className="absolute right-3 top-2 text-neutral-500 text-sm">m²</span>
                            </div>
                        </div>
                        <Slider
                            defaultValue={[0, 200]}
                            value={surfaceRange}
                            max={300}
                            step={5}
                            onValueChange={handleSurfaceSliderChange}
                            className="py-4"
                        />
                    </div>
                </div>

                {/* Rooms Filter - Full Width */}
                <div className="space-y-2">
                    <RoomsFilter currentValue={searchParams.get("minRooms") ? parseInt(searchParams.get("minRooms")!) : undefined} />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-8 rounded-md">
                        Rechercher
                    </button>
                </div>
            </form>

            <Modal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                title="Sélectionner un emplacement"
            >
                <div className="space-y-2">
                    <p className="text-sm text-neutral-400">Cliquez sur la carte pour définir votre zone de recherche.</p>
                    <MapPicker
                        onSelect={handleMapSelect}
                        initialCity={city}
                    />
                </div>
            </Modal>
        </>
    );
}
