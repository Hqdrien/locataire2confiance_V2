import { TenantProfile, Document, DocumentStatus, DocumentType } from "@prisma/client";

interface ScoreResult {
    score: number;
    missingItems: string[];
    recommendations: string[];
}

export function calculateDossierScore(
    profile: TenantProfile & { documents: Document[] }
): ScoreResult {
    let score = 0;
    const missingItems: string[] = [];
    const recommendations: string[] = [];

    // 1. Identity (Max 20)
    if (profile.firstName && profile.lastName && profile.phone) {
        score += 20;
    } else {
        missingItems.push("Informations personnelles incomplètes");
    }

    // 2. Situation (Max 20)
    score += 20; // Assuming enum is always set to a valid value if step completed

    // 3. Income (Max 20)
    if (profile.monthlyIncome > 0) {
        if (profile.monthlyIncome >= 2700) { // Example threshold (3x rent of 900)
            score += 20;
        } else {
            score += 15;
            recommendations.push("Votre revenu est un peu juste pour les loyers élevés.");
        }
    } else {
        missingItems.push("Revenus non renseignés");
    }

    // 4. Guarantor (Max 10)
    if (profile.guarantorType !== "NONE") {
        score += 10;
    } else {
        // Not strictly missing, but improves profile
        recommendations.push("Ajouter un garant augmenterait vos chances.");
    }

    // 5. Documents (Max 30)
    const requiredDocs: DocumentType[] = ["ID_CARD", "PAYSLIP", "TAX_NOTICE"];
    if (profile.guarantorType !== "NONE") {
        requiredDocs.push("GUARANTOR_DOC");
    }

    const uploadedTypes = new Set(
        profile.documents
            .filter(d => d.status === "UPLOADED" || d.status === "VERIFIED_DOSSIER_FACILE")
            .map(d => d.type)
    );

    const docPoints = 30 / requiredDocs.length;

    requiredDocs.forEach(type => {
        if (uploadedTypes.has(type)) {
            score += docPoints;
        } else {
            const label = type === "ID_CARD" ? "Pièce d'identité" :
                type === "PAYSLIP" ? "Bulletins de paie" :
                    type === "TAX_NOTICE" ? "Avis d'imposition" :
                        "Documents du garant";
            missingItems.push(label);
        }
    });

    return {
        score: Math.round(score),
        missingItems,
        recommendations
    };
}
