import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";


export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent', text: string }[]>([
        { role: 'agent', text: 'Hello! How can we help you today?' }
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage("");
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('chat-agent', {
                body: { message: userMessage }
            });

            if (error) throw error;

            setChatHistory(prev => [...prev, { role: 'agent', text: data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setChatHistory(prev => [...prev, { role: 'agent', text: "I'm having trouble connecting right now. Please try again or email support@heemscare.com." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                data-chat-widget-trigger="true"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#1a9e8c] hover:bg-[#15806c] shadow-2xl shadow-[#1a9e8c]/40 animate-bounce group z-50 p-0"
            >
                <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </Button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] animate-in slide-in-from-bottom-5">
            <Card className="shadow-2xl border-black/5 overflow-hidden ring-1 ring-black/5">
                <CardHeader className="bg-[#111827] text-white p-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                <HeartIcon className="h-5 w-5 text-[#1a9e8c]" />
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#111827]"></span>
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold">Heems Support</CardTitle>
                            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-400/30 font-bold px-1.5 h-4">Online</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setIsMinimized(!isMinimized)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        <CardContent className="h-[380px] overflow-y-auto p-4 bg-slate-50 space-y-4">
                            {chatHistory.map((chat, i) => (
                                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${chat.role === 'user'
                                        ? 'bg-[#1a9e8c] text-white rounded-tr-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {chat.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-4 bg-white border-t">
                            <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="h-11 bg-slate-50 border-slate-100 focus-visible:ring-[#1a9e8c] focus-visible:ring-offset-0 rounded-xl"
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" className="h-11 w-11 rounded-xl bg-[#111827] hover:bg-[#1a9e8c] shrink-0" disabled={isLoading}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
};

const HeartIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);
