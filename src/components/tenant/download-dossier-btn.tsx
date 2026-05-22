"use client";

import { FileDown } from "lucide-react";
import { generateTenantPDF } from "@/lib/pdf-generator";
import { TenantProfileValues } from "@/lib/validations/tenant";

interface DownloadDossierBtnProps {
    profile: TenantProfileValues;
    email: string;
}

export function DownloadDossierBtn({ profile, email }: DownloadDossierBtnProps) {
    return (
        <button
            onClick={() => generateTenantPDF(profile, email)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium"
        >
            <FileDown className="h-4 w-4" />
            Télécharger mon Dossier PDF
        </button>
    );
}
