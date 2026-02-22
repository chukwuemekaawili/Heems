import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Save, Loader2, Info } from "lucide-react";

export default function ServiceAreas() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [postcode, setPostcode] = useState("");
    const [radius, setRadius] = useState([10]); // Default 10 miles
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('organisation_details')
                .select('postcode, service_radius_miles')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setPostcode(data.postcode || "");
                setRadius([data.service_radius_miles || 10]);
            }
        } catch (error: any) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // Validate postcode format (simple regex for UK)
            const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
            if (postcode && !postcodeRegex.test(postcode)) {
                throw new Error("Invalid UK postcode format");
            }

            const { error } = await supabase
                .from('organisation_details')
                .upsert({
                    id: user.id,
                    postcode: postcode.toUpperCase(),
                    service_radius_miles: radius[0],
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            toast({
                title: "Settings Saved",
                description: "Your service area has been updated successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Service Areas</h1>
                <p className="text-muted-foreground">
                    Define the geographical area where your organisation operates to match with local clients.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Location Settings
                    </CardTitle>
                    <CardDescription>
                        Set your central operating base and coverage radius.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="postcode">Head Office Postcode</Label>
                            <Input
                                id="postcode"
                                placeholder="e.g. SW1A 1AA"
                                value={postcode}
                                onChange={(e) => setPostcode(e.target.value)}
                                className="uppercase"
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                This will be the center point for distance calculations.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="radius">Service Radius</Label>
                                <span className="font-bold text-primary">{radius[0]} miles</span>
                            </div>
                            <Slider
                                id="radius"
                                min={1}
                                max={50}
                                step={1}
                                value={radius}
                                onValueChange={setRadius}
                                className="w-full"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                Covers an area of approx. {Math.round(Math.PI * Math.pow(radius[0], 2))} sq miles
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
