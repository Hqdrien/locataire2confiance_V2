"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function PayListingButton({ listingId }: { listingId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePay = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/landlord/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId }),
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (err) {
            alert("Erreur de paiement");
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePay}
            disabled={isLoading}
            className={cn(
                "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-500 transition-colors",
                isLoading && "opacity-50 cursor-not-allowed"
            )}
        >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3 w-3" />}
            Publier (100€)
        </button>
    );
}
