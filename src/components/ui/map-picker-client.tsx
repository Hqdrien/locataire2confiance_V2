"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet generic marker icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerClientProps {
    onSelect: (location: string) => void;
    initialCity?: string;
}

function LocationMarker({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationFound(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon} />
    );
}

export default function MapPickerClient({ onSelect, initialCity }: MapPickerClientProps) {
    const [center, setCenter] = useState<[number, number]>([46.603354, 1.888334]); // France center
    const [zoom, setZoom] = useState(5);

    // If initialCity is provided, try to focus on it (optional enhancement)
    // For now we start at France level or default

    const handleLocationFound = async (lat: number, lng: number) => {
        try {
            const res = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}`);
            if (res.ok) {
                const data = await res.json();
                if (data.features && data.features.length > 0) {
                    const props = data.features[0].properties;
                    // Format: City ZipCode (same format as expected by search)
                    const locationString = `${props.city} ${props.postcode}`;
                    onSelect(locationString);
                }
            }
        } catch (error) {
            console.error("Reverse geocoding failed", error);
        }
    };

    return (
        <div className="h-[400px] w-full relative z-0">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                className="rounded-lg"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationFound={handleLocationFound} />
            </MapContainer>
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded-md text-xs z-[1000] text-center pointer-events-none">
                Cliquez sur la carte pour sélectionner une ville
            </div>
        </div>
    );
}
