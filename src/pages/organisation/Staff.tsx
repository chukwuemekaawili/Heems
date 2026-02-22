import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Search, Shield } from "lucide-react";

interface StaffMember {
  id: string; // join id
  carer_id: string;
  added_at: string;
  status: string;
  carer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email: string; // Assuming email is in profiles or we fetch it
    carer_verification: {
      overall_status: string;
    } | null;
    carer_details: {
      hourly_rate: number;
    } | null;
  };
}

export default function OrganisationStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('organisation_staff')
        .select(`
                    id,
                    carer_id,
                    added_at,
                    status,
                    carer:profiles!carer_id (
                        id,
                        full_name,
                        avatar_url,
                        email,
                        carer_verification (
                            overall_status
                        ),
                        carer_details (
                            hourly_rate
                        )
                    )
                `)
        .eq('organisation_id', user.id);

      if (error) throw error;

      // Transform data to match interface
      const transformed = (data || []).map((item: any) => ({
        ...item,
        carer: {
          ...item.carer,
          carer_verification: Array.isArray(item.carer.carer_verification) ? item.carer.carer_verification[0] : item.carer.carer_verification,
          carer_details: Array.isArray(item.carer.carer_details) ? item.carer.carer_details[0] : item.carer.carer_details
        }
      }));

      setStaff(transformed);
    } catch (error: any) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff bank",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!emailInput) return;

    try {
      setAdding(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Find carer by email
      const { data: carer, error: searchError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', emailInput) // Requires email column in profiles!
        .eq('role', 'carer')
        .single();

      if (searchError || !carer) {
        throw new Error("Carer not found with this email");
      }

      // 2. Add to organisation_staff
      const { error: addError } = await supabase
        .from('organisation_staff')
        .insert({
          organisation_id: user.id,
          carer_id: carer.id,
          status: 'active'
        });

      if (addError) {
        if (addError.code === '23505') { // Unique violation
          throw new Error("Carer is already in your staff bank");
        }
        throw addError;
      }

      toast({
        title: "Success",
        description: "Carer added to staff bank",
      });
      setEmailInput("");
      fetchStaff();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('organisation_staff')
        .delete()
        .eq('id', staffId);

      if (error) throw error;

      setStaff(prev => prev.filter(s => s.id !== staffId));
      toast({
        title: "Removed",
        description: "Carer removed from staff bank",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove carer",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Staff Bank</h1>
        <p className="text-slate-500 font-medium">
          Manage your internal pool of preferred carers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Carer</CardTitle>
          <CardDescription>Add a carer to your bank by their registered email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Enter carer email address..."
                className="pl-9"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
            <Button onClick={handleAddStaff} disabled={adding || !emailInput} className="bg-[#1a9e8c] hover:bg-[#1a9e8c]/90 w-full sm:w-auto">
              {adding ? "Adding..." : "Add to Bank"}
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Carers ({staff.length})</h2>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : staff.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No carers in your staff bank yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {staff.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.carer.avatar_url || ""} />
                    <AvatarFallback>{item.carer.full_name[0]}</AvatarFallback>
                  </Avatar>

                  {/* Mobile only trash button */}
                  <div className="ml-auto sm:hidden">
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{item.carer.full_name}</h3>
                    {item.carer.carer_verification?.overall_status === 'verified' && (
                      <Shield className="h-4 w-4 text-green-500 fill-green-100" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm text-muted-foreground">
                    <span>Rate: £{item.carer.carer_details?.hourly_rate}/hr</span>
                    <span>Added: {new Date(item.added_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Desktop trash button */}
                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)} className="hidden sm:inline-flex text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
