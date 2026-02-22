// Message Thread Component
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessaging, type Message } from '@/hooks/useMessaging';
import { supabase } from '@/integrations/supabase/client';
import {
    Send,
    AlertCircle,
    CheckCircle,
    Clock,
    Phone,
    Video,
    Paperclip,
    File,
    X,
    Mic,
    MicOff,
    VideoOff,
    PhoneOff,
    Maximize2,
    FileText,
    Download,
    Image as ImageIcon,
    Loader2,
    PoundSterling
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProposalCard } from './ProposalCard';
import { CreateOfferDialog } from './CreateOfferDialog';
import { useNavigate } from 'react-router-dom';

interface MessageThreadProps {
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string | null;
    otherUserRole?: string;
}

export function MessageThread({
    otherUserId,
    otherUserName,
    otherUserAvatar,
    otherUserRole,
}: MessageThreadProps) {
    const navigate = useNavigate();
    const [messageText, setMessageText] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isCallActive, setIsCallActive] = useState(false);
    const [callType, setCallType] = useState<'voice' | 'video'>('voice');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{ url: string, name: string, type: string } | null>(null);
    const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, loading, sending, sendMessage, fetchMessages, uploadAttachment, updateMessageStatus } = useMessaging();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setCurrentUserId(user.id);
                fetchMessages(otherUserId);
            }
        });
    }, [otherUserId, fetchMessages]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if ((!messageText.trim() && !attachedFile) || sending) return;

        try {
            await sendMessage(otherUserId, messageText, attachedFile || undefined);
            setMessageText('');
            setAttachedFile(null);
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleSendOffer = async (offerData: { rate: number; frequency: string; serviceType: string }) => {
        try {
            await sendMessage(
                otherUserId,
                '',
                undefined,
                'proposal',
                {
                    ...offerData,
                    status: 'pending'
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleAcceptOffer = async (messageId: string) => {
        setIsUpdatingStatus(true);
        try {
            const message = messages.find(m => m.id === messageId);
            if (message) {
                await updateMessageStatus(messageId, { ...message.metadata, status: 'accepted' });
            }
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleRejectOffer = async (messageId: string) => {
        setIsUpdatingStatus(true);
        try {
            const message = messages.find(m => m.id === messageId);
            if (message) {
                await updateMessageStatus(messageId, { ...message.metadata, status: 'rejected' });
            }
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleBookNow = (messageId: string, metadata: any) => {
        // Navigate to booking page with pre-filled data
        // We'll pass the rate and proposal ID via query params
        navigate(`/client/book/${otherUserId}?rate=${metadata.rate}&proposalId=${messageId}&type=${metadata.serviceType}`);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const uploaded = await uploadAttachment(file);
            setAttachedFile(uploaded);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const startCall = async (type: 'voice' | 'video') => {
        try {
            setCallType(type);
            setIsCallActive(true);

            // Log the call attempt
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from('call_logs').insert({
                sender_id: user.id,
                receiver_id: otherUserId,
                call_type: type,
                status: 'completed',
                duration_seconds: Math.floor(Math.random() * 300) + 60 // Simulated duration
            });
        } catch (error) {
            console.error("Error logging call:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) {
        return (
            <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading messages...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-[600px] flex flex-col">
            {/* Header */}
            <CardHeader className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-primary/10">
                                <AvatarImage src={otherUserAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserName}`} />
                                <AvatarFallback>{otherUserName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg font-bold">{otherUserName}</CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Active Now</span>
                                {otherUserRole && (
                                    <Badge variant="outline" className="text-[9px] h-4 uppercase tracking-tighter bg-slate-50">{otherUserRole}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startCall('voice')} className="text-slate-500 hover:text-primary hover:bg-primary/5">
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => startCall('video')} className="text-slate-500 hover:text-primary hover:bg-primary/5">
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-500">
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-slate-500 mb-2">No messages yet</p>
                            <p className="text-sm text-slate-400">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.sender_id === currentUserId;
                        const showWarning = message.is_flagged && message.flagged_keywords && message.flagged_keywords.length > 0;
                        const isProposal = message.message_type === 'proposal';

                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    {!isOwn && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={message.sender?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender?.full_name}`} />
                                                <AvatarFallback className="text-xs">{message.sender?.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs font-medium text-slate-600">
                                                {message.sender?.full_name}
                                            </span>
                                        </div>
                                    )}

                                    {isProposal ? (
                                        <ProposalCard
                                            messageId={message.id}
                                            metadata={message.metadata}
                                            isOwn={isOwn}
                                            onAccept={handleAcceptOffer}
                                            onReject={handleRejectOffer}
                                            onBook={handleBookNow}
                                            isUpdating={isUpdatingStatus}
                                        />
                                    ) : (
                                        <div
                                            className={`rounded-2xl px-4 py-2 ${isOwn
                                                ? 'bg-[#1a9e8c] text-white'
                                                : 'bg-slate-100 text-slate-900 shadow-sm'
                                                }`}
                                        >
                                            {message.file_url && (
                                                <div className={`mb-2 p-2 rounded-lg ${isOwn ? 'bg-white/10' : 'bg-white/50'} border border-white/20`}>
                                                    {message.file_type?.startsWith('image/') ? (
                                                        <img src={message.file_url} alt={message.file_name || 'image'} className="max-w-full rounded h-auto max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded bg-primary/20 flex items-center justify-center">
                                                                <FileText className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold truncate">{message.file_name}</p>
                                                                <p className="text-[10px] opacity-70">Attachment</p>
                                                            </div>
                                                            <a href={message.file_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/5 rounded">
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                        </div>
                                    )}

                                    {showWarning && isOwn && (
                                        <Alert className="mt-2 border-amber-500 bg-amber-50">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-xs text-amber-900">
                                                Modified: Prohibited words replaced ({message.flagged_keywords?.join(', ')})
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
                                        {isOwn && (
                                            message.is_read ? (
                                                <CheckCircle className="h-3 w-3 text-[#1a9e8c]" />
                                            ) : (
                                                <Clock className="h-3 w-3" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4 bg-white">
                {attachedFile && (
                    <div className="mb-3 flex items-center justify-between p-2 rounded-lg border bg-slate-50">
                        <div className="flex items-center gap-2">
                            {attachedFile.type.startsWith('image/') ? <ImageIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
                            <span className="text-xs font-medium truncate max-w-[200px]">{attachedFile.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachedFile(null)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-primary hover:bg-primary/5"
                        onClick={() => setIsOfferDialogOpen(true)}
                        disabled={isUploading}
                        title="Create Offer"
                    >
                        <PoundSterling className="h-5 w-5" />
                    </Button>
                    <Input
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        className="flex-1 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={(!messageText.trim() && !attachedFile) || sending || isUploading}
                        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Call Modal */}
            <Dialog open={isCallActive} onOpenChange={setIsCallActive}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-slate-900 border-none">
                    <div className="relative h-[600px] flex flex-col items-center justify-center text-white">
                        {/* Status/User */}
                        <div className="z-10 text-center animate-in fade-in zoom-in duration-500">
                            <Avatar className="h-24 w-24 border-4 border-white/10 mx-auto mb-6">
                                <AvatarImage src={otherUserAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserName}`} />
                                <AvatarFallback className="text-2xl">{otherUserName[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-3xl font-bold mb-2">{otherUserName}</h2>
                            <p className="text-emerald-400 font-medium animate-pulse">
                                {callType === 'voice' ? 'Voice Calling...' : 'Video Calling...'}
                            </p>
                        </div>

                        {/* Video Simulated Background */}
                        {callType === 'video' && (
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black overflow-hidden">
                                <div className="absolute inset-0 opacity-40 blur-3xl animate-pulse">
                                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full" />
                                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="h-32 w-32 text-white/5" />
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="absolute bottom-12 left-0 right-0 z-20 flex items-center justify-center gap-6">
                            <Button
                                variant="outline"
                                size="icon"
                                className={`h-14 w-14 rounded-full border-white/20 hover:bg-white/10 backdrop-blur-md transition-all ${isMuted ? 'bg-red-500 border-none' : 'bg-white/10'}`}
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                            </Button>

                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-16 w-16 rounded-full shadow-2xl shadow-red-500/40 animate-bounce-subtle"
                                onClick={() => setIsCallActive(false)}
                            >
                                <PhoneOff className="h-8 w-8" />
                            </Button>

                            {callType === 'video' && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className={`h-14 w-14 rounded-full border-white/20 hover:bg-white/10 backdrop-blur-md transition-all ${isVideoOff ? 'bg-red-500 border-none' : 'bg-white/10'}`}
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                >
                                    {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <CreateOfferDialog
                isOpen={isOfferDialogOpen}
                onClose={() => setIsOfferDialogOpen(false)}
                onSubmit={handleSendOffer}
            />
        </Card>
    );
}
