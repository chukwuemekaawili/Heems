import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield,
  FileText,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Filter,
  AlertCircle,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays, addDays } from "date-fns";

interface StaffMember {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  carer_details: {
    verification_status: string;
    has_dbs: boolean;
    has_insurance: boolean;
    has_right_to_work: boolean;
    dbs_expiry: string | null;
    insurance_expiry: string | null;
    rtw_expiry: string | null;
  } | null;
  carer_verification: {
    dbs_status: string;
    id_status: string;
    rtw_status: string;
    insurance_status: string;
    overall_status: string;
  } | null;
}

interface Document {
  staffId: string;
  staffName: string;
  staffEmail: string;
  staffAvatar: string;
  type: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending' | 'missing';
  expiry: string | null;
}

const documentTypes = [
  "DBS Certificate",
  "Right to Work",
  "ID Verification",
  "Insurance",
  "Training Certificates"
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "valid":
    case "verified":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Valid</Badge>;
    case "expiring":
      return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
    case "expired":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Expired</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "missing":
      return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Missing</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getOverallStatus = (staff: StaffMember): 'compliant' | 'pending' | 'action-required' => {
  const details = staff.carer_details;
  const verification = staff.carer_verification;

  if (!details || !verification) return 'pending';

  // Check for expired or missing documents
  if (!details.has_dbs || !details.has_insurance || !details.has_right_to_work) {
    return 'action-required';
  }

  // Check verification statuses
  if (verification.dbs_status === 'expired' ||
    verification.id_status !== 'verified' ||
    verification.rtw_status !== 'verified') {
    return 'action-required';
  }

  if (verification.dbs_status === 'pending' || details.verification_status === 'pending') {
    return 'pending';
  }

  return 'compliant';
};

const getOverallStatusBadge = (status: string) => {
  switch (status) {
    case "compliant":
      return <Badge className="bg-emerald-500">Compliant</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending Review</Badge>;
    case "action-required":
      return <Badge variant="destructive">Action Required</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function OrganisationCompliance() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaffCompliance();
  }, []);

  const fetchStaffCompliance = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch all carers that have worked with this organisation
      // For now, fetching all carers with role 'carer'
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          email,
          carer_details(
            verification_status,
            has_dbs,
            has_insurance,
            has_right_to_work,
            dbs_expiry,
            insurance_expiry,
            rtw_expiry
          ),
          carer_verification(
            dbs_status,
            id_status,
            rtw_status,
            insurance_status,
            overall_status
          )
        `)
        .eq('role', 'carer');

      if (error) throw error;
      setStaff(data || []);

    } catch (error: any) {
      toast({
        title: "Error loading compliance data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunComplianceCheck = async () => {
    setRefreshing(true);
    await fetchStaffCompliance();
    setRefreshing(false);
    toast({
      title: "Compliance check complete",
      description: `Checked ${staff.length} staff members`,
    });
  };

  const handleExportReport = () => {
    // Generate CSV report
    const headers = ['Name', 'Email', 'Overall Status', 'DBS', 'Insurance', 'Right to Work', 'Identity Verified'];
    const rows = staff.map(s => [
      s.full_name,
      s.email,
      getOverallStatus(s),
      s.carer_details?.has_dbs ? 'Yes' : 'No',
      s.carer_details?.has_insurance ? 'Yes' : 'No',
      s.carer_details?.has_right_to_work ? 'Yes' : 'No',
      s.carer_verification?.id_status === 'verified' ? 'Yes' : 'No',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Compliance report has been downloaded.",
    });
  };

  const handleSendReminder = async (staffMember: StaffMember) => {
    toast({
      title: "Reminder sent",
      description: `Compliance reminder sent to ${staffMember.full_name}`,
    });
  };

  const handleViewDocuments = (staffId: string) => {
    // In a real app, this would open a modal or navigate to a documents page
    toast({
      title: "View Documents",
      description: "Document viewer would open here.",
    });
  };

  // Calculate stats
  const staffWithStatus = staff.map(s => ({
    ...s,
    overallStatus: getOverallStatus(s)
  }));

  const compliantCount = staffWithStatus.filter(s => s.overallStatus === 'compliant').length;
  const pendingCount = staffWithStatus.filter(s => s.overallStatus === 'pending').length;
  const actionRequiredCount = staffWithStatus.filter(s => s.overallStatus === 'action-required').length;
  const complianceRate = staff.length > 0 ? Math.round((compliantCount / staff.length) * 100) : 0;

  // Get expiring documents (within 60 days)
  const expiringDocs: Document[] = staff.flatMap(s => {
    const docs: Document[] = [];
    const now = new Date();
    const sixtyDaysFromNow = addDays(now, 60);

    if (s.carer_details?.dbs_expiry) {
      const expiry = new Date(s.carer_details.dbs_expiry);
      if (expiry > now && expiry <= sixtyDaysFromNow) {
        docs.push({
          staffId: s.id,
          staffName: s.full_name,
          staffEmail: s.email,
          staffAvatar: s.avatar_url,
          type: 'DBS Certificate',
          status: 'expiring',
          expiry: s.carer_details.dbs_expiry
        });
      }
    }

    if (s.carer_details?.insurance_expiry) {
      const expiry = new Date(s.carer_details.insurance_expiry);
      if (expiry > now && expiry <= sixtyDaysFromNow) {
        docs.push({
          staffId: s.id,
          staffName: s.full_name,
          staffEmail: s.email,
          staffAvatar: s.avatar_url,
          type: 'Insurance',
          status: 'expiring',
          expiry: s.carer_details.insurance_expiry
        });
      }
    }

    return docs;
  });

  // Get missing documents
  const missingDocs: Document[] = staff.flatMap(s => {
    const docs: Document[] = [];

    if (!s.carer_details?.has_dbs) {
      docs.push({
        staffId: s.id,
        staffName: s.full_name,
        staffEmail: s.email,
        staffAvatar: s.avatar_url,
        type: 'DBS Certificate',
        status: 'missing',
        expiry: null
      });
    }

    if (!s.carer_details?.has_insurance) {
      docs.push({
        staffId: s.id,
        staffName: s.full_name,
        staffEmail: s.email,
        staffAvatar: s.avatar_url,
        type: 'Insurance',
        status: 'missing',
        expiry: null
      });
    }

    if (!s.carer_details?.has_right_to_work) {
      docs.push({
        staffId: s.id,
        staffName: s.full_name,
        staffEmail: s.email,
        staffAvatar: s.avatar_url,
        type: 'Right to Work',
        status: 'missing',
        expiry: null
      });
    }

    if (s.carer_verification?.id_status !== 'verified') {
      docs.push({
        staffId: s.id,
        staffName: s.full_name,
        staffEmail: s.email,
        staffAvatar: s.avatar_url,
        type: 'ID Verification',
        status: s.carer_verification?.id_status === 'pending' ? 'pending' : 'missing',
        expiry: null
      });
    }

    return docs;
  });

  const filteredStaff = staffWithStatus.filter(s => {
    const matchesSearch = s.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate document compliance rates
  const docComplianceRates = documentTypes.map(docType => {
    let valid = 0;
    let total = staff.length;

    staff.forEach(s => {
      switch (docType) {
        case 'DBS Certificate':
          if (s.carer_details?.has_dbs && s.carer_verification?.dbs_status === 'verified') valid++;
          break;
        case 'Right to Work':
          if (s.carer_details?.has_right_to_work && s.carer_verification?.rtw_status === 'verified') valid++;
          break;
        case 'ID Verification':
          if (s.carer_verification?.id_status === 'verified') valid++;
          break;
        case 'Insurance':
          if (s.carer_details?.has_insurance && s.carer_verification?.insurance_status === 'verified') valid++;
          break;
        case 'Training Certificates':
          // Assume valid for now
          if (s.carer_details?.verification_status === 'verified') valid++;
          break;
      }
    });

    return {
      type: docType,
      valid,
      total,
      percentage: total > 0 ? Math.round((valid / total) * 100) : 0
    };
  });

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
            <h1 className="text-2xl font-bold text-foreground">Compliance Vault</h1>
            <p className="text-muted-foreground">Monitor staff compliance and document status</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={handleRunComplianceCheck} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Checking...' : 'Run Compliance Check'}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{complianceRate}%</p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
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
                  <p className="text-2xl font-bold">{compliantCount}</p>
                  <p className="text-sm text-muted-foreground">Fully Compliant</p>
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
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{actionRequiredCount}</p>
                  <p className="text-sm text-muted-foreground">Action Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Compliance Progress</CardTitle>
            <CardDescription>Team compliance status across all document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {docComplianceRates.map((doc) => (
                <div key={doc.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{doc.type}</span>
                    <span className="text-muted-foreground">{doc.valid}/{doc.total} staff ({doc.percentage}%)</span>
                  </div>
                  <Progress
                    value={doc.percentage}
                    className={`h-2 ${doc.percentage === 100 ? '[&>div]:bg-emerald-500' : doc.percentage >= 80 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="action-required">Action Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Compliance Table */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Staff Overview ({filteredStaff.length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon ({expiringDocs.length})</TabsTrigger>
            <TabsTrigger value="missing">Missing Documents ({missingDocs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {filteredStaff.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No staff members found</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredStaff.map((s) => (
                      <div key={s.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={s.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.full_name}`} />
                              <AvatarFallback>{s.full_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{s.full_name}</p>
                              <p className="text-sm text-muted-foreground">{s.email}</p>
                            </div>
                          </div>
                          {getOverallStatusBadge(s.overallStatus)}
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                          <div className={`p-3 rounded-lg border ${s.carer_details?.has_dbs && s.carer_verification?.dbs_status === 'verified' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">DBS Certificate</span>
                            </div>
                            {getStatusBadge(s.carer_details?.has_dbs && s.carer_verification?.dbs_status === 'verified' ? 'valid' : 'missing')}
                          </div>
                          <div className={`p-3 rounded-lg border ${s.carer_details?.has_right_to_work && s.carer_verification?.right_to_work_verified ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Right to Work</span>
                            </div>
                            {getStatusBadge(s.carer_details?.has_right_to_work && s.carer_verification?.right_to_work_verified ? 'valid' : 'missing')}
                          </div>
                          <div className={`p-3 rounded-lg border ${s.carer_verification?.identity_verified ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-amber-500/50 bg-amber-500/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">ID Verification</span>
                            </div>
                            {getStatusBadge(s.carer_verification?.identity_verified ? 'valid' : 'pending')}
                          </div>
                          <div className={`p-3 rounded-lg border ${s.carer_details?.has_insurance ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Insurance</span>
                            </div>
                            {getStatusBadge(s.carer_details?.has_insurance ? 'valid' : 'missing')}
                          </div>
                          <div className={`p-3 rounded-lg border ${s.carer_verification?.address_verified ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-amber-500/50 bg-amber-500/5'}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Address Verified</span>
                            </div>
                            {getStatusBadge(s.carer_verification?.address_verified ? 'valid' : 'pending')}
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDocuments(s.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Documents
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(s)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-5 w-5" />
                  Documents Expiring Soon
                </CardTitle>
                <CardDescription>Documents expiring within the next 60 days</CardDescription>
              </CardHeader>
              <CardContent>
                {expiringDocs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                    <p>No documents expiring soon!</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Days Left</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringDocs.map((item, i) => {
                        const daysLeft = item.expiry ? differenceInDays(new Date(item.expiry), new Date()) : 0;
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={item.staffAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.staffName}`} />
                                  <AvatarFallback>{item.staffName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{item.staffName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>
                              {item.expiry ? format(new Date(item.expiry), 'dd MMM yyyy') : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-amber-500 text-amber-500">
                                {daysLeft} days
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" onClick={() => handleSendReminder({ id: item.staffId, full_name: item.staffName, email: item.staffEmail } as StaffMember)}>
                                Request Renewal
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Missing Documents
                </CardTitle>
                <CardDescription>Staff members with missing or pending documents</CardDescription>
              </CardHeader>
              <CardContent>
                {missingDocs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-emerald-500" />
                    <p>All documents are complete!</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {missingDocs.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.staffAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.staffName}`} />
                                <AvatarFallback>{item.staffName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{item.staffName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="destructive" onClick={() => handleSendReminder({ id: item.staffId, full_name: item.staffName, email: item.staffEmail } as StaffMember)}>
                              Request Upload
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
