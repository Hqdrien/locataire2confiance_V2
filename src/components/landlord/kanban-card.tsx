import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User, Euro, Briefcase } from "lucide-react";

interface KanbanCardProps {
    match: {
        id: string;
        score: number;
        tenantProfile: {
            firstName: string;
            lastName: string;
            situation: string;
            monthlyIncome: number;
        };
    };
    overlay?: boolean;
}

export function KanbanCard({ match, overlay }: KanbanCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: match.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: overlay ? 0.8 : 1,
    };

    let scoreColor = "text-green-500";
    if (match.score < 50) scoreColor = "text-red-500";
    else if (match.score < 80) scoreColor = "text-yellow-500";

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-neutral-950 p-4 rounded border border-neutral-800 hover:border-blue-500 transition cursor-grab active:cursor-grabbing ${overlay ? "shadow-xl border-blue-500 z-50" : ""}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-white truncate max-w-[150px]">
                    {match.tenantProfile.firstName} {match.tenantProfile.lastName}
                </h4>
                <div className={`text-sm font-bold ${scoreColor}`}>
                    {match.score}%
                </div>
            </div>

            <div className="space-y-1 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3" />
                    <span>{match.tenantProfile.situation}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Euro className="w-3 h-3" />
                    <span>{match.tenantProfile.monthlyIncome} €/mois</span>
                </div>
            </div>
        </div>
    );
}
