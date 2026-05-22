
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, User, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        role: "TENANT" | "LANDLORD";
        email: string;
    }
}

interface ChatWindowProps {
    matchId: string;
    currentUserId: string;
}

export function ChatWindow({ matchId, currentUserId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?matchId=${matchId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [matchId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matchId,
                    content: newMessage
                })
            });

            if (res.ok) {
                setNewMessage("");
                fetchMessages(); // Refresh immediately
            }
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-neutral-500" /></div>;
    }

    return (
        <div className="flex flex-col h-[500px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-neutral-500 mt-10">
                        <p>Aucun message. Commencez la discussion !</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                isMe ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-200"
                            )}>
                                <p>{msg.content}</p>
                                <span className={cn("text-[10px] opacity-50 block mt-1", isMe ? "text-blue-200" : "text-neutral-400")}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-neutral-800 bg-neutral-950 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 text-white focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
            </form>
        </div>
    );
}
