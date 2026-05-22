import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, FileText, Lock, Star, Bell, Euro, Users, MessageCircle, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-neutral-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Locataire2Confiance
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <div className="h-4 w-px bg-neutral-800" />
            <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Se connecter
            </Link>
            <Link href="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nouveau : Certification DossierFacile incluse
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
              Votre dossier locatif, <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                solide et certifié.
              </span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed">
              Ne passez plus à côté de votre futur logement. Recevez les annonces en avant-première,
              faites-vous accompagner sur les aides (APL, Garant) et présentez un dossier certifié.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/register?role=TENANT" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                Créer mon dossier locataire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/register?role=LANDLORD" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors">
                Espace Propriétaire
              </Link>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-neutral-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Alertes */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alertes en Avant-Première</h3>
              <p className="text-neutral-400">
                Soyez le premier notifié dès qu'un bien correspondant à vos critères est mis en ligne. La réactivité est clé.
              </p>
            </div>

            {/* Aides */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <Euro className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Maxi Aides au Logement</h3>
              <p className="text-neutral-400">
                Vérification et accompagnement pour toutes vos aides : APL, avance Loca-Pass, aides au dépôt de garantie.
              </p>
            </div>

            {/* Garant */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trouve ton Garant</h3>
              <p className="text-neutral-400">
                Nous vous orientons vers les solutions adaptées (Visale, Garantme) pour bétonner votre dossier.
              </p>
            </div>

            {/* Certification */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Certification DossierFacile</h3>
              <p className="text-neutral-400">
                Intégration directe avec le service public pour labelliser votre dossier et rassurer les propriétaires.
              </p>
            </div>

            {/* Chat */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-sky-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Contact Direct</h3>
              <p className="text-neutral-400">
                Échangez directement avec les propriétaires via notre messagerie sécurisée pour défendre votre dossier.
              </p>
            </div>

            {/* Sécurité */}
            <div className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-red-500/50 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dossier Sécurisé</h3>
              <p className="text-neutral-400">
                Vos documents sont chiffrés et filigranés automatiquement pour éviter toute usurpation d'identité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tarification Simple</h2>
            <p className="text-neutral-400">Choisissez l&apos;offre adaptée à vos besoins</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tenant Plan */}
            <div className="relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Locataire</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">50€</span>
                  <span className="text-neutral-400">à l&apos;inscription</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">+ 10€ / mois (sans engagement)</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Constitution du dossier complet",
                  "Accès prioritaire aux annonces",
                  "Aides au logement (APL, Loca-Pass)",
                  "Recherche de Garant (Visale/Garantme)",
                  "Chat direct propriétaires",
                  "Certification DossierFacile",
                  "Génération PDF illimitée & Filigrane"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=TENANT" className="w-full py-3 rounded-xl bg-white text-black font-semibold text-center hover:bg-neutral-200 transition-colors">
                Commencer mon dossier
              </Link>
            </div>

            {/* Landlord Plan */}
            <div className="relative p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-emerald-400 mb-2">Propriétaire</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">100€</span>
                  <span className="text-neutral-400">/ annonce</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">Paiement unique par bien</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Dépôt d'annonce illimité (durée)",
                  "Matching automatique locataires",
                  "Réception de dossiers complets",
                  "Vérification pré-dossier",
                  "Gestion des candidatures",
                  "Modèles de bail fournis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=LANDLORD" className="w-full py-3 rounded-xl bg-neutral-800 text-white font-semibold text-center hover:bg-neutral-700 transition-colors">
                Déposer une annonce
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-neutral-900/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "Comment fonctionne la certification DossierFacile ?",
                a: "Nous sommes connectés directement à l'API de l'État. Une fois vos documents téléchargés, ils sont transmis et vérifiés. Vous recevez ensuite le label officiel qui rassure les propriétaires."
              },
              {
                q: "Mes documents sont-ils en sécurité ?",
                a: "Absolument. Nous utilisons un chiffrement de niveau bancaire et nous ajoutons automatiquement un filigrane sur vos documents pour empêcher leur réutilisation frauduleuse."
              },
              {
                q: "Puis-je arrêter l'abonnement quand je veux ?",
                a: "Oui, l'abonnement locataire est sans engagement. Vous pouvez le résilier dès que vous avez trouvé votre logement."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Locataire2Confiance
              </span>
              <p className="text-neutral-500 mt-4 max-w-sm">
                La plateforme de référence pour constituer un dossier de location solide, sécurisé et certifié.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link href="/mentions-legales" className="hover:text-white">Mentions Légales</Link></li>
                <li><Link href="/cgu" className="hover:text-white">CGU</Link></li>
                <li><Link href="/politique-confidentialite" className="hover:text-white">Confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>support@locataire2confiance.fr</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-neutral-600">
            © {new Date().getFullYear()} Locataire2Confiance. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
