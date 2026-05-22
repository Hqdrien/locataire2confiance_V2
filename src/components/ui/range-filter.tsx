"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

interface RangeFilterProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    paramPrefix: string; // e.g. "price" -> priceMin, priceMax
}

export function RangeFilter({
    label,
    min,
    max,
    step = 1,
    unit = "",
    paramPrefix,
}: RangeFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial values from URL or defaults
    const initialMin = Number(searchParams.get(`${paramPrefix}Min`)) || min;
    const initialMax = Number(searchParams.get(`${paramPrefix}Max`)) || max;

    const [range, setRange] = useState<[number, number]>([initialMin, initialMax]);
    const [debouncedRange, setDebouncedRange] = useState<[number, number]>([initialMin, initialMax]);

    // Update state if URL changes externally (e.g. back button)
    useEffect(() => {
        const uMin = searchParams.get(`${paramPrefix}Min`);
        const uMax = searchParams.get(`${paramPrefix}Max`);
        if (uMin || uMax) {
            setRange([Number(uMin) || min, Number(uMax) || max]);
        }
    }, [searchParams, paramPrefix, min, max]);

    // Debounce updates
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedRange(range);
        }, 500);

        return () => clearTimeout(timer);
    }, [range]);

    // Push to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const [currentMin, currentMax] = debouncedRange;
        let changed = false;

        // Min
        if (currentMin > min) {
            if (params.get(`${paramPrefix}Min`) !== currentMin.toString()) {
                params.set(`${paramPrefix}Min`, currentMin.toString());
                changed = true;
            }
        } else {
            if (params.has(`${paramPrefix}Min`)) {
                params.delete(`${paramPrefix}Min`);
                changed = true;
            }
        }

        // Max
        if (currentMax < max) {
            if (params.get(`${paramPrefix}Max`) !== currentMax.toString()) {
                params.set(`${paramPrefix}Max`, currentMax.toString());
                changed = true;
            }
        } else {
            if (params.has(`${paramPrefix}Max`)) {
                params.delete(`${paramPrefix}Max`);
                changed = true;
            }
        }

        if (changed) {
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [debouncedRange, router, searchParams, paramPrefix, min, max]);

    const handleSliderChange = (value: number[]) => {
        setRange([value[0], value[1]]);
    };

    const handleInputChange = (index: 0 | 1, value: string) => {
        const numVal = Number(value);
        if (isNaN(numVal)) return;

        // Clamp values? Maybe relax for input and clamp on blur, but let's just allow typing
        const newRange = [...range] as [number, number];
        newRange[index] = numVal;
        setRange(newRange);
    };

    return (
        <div className="space-y-4 w-full md:w-[300px]">
            <label className="text-white font-medium text-sm">{label}</label>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={range[0]}
                        onChange={(e) => handleInputChange(0, e.target.value)}
                        className="w-full h-9 bg-neutral-900 border border-neutral-800 rounded-md text-white text-center pr-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1 focus:ring-neutral-700 text-sm font-medium"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm select-none">{unit}</span>
                </div>

                <div className="relative flex-1">
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={range[1]}
                        onChange={(e) => handleInputChange(1, e.target.value)}
                        className="w-full h-9 bg-neutral-900 border border-neutral-800 rounded-md text-white text-center pr-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-1 focus:ring-neutral-700 text-sm font-medium"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm select-none">{unit}</span>
                </div>
            </div>

            <Slider
                min={min}
                max={max}
                step={step}
                value={range}
                onValueChange={handleSliderChange}
                className="py-2"
            />
        </div>
    );
}
