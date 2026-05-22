"use client";

import { useState } from "react";
import { CheckCircle, ExternalLink, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HousingAidPage() {
    const [step, setStep] = useState(0);
    const [selectedAids, setSelectedAids] = useState<string[]>([]);
    const [data, setData] = useState({
        age: 0,
        status: "",
        salary: 0,
    });

    const [aids, setAids] = useState<any[]>([]);

    const calculateAids = () => {
        const results = [];

        // Simple logic for MVP demo
        if (data.age < 30) {
            results.push({
                name: "Garantie Visale",
                desc: "Une caution gratuite de l'État (conditions d'éligibilité).",
                link: "https://www.visale.fr"
            });
        } else {
            results.push({
                name: "Garantme",
                desc: "Garant payant facile d'accès si vous n'êtes pas éligible à Visale.",
                link: "https://garantme.fr"
            });
        }

        if (data.salary < 1500 && data.status === "STUDENT") {
            results.push({
                name: "APL (Aide Personnalisée au Logement)",
                desc: "Réduisez votre loyer grâce à la CAF.",
                link: "https://www.caf.fr"
            });
        }

        if (data.status === "CDD" || data.status === "INTERN") {
            results.push({
                name: "Mobili-Jeune",
                desc: "Subvention d'Action Logement pour les alternants.",
                link: "https://www.actionlogement.fr"
            });
        }

        if (results.length === 0) {
            results.push({
                name: "Loca-Pass",
                desc: "Financement du dépôt de garantie.",
                link: "https://www.actionlogement.fr/l-avance-loca-pass"
            });
        }

        setAids(results);
        setStep(2);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Simulateur d'Aides</h1>
                <p className="text-neutral-400 mt-2">
                    Vérifiez votre éligibilité aux dispositifs d'État et privés (APL, Loca-Pass, Garant) en 30 secondes.
                </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                {step === 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Quel est votre statut ?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["ETUDIANT", "CDI", "CDD", "INTERN"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setData({ ...data, status: s }); setStep(1); }}
                                    className="p-4 rounded-lg border border-neutral-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all text-left"
                                >
                                    <span className="font-bold text-white block mb-1">
                                        {s === 'ETUDIANT' ? 'Étudiant' : s === 'INTERN' ? 'Alternant' : s}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Informations complémentaires</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-neutral-400">Votre âge</label>
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 mt-1 text-white"
                                    onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-neutral-400">Revenus mensuels (€)</label>
                                <input
                                    type="number"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 mt-1 text-white"
                                    onChange={(e) => setData({ ...data, salary: parseInt(e.target.value) })}
                                />
                            </div>
                            <button
                                onClick={calculateAids}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-500 mt-4"
                            >
                                Voir mes aides
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold text-green-500 flex items-center gap-2">
                                <CheckCircle /> Vous êtes éligible à {aids.length} dispositif(s)
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {aids.map((aid, idx) => (
                                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 group hover:border-neutral-600 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-white">{aid.name}</h4>
                                            <p className="text-sm text-neutral-400">{aid.desc}</p>
                                        </div>
                                        <a
                                            href={aid.link}
                                            target="_blank"
                                            className="p-2 bg-neutral-800 rounded-full text-neutral-400 group-hover:text-white group-hover:bg-blue-600 transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={aid.name}
                                            className="rounded border-neutral-700 bg-neutral-800"
                                            checked={selectedAids.includes(aid.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedAids([...selectedAids, aid.name]);
                                                else setSelectedAids(selectedAids.filter(x => x !== aid.name));
                                            }}
                                        />
                                        <label htmlFor={aid.name} className={cn("text-xs cursor-pointer select-none", selectedAids.includes(aid.name) ? "text-green-500 font-bold" : "text-neutral-500")}>
                                            {selectedAids.includes(aid.name) ? "Dossier démarré / En cours" : "Marquer comme fait"}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-500 mt-4">
                            * Simulation à titre indicatif. Vérifiez les conditions sur les sites officiels.
                        </p>

                        <div className="pt-6 border-t border-neutral-800">
                            <h4 className="text-white font-bold mb-4">Trouve ton Garant</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <a href="https://www.visale.fr" target="_blank" className="block p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500 transition-colors">
                                    <div className="font-bold text-white mb-1">Visale (Gratuit)</div>
                                    <div className="text-xs text-neutral-400">Sous conditions d'éligibilité (âge, statut...)</div>
                                </a>
                                <a href="https://garantme.fr" target="_blank" className="block p-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500 transition-colors">
                                    <div className="font-bold text-white mb-1">Garantme (Payant)</div>
                                    <div className="text-xs text-neutral-400">Solution rapide si vous n'avez pas de garant physique.</div>
                                </a>
                            </div>
                        </div>
                        <button onClick={() => setStep(0)} className="text-sm text-neutral-400 hover:text-white underline">
                            Recommencer
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
