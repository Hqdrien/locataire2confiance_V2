import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
    id: string;
    title: string;
    matches: any[];
}

export function KanbanColumn({ id, title, matches }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex flex-col w-80 bg-neutral-900 rounded-lg p-4 h-full border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-200">{title}</h3>
                <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-1 rounded-full">
                    {matches.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                <SortableContext items={matches.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    {matches.map(match => (
                        <KanbanCard key={match.id} match={match} />
                    ))}
                </SortableContext>
                {matches.length === 0 && (
                    <div className="h-20 border border-dashed border-neutral-800 rounded flex items-center justify-center text-sm text-neutral-600">
                        Glisser ici
                    </div>
                )}
            </div>
        </div>
    );
}
