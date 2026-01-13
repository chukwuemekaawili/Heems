// Conversation List Component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useMessaging, type Conversation } from '@/hooks/useMessaging';
import { MessageCircle, Search, UserPlus, Check, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationListProps {
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversationId?: string;
}

export function ConversationList({
    onSelectConversation,
    selectedConversationId,
}: ConversationListProps) {
    const { conversations, loading, unreadCount } = useMessaging();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
    const [discoverUsers, setDiscoverUsers] = useState<any[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

    useEffect(() => {
        const getRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                setCurrentUserRole(data?.role || '');
            }
        };
        getRole();
    }, []);

    const fetchDiscoveryUsers = async () => {
        try {
            setSearchingUsers(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Simple discovery: show users of different roles
            // Clients see Carers, Carers see Clients, Organisations see both
            let query = supabase.from('profiles').select('id, full_name, avatar_url, role').neq('id', user.id);

            if (currentUserRole === 'client') {
                query = query.eq('role', 'carer');
            } else if (currentUserRole === 'carer') {
                query = query.eq('role', 'client');
            }

            const { data, error } = await query.limit(20);
            if (error) throw error;
            setDiscoverUsers(data || []);
        } catch (error) {
            console.error('Error fetching discovery users:', error);
        } finally {
            setSearchingUsers(false);
        }
    };

    const handleStartChat = (user: any) => {
        onSelectConversation({
            id: 'new',
            participant_1_id: '', // Placeholder
            participant_2_id: user.id,
            last_message_at: new Date().toISOString(),
            other_user: user
        });
        setIsDiscoveryOpen(false);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.other_user?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <Card className="h-[600px]">
                <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9e8c] mx-auto mb-4"></div>
                        <p className="text-slate-500">Loading conversations...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between mb-3">
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-[#1a9e8c]" />
                        Messages
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Badge className="bg-red-500">{unreadCount}</Badge>
                        )}
                        <Dialog open={isDiscoveryOpen} onOpenChange={(open) => {
                            setIsDiscoveryOpen(open);
                            if (open) fetchDiscoveryUsers();
                        }}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1a9e8c] hover:bg-[#1a9e8c]/10">
                                    <UserPlus className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Start a New Conversation</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input placeholder="Search people..." className="pl-10" />
                                    </div>
                                    <ScrollArea className="h-[300px] pr-4">
                                        {searchingUsers ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a9e8c]"></div>
                                            </div>
                                        ) : discoverUsers.length === 0 ? (
                                            <p className="text-center text-slate-500 py-8">No users found</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {discoverUsers.map((user) => (
                                                    <button
                                                        key={user.id}
                                                        onClick={() => handleStartChat(user)}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors text-left"
                                                    >
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`} />
                                                            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm truncate">{user.full_name}</p>
                                                            <Badge variant="outline" className="text-[10px] capitalize">{user.role}</Badge>
                                                        </div>
                                                        <Check className="h-4 w-4 text-slate-300" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-0">
                {filteredConversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full p-6">
                        <div className="text-center">
                            <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 mb-1">No conversations yet</p>
                            <p className="text-sm text-slate-400">
                                {searchQuery ? 'No matches found' : 'Start messaging to see conversations here'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredConversations.map((conversation) => {
                            const isSelected = conversation.id === selectedConversationId;
                            const hasUnread = (conversation.unread_count || 0) > 0;

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelectConversation(conversation)}
                                    className={`w-full p-4 hover:bg-slate-50 transition-colors text-left ${isSelected ? 'bg-[#1a9e8c]/5 border-l-4 border-[#1a9e8c]' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={conversation.other_user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.other_user?.full_name}`}
                                                />
                                                <AvatarFallback>
                                                    {conversation.other_user?.full_name?.[0] || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            {hasUnread && (
                                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                                                    <span className="text-[10px] font-bold text-white">
                                                        {conversation.unread_count}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-bold truncate ${hasUnread ? 'text-[#111827]' : 'text-slate-700'}`}>
                                                    {conversation.other_user?.full_name || 'Unknown User'}
                                                </h3>
                                                <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                                    {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {conversation.other_user?.role && (
                                                    <Badge variant="outline" className="text-[10px] capitalize">
                                                        {conversation.other_user.role}
                                                    </Badge>
                                                )}
                                            </div>

                                            {conversation.last_message && (
                                                <p className={`text-sm truncate mt-1 ${hasUnread ? 'font-semibold text-slate-900' : 'text-slate-500'
                                                    }`}>
                                                    {conversation.last_message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
