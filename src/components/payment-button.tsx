"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

interface PaymentButtonProps {
    planType: "TENANT_SUB" | "LANDLORD_ONE";
    label: string;
    className?: string;
}

export function PaymentButton({ planType, label, className }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planType }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Erreur lors de l'initialisation du paiement");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={className || "w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-2"}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            {label}
        </button>
    );
}
