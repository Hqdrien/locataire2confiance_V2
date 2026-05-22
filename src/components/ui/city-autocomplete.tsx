"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";

interface CityAutocompleteProps {
    value: string;
    onChange: (city: string) => void;
    placeholder?: string;
    className?: string;
}

interface Suggestion {
    properties: {
        label: string;
        city: string;
        postcode: string;
        context: string; // e.g. "93, Seine-Saint-Denis, Île-de-France"
    }
}

export function CityAutocomplete({
    value,
    onChange,
    placeholder = "Rechercher une ville...",
    className = ""
}: CityAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Sync query with external value changes
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Handle clicks outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounce fetch
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length > 2 && isOpen) {
                try {
                    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`);
                    if (response.ok) {
                        const data = await response.json();
                        setSuggestions(data.features || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch cities", error);
                }
            } else if (query.length <= 2) {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
        onChange(e.target.value); // Update parent immediately for typing
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        // Use label (usually "City Postcode") or construct specific string to ensure uniqueness for API
        // "Saint-Denis" -> Ambiguous. "Saint-Denis 93200" -> Unique.
        const specificLocation = `${suggestion.properties.city} ${suggestion.properties.postcode}`;
        setQuery(specificLocation);
        onChange(specificLocation);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md pl-9 p-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700"
                />
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 hover:bg-neutral-800 cursor-pointer flex items-center justify-between text-sm text-neutral-300 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-neutral-500" />
                                <span>{suggestion.properties.city}</span>
                            </div>
                            <span className="text-neutral-500 text-xs">{suggestion.properties.context.split(',')[0]}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
