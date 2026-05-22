"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

function MapUpdater({ cords }: { cords: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(cords, 13);
    }, [cords, map]);
    return null;
}

const CITY_COORDS: Record<string, [number, number]> = {
    "Paris": [48.8566, 2.3522],
    "Lyon": [45.7640, 4.8357],
    "Marseille": [43.2965, 5.3698],
    "Bordeaux": [44.8378, -0.5792],
    "Lille": [50.6292, 3.0573],
};

export default function MapComponent({ city }: { city: string }) {
    const [coords, setCoords] = useState<[number, number]>([48.8566, 2.3522]); // Default Paris

    useEffect(() => {
        // Simple mock geocoding based on hardcoded list or random offset if unknown
        // In real app, use OpenStreetMap Nominatim API
        if (CITY_COORDS[city]) {
            setCoords(CITY_COORDS[city]);
        }
    }, [city]);

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-neutral-800 relative z-0">
            <MapContainer center={coords} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coords} icon={icon} />
                <MapUpdater cords={coords} />
            </MapContainer>
        </div>
    );
}
