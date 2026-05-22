import { cn } from "@/lib/utils";

interface ScoreCardProps {
    score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
    // Color based on score
    const color = score >= 80 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
    const ringColor = score >= 80 ? "stroke-green-500" : score >= 50 ? "stroke-amber-500" : "stroke-red-500";

    // Calculate stroke dasharray for SVG circle (circumference = 2 * pi * 40 = ~251)
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-9xl font-bold">A</span>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        className="stroke-neutral-800"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        className={cn("transition-all duration-1000 ease-out", ringColor)}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />
                </svg>
                <span className={cn("absolute text-3xl font-bold", color)}>{score}%</span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">Qualité du Dossier</h3>
            <p className="text-sm text-neutral-400 text-center">
                {score >= 80 ? "Excellent ! Votre dossier est très attractif." :
                    score >= 50 ? "Bon début, complétez-le pour sécuriser les propriétaires." :
                        "Dossier incomplet, les propriétaires risquent de refuser."}
            </p>
        </div>
    );
}
