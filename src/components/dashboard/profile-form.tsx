"use client";

import { useState } from "react";
import { IdentityStep } from "./forms/identity-step";
import { SituationStep } from "./forms/situation-step";
import { IncomeStep } from "./forms/income-step";
import { GuarantorStep } from "./forms/guarantor-step";
import { User, Briefcase, DollarSign, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STEPS = [
    { id: "IDENTITY", label: "Identité", icon: User },
    { id: "SITUATION", label: "Situation", icon: Briefcase },
    { id: "INCOME", label: "Revenus", icon: DollarSign },
    { id: "GUARANTOR", label: "Garant", icon: Users },
];

export function ProfileForm({ initialData }: { initialData: any }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Profil complété !</h2>
                    <p className="text-neutral-400 max-w-md">
                        Vos informations ont été enregistrées avec succès. Vous pouvez maintenant passer à l'étape suivante : l'ajout de vos documents justificatifs.
                    </p>
                </div>
                <Link
                    href="/tenant/documents"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 h-10 px-8 py-2"
                >
                    Ajouter mes documents
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Stepper */}
            <div className="flex items-center justify-between px-4">
                {STEPS.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompletedStep = index < currentStep;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-20">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 border-2",
                                    isActive ? "bg-blue-600 border-blue-600 text-white" :
                                        isCompletedStep ? "bg-green-500 border-green-500 text-white" :
                                            "bg-neutral-900 border-neutral-700 text-neutral-500"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors duration-300",
                                isActive ? "text-blue-500" : isCompletedStep ? "text-green-500" : "text-neutral-500"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
                {/* Progress Bar Background */}
                <div className="absolute top-[84px] left-0 w-full h-0.5 bg-neutral-800 -z-0 hidden md:block" />
            </div>

            {/* Form Content */}
            <div className="mt-4">
                {currentStep === 0 && (
                    <IdentityStep
                        initialData={initialData}
                        onSuccess={nextStep}
                    />
                )}
                {currentStep === 1 && (
                    <SituationStep
                        initialData={initialData}
                        onSuccess={nextStep}
                        onBack={prevStep}
                    />
                )}
                {currentStep === 2 && (
                    <IncomeStep
                        initialData={initialData}
                        onSuccess={nextStep}
                        onBack={prevStep}
                    />
                )}
                {currentStep === 3 && (
                    <GuarantorStep
                        initialData={initialData}
                        onSuccess={nextStep}
                        onBack={prevStep}
                    />
                )}
            </div>
        </div>
    );
}
