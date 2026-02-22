import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { CheckCircle2, XCircle, Clock, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProposalMetadata {
    rate: number;
    frequency: 'one-off' | 'weekly' | 'daily';
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    serviceType?: string;
}

interface ProposalCardProps {
    messageId: string;
    metadata: ProposalMetadata;
    isOwn: boolean;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onBook: (id: string, metadata: ProposalMetadata) => void;
    isUpdating: boolean;
}

export function ProposalCard({
    messageId,
    metadata,
    isOwn,
    onAccept,
    onReject,
    onBook,
    isUpdating
}: ProposalCardProps) {
    const { rate, frequency, status } = metadata;

    const isPending = status === 'pending';
    const isAccepted = status === 'accepted';
    const isRejected = status === 'rejected';

    return (
        <div className={`w-64 p-4 rounded-xl border-2 ${isAccepted ? 'border-emerald-500 bg-emerald-50/50' :
                isRejected ? 'border-red-200 bg-red-50/50' :
                    'border-primary/20 bg-white/50'
            } backdrop-blur-sm relative overflow-hidden`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {isOwn ? 'You Offered' : 'Offer Received'}
                    </p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-black text-foreground">{formatCurrency(rate)}</span>
                        <span className="text-xs font-medium text-muted-foreground">/{frequency === 'one-off' ? 'hr' : frequency === 'weekly' ? 'wk' : 'day'}</span>
                    </div>
                </div>
                <div className="bg-white rounded-full p-1.5 shadow-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                </div>
            </div>

            {/* Status Banner */}
            <div className="mb-4">
                {isPending && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending Response
                    </Badge>
                )}
                {isAccepted && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Offer Accepted
                    </Badge>
                )}
                {isRejected && (
                    <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" /> Offer Declined
                    </Badge>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
                {isPending && !isOwn && (
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => onReject(messageId)}
                            disabled={isUpdating}
                        >
                            Reject
                        </Button>
                        <Button
                            size="sm"
                            className="w-full text-xs bg-emerald-500 hover:bg-emerald-600 font-bold"
                            onClick={() => onAccept(messageId)}
                            disabled={isUpdating}
                        >
                            Accept
                        </Button>
                    </div>
                )}

                {isPending && isOwn && (
                    <p className="text-xs text-center text-muted-foreground italic">
                        Waiting for response...
                    </p>
                )}

                {isAccepted && (
                    <Button
                        size="sm"
                        className="w-full font-bold shadow-md shadow-primary/10"
                        onClick={() => onBook(messageId, metadata)}
                    >
                        Book Now <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
