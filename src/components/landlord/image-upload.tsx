"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

interface SortablePhotoProps {
    url: string;
    onRemove: () => void;
    index: number;
}

function SortablePhoto({ url, onRemove, index }: SortablePhotoProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-50">
            <img src={url} alt="Photo du bien" className="object-cover w-full h-full" />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="p-1.5 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 text-white cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 bg-red-500/80 backdrop-blur rounded-full hover:bg-red-500 text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] uppercase font-bold rounded shadow-sm">
                    Couverture
                </div>
            )}
        </div>
    );
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = value.indexOf(active.id as string);
            const newIndex = value.indexOf(over.id as string);
            onChange(arrayMove(value, oldIndex, newIndex));
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (value.length + files.length > 5) {
                alert("Vous ne pouvez ajouter que 5 photos maximum.");
                return;
            }

            setUploading(true);
            try {
                const newUrls: string[] = [];

                for (const file of files) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!res.ok) throw new Error("Upload failed");
                    const data = await res.json();
                    newUrls.push(data.url);
                }

                onChange([...value, ...newUrls]);
            } catch (error) {
                console.error(error);
                alert("Erreur lors de l'upload");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleRemove = (indexToRemove: number) => {
        onChange(value.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={value} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {value.map((url, index) => (
                            <SortablePhoto
                                key={url + index} // Use composite key to handle duplicates better than just url
                                url={url}
                                index={index}
                                onRemove={() => handleRemove(index)}
                            />
                        ))}

                        {value.length < 5 && (
                            <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition flex flex-col items-center justify-center gap-2 cursor-pointer text-gray-400 hover:text-indigo-600">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    onChange={handleUpload}
                                    disabled={uploading || disabled}
                                />
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <div className="text-center p-4">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 text-indigo-600">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium">Ajouter</span>
                                        <p className="text-xs text-gray-400 mt-1">{value.length}/5 photos</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
            {value.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                    Aucune photo pour le moment. La première photo servira de couverture.
                </p>
            )}
        </div>
    );
}
