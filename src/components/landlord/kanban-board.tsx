"use client";

import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { MatchStatus } from "@prisma/client";

interface MatchWithProfile {
    id: string;
    status: MatchStatus;
    score: number;
    tenantProfile: {
        firstName: string;
        lastName: string;
        situation: string;
        monthlyIncome: number;
        user: {
            email: string;
        }
    };
}

interface KanbanBoardProps {
    matches: MatchWithProfile[];
}

const COLUMNS: { id: MatchStatus; title: string }[] = [
    { id: "NEW", title: "Nouveau" },
    { id: "VIEWED", title: "Vu / Intéressant" },
    { id: "CONTACTED", title: "Contacté" },
    { id: "REJECTED", title: "Refusé" },
];

export function KanbanBoard({ matches: initialMatches }: KanbanBoardProps) {
    const [matches, setMatches] = useState(initialMatches);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string; // This could be a column status or another card ID

        // Find the dragged match
        const activeMatch = matches.find(m => m.id === activeId);
        if (!activeMatch) return;

        let newStatus: MatchStatus = activeMatch.status;

        // Check if dropped on a column
        if (COLUMNS.some(c => c.id === overId)) {
            newStatus = overId as MatchStatus;
        } else {
            // Dropped on another card
            // In a real kanban we might resort, but here we mainly care about status change
            // So find the status of the card we dropped over
            const overMatch = matches.find(m => m.id === overId);
            if (overMatch) {
                newStatus = overMatch.status;
            }
        }

        if (newStatus !== activeMatch.status) {
            // Optimistic update
            setMatches(matches.map(m =>
                m.id === activeId ? { ...m, status: newStatus } : m
            ));

            try {
                // API Call
                await fetch(`/api/landlord/matches/${activeId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
            } catch (error) {
                console.error("Failed to update status", error);
                // Revert on failure
                setMatches(matches.map(m =>
                    m.id === activeId ? { ...m, status: activeMatch.status } : m
                ));
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        matches={matches.filter(m => m.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeId ? (
                    <KanbanCard match={matches.find(m => m.id === activeId)!} overlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
