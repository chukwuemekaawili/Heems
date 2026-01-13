import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Users,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Carer {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  verified: boolean;
  carer_details?: {
    specializations: string[];
    experience_years: string;
  };
  carer_verification?: {
    dbs_status: string;
  };
  bookings_count?: number;
}

export default function OrganisationStaff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carers, setCarers] = useState<Carer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch carers who have completed bookings for this organisation
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('carer_id')
        .eq('client_id', user.id);

      const carerIds = [...new Set(bookingsData?.map(b => b.carer_id) || [])];

      if (carerIds.length === 0) {
        setCarers([]);
        setLoading(false);
        return;
      }

      // Fetch carer profiles
      const { data: carersData } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          verified,
          carer_details(specializations, experience_years),
          carer_verification(dbs_status)
        `)
        .in('id', carerIds)
        .eq('role', 'carer');

      // Count bookings per carer
      const carersWithBookings = (carersData || []).map(carer => {
        const count = bookingsData?.filter(b => b.carer_id === carer.id).length || 0;
        return {
          ...carer,
          bookings_count: count
        };
      });

      setCarers(carersWithBookings);

    } catch (error: any) {
      toast({
        title: "Error loading staff",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCarers = carers.filter(carer => {
    const matchesSearch = (carer.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (carer.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "verified" && carer.verified) ||
      (statusFilter === "pending" && !carer.verified);
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Verified', 'Bookings'].join(','),
      ...carers.map(c => [
        c.full_name || 'N/A',
        c.email || 'N/A',
        c.verified ? 'Yes' : 'No',
        c.bookings_count || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${carers.length} staff members.`,
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="organisation">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="organisation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff & Carers</h1>
            <p className="text-muted-foreground">Carers who have worked with your organisation</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{carers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Carers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{carers.filter(c => c.verified).length}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{carers.filter(c => !c.verified).length}</p>
                  <p className="text-sm text-muted-foreground">Pending Verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{carers.reduce((sum, c) => sum + (c.bookings_count || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredCarers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No carers found</p>
                <p className="text-sm">Carers will appear here after they complete bookings with your organisation</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Carer</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>DBS Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarers.map((carer) => (
                    <TableRow key={carer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={carer.avatar_url || undefined} />
                              <AvatarFallback>
                                {(carer.full_name || 'C').split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {carer.verified && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Shield className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{carer.full_name || 'Carer'}</p>
                            <p className="text-sm text-muted-foreground">{carer.email || 'N/A'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {carer.verified ? (
                          <Badge className="bg-emerald-500">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {carer.carer_verification?.dbs_status || 'Not submitted'}
                        </Badge>
                      </TableCell>
                      <TableCell>{carer.bookings_count || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => navigate(`/organisation/messages?userId=${carer.id}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Create Booking</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/organisation/messages?userId=${carer.id}`)}>
                                Send Message
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
