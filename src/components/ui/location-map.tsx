"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapComponent = dynamic(() => import("./map-component"), {
    loading: () => <div className="h-[300px] w-full bg-neutral-900 rounded-lg animate-pulse flex items-center justify-center"><Loader2 className="animate-spin text-neutral-600" /></div>,
    ssr: false
});

interface LocationMapProps {
    city: string;
}

export function LocationMap({ city }: LocationMapProps) {
    return <MapComponent city={city} />;
}
