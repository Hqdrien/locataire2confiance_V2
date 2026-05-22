"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapPickerClient = dynamic(() => import("./map-picker-client"), {
    loading: () => (
        <div className="h-[400px] w-full bg-neutral-900 rounded-lg animate-pulse flex items-center justify-center">
            <Loader2 className="animate-spin text-neutral-600" />
        </div>
    ),
    ssr: false,
});

interface MapPickerProps {
    onSelect: (location: string) => void;
    initialCity?: string;
}

export function MapPicker(props: MapPickerProps) {
    return <MapPickerClient {...props} />;
}
