export default function CGU() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold mb-12">Conditions Générales d&apos;Utilisation</h1>

                <div className="space-y-8 text-neutral-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Objet</h2>
                        <p>
                            Les présentes CGU ont pour objet de définir les modalités de mise à disposition des services du site Locataire2Confiance
                            et les conditions d&apos;utilisation du service par l&apos;utilisateur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Services</h2>
                        <p>
                            La plateforme permet aux locataires de constituer un dossier de location numérique et aux propriétaires de déposer des annonces.
                            Les services incluent le stockage sécurisé de documents, la génération de PDF et la mise en relation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Responsabilités</h2>
                        <p>
                            L&apos;utilisateur est responsable de la véracité des informations fournies. Locataire2Confiance ne saurait être tenu responsable
                            en cas de fausse déclaration ou d&apos;usage frauduleux de la plateforme.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
