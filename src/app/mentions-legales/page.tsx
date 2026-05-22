export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold mb-12">Mentions Légales</h1>

                <div className="space-y-8 text-neutral-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Éditeur du site</h2>
                        <p>
                            Le site Locataire2Confiance est édité par [Nom de la Société], [Forme Juridique] au capital de [Montant] €,
                            immatriculée au RCS de [Ville] sous le numéro [Numéro SIREN].
                        </p>
                        <p className="mt-2">
                            Siège social : [Adresse complète]<br />
                            Email : contact@locataire2confiance.fr<br />
                            Directeur de la publication : [Nom du Directeur]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Hébergement</h2>
                        <p>
                            Le site est hébergé par [Nom de l'hébergeur]<br />
                            Adresse : [Adresse de l'hébergeur]<br />
                            Téléphone : [Numéro de téléphone]
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Propriété intellectuelle</h2>
                        <p>
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                            Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
