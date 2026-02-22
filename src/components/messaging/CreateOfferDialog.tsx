import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PoundSterling } from "lucide-react";

interface CreateOfferDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rate: number; frequency: string; serviceType: string }) => Promise<void>;
    defaultRate?: number;
}

export function CreateOfferDialog({ isOpen, onClose, onSubmit, defaultRate = 25 }: CreateOfferDialogProps) {
    const [rate, setRate] = useState<string>(defaultRate.toString());
    const [frequency, setFrequency] = useState("one-off");
    const [serviceType, setServiceType] = useState("hourly"); // hourly, live-in, overnight
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await onSubmit({
                rate: parseFloat(rate),
                frequency: serviceType === 'hourly' ? 'one-off' : frequency,
                serviceType
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Make an Offer</DialogTitle>
                    <DialogDescription>
                        Propose a rate for this care service. This must be confirmed by the other party.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Service Type */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Service Type</Label>
                        <Tabs value={serviceType} onValueChange={setServiceType} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                                <TabsTrigger value="overnight">Night</TabsTrigger>
                                <TabsTrigger value="live-in">Live-in</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Rate Input */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Proposed Rate</Label>
                        <div className="relative">
                            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                min="15"
                                step="0.50"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="pl-9 h-11 text-lg font-bold"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                /{serviceType === 'hourly' ? 'hr' : serviceType === 'live-in' ? (frequency === 'weekly' ? 'wk' : 'day') : 'night'}
                            </span>
                        </div>
                        {parseFloat(rate) < 15 && (
                            <p className="text-[10px] text-red-500 font-medium">Minimum rate is £15/hr per platform policy.</p>
                        )}
                    </div>

                    {/* Frequency (Only for Live-in) */}
                    {serviceType === 'live-in' && (
                        <div className="space-y-2 animate-in fade-in">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Frequency</Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily Rate</SelectItem>
                                    <SelectItem value="weekly">Weekly Rate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || parseFloat(rate) < 15}
                        className="font-bold bg-[#1a9e8c] hover:bg-[#158a7a]"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Send Offer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
