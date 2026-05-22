export default function PolitiqueConfidentialite() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold mb-12">Politique de Confidentialité</h1>

                <div className="space-y-8 text-neutral-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Données collectées</h2>
                        <p>
                            Dans le cadre de la constitution de votre dossier, nous collectons des données personnelles (identité, revenus, situation professionnelle)
                            et des documents justificatifs. Ces données sont strictement nécessaires au service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Sécurité</h2>
                        <p>
                            Toutes les données sont chiffrées en transit et au repos. Nous appliquons des mesures de sécurité strictes pour protéger
                            vos informations contre tout accès non autorisé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Vos droits</h2>
                        <p>
                            Conformément à la réglementation RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
                            Pour exercer ce droit, contactez-nous à privacy@locataire2confiance.fr.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
