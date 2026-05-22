import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TenantProfile, Document } from "@prisma/client";

export async function generateTenantPDF(profile: Partial<TenantProfile> & { documents?: Document[] }, email: string): Promise<ArrayBuffer> {
    const doc = new jsPDF();

    // Watermark
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(50);
    doc.text("LOCATAIRE 2 CONFIANCE", 30, 150, { angle: 45 });

    // Reset standard font
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(20);
    doc.text("Dossier de Location Certifié", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString()} via Locataire2Confiance`, 14, 30);
    doc.text(`ID Dossier: ${profile.id || "Non attribué"}`, 14, 35);

    // Identity Section
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 40, 196, 40);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("1. Identité & Contact", 14, 50);

    autoTable(doc, {
        startY: 55,
        head: [['Information', 'Détail']],
        body: [
            ['Nom Complet', `${profile.firstName || ''} ${profile.lastName || ''}`],
            ['Email', email],
            ['Téléphone', profile.phone || "Non renseigné"],
            ['Situation Pro.', profile.situation || "Non renseigné"],
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
    });

    // Financial Section
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("2. Situation Financière", 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Rubrique', 'Montant / Type']],
        body: [
            ['Revenus Mensuels Nets', `${profile.monthlyIncome || 0} €`],
            ['Garant', profile.guarantorType || "Non renseigné"],
            ['Score Dossier', `${calculateScore(profile)}/100`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });

    // Documents Section
    finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("3. Pièces Justificatives Incluses", 14, finalY);

    const docs = profile.documents || [];
    const docRows = docs.map(d => [
        d.type,
        d.status === "UPLOADED" ? "Téléversé" : d.status,
        new Date(d.uploadedAt).toLocaleDateString()
    ]);

    if (docRows.length === 0) {
        docRows.push(["Aucun document", "-", "-"]);
    }

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Type de Document', 'Statut', 'Date d\'ajout']],
        body: docRows,
        theme: 'plain',
        headStyles: { fillColor: [100, 100, 100] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            "Ce dossier a été préalablement vérifié par la plateforme Locataire2Confiance. Véracité non garantie sans pièces originales.",
            14,
            290
        );
        doc.text(`Page ${i} / ${pageCount}`, 190, 290, { align: 'right' });
    }

    return doc.output('arraybuffer');
}

function calculateScore(profile: any): number {
    // Simple replication of scoring logic for PDF display
    let score = 0;
    if (profile.firstName && profile.lastName) score += 20;
    score += 20; // Situation
    if (profile.monthlyIncome > 0) score += 20;
    if (profile.guarantorType !== "NONE") score += 10;
    if (profile.documents?.length > 0) score += 30; // Simplified
    return Math.min(score, 100);
}
