
"use client";

import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface RoomsFilterProps {
    currentValue?: number;
}

export function RoomsFilter({ currentValue }: RoomsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (value: number | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set("minRooms", value.toString());
            } else {
                params.delete("minRooms");
            }
            return params.toString();
        },
        [searchParams]
    );

    const options = [
        { label: "Tout", value: null },
        { label: "Studio (T1)", value: 1 },
        { label: "T2+", value: 2 },
        { label: "T3+", value: 3 },
        { label: "T4+", value: 4 },
    ];

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-400">Type de bien</span>
            <div className="flex gap-2 flex-wrap">
                {options.map((opt) => {
                    const isSelected = currentValue === opt.value || (currentValue === undefined && opt.value === null);
                    return (
                        <button
                            key={opt.label}
                            type="button"
                            onClick={() => router.push(`?${createQueryString(opt.value)}`)}
                            className={cn(
                                "px-3 py-1 text-sm rounded-full border transition-all",
                                isSelected
                                    ? "bg-white text-black border-white"
                                    : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600"
                            )}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
