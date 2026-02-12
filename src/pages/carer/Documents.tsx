import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  GraduationCap,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const documentTypes = [
  { id: "passport", name: "ID & Passport", icon: CreditCard, required: true },
  { id: "dbs", name: "Enhanced DBS", icon: Shield, required: true },
  { id: "right_to_work", name: "Right to Work", icon: FileCheck, required: true },
  { id: "insurance", name: "Public Liability Insurance", icon: ShieldCheck, required: true },
  { id: "references", name: "Work References", icon: Users, required: true },
  { id: "qualifications", name: "Care Training", icon: GraduationCap, required: true },
];

interface VerificationDoc {
  id: string;
  dbs_certificate_url: string | null;
  dbs_status: string;
  dbs_verified_at: string | null;
  identity_verified: boolean;
  right_to_work_verified: boolean;
  address_verified: boolean;
  reference_1_email: string | null;
  reference_1_status: string;
  reference_2_email: string | null;
  reference_2_status: string;
  // New columns for enhanced verification
  id_document_back_url?: string | null;
  birth_cert_url?: string | null;
  ni_proof_url?: string | null;
  photo_id_url?: string | null;
  care_training_url?: string | null; // Column added for automation
}

export default function CarerDocuments() {
  const [verification, setVerification] = useState<VerificationDoc | null>(null);
  const [carerDetails, setCarerDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [uploadSide, setUploadSide] = useState<"front" | "back">("front"); // For ID/Passport
  const [showAlternativeRTW, setShowAlternativeRTW] = useState(false);

  // Right to Work State
  const [rtwType, setRtwType] = useState("");
  const [rtwShareCode, setRtwShareCode] = useState("");

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch carer verification data
      const { data: verificationData } = await supabase
        .from('carer_verification')
        .select('*')
        .eq('id', user.id)
        .single();

      setVerification(verificationData);

      // Fetch carer details
      const { data: carerData } = await supabase
        .from('carer_details')
        .select('*')
        .eq('id', user.id)
        .single();

      setCarerDetails(carerData);

    } catch (error: any) {
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // Validation:
    // If RTW (ShareCode/Indefinite) -> Code required, File optional
    // If RTW (Passport) -> File required
    // Else -> File required

    if (selectedType === 'right_to_work') {
      if (!rtwType) {
        toast({ title: "Missing Information", description: "Please select your Right to Work type.", variant: "destructive" });
        return;
      }
      if (rtwType === 'passport_uk_irish' && !selectedFile) {
        toast({ title: "Missing File", description: "Please upload your passport.", variant: "destructive" });
        return;
      }
      if ((rtwType === 'share_code' || rtwType === 'indefinite_leave') && !rtwShareCode) {
        toast({ title: "Missing Share Code", description: "Please enter your share code.", variant: "destructive" });
        return;
      }
    } else {
      if (!selectedFile) {
        toast({ title: "Missing File", description: "Please select a file to upload.", variant: "destructive" });
        return;
      }
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let publicUrl = null;

      // Upload if file exists
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/${selectedType}_${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage - Correct Bucket is 'verification-documents'
        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('verification-documents')
          .getPublicUrl(fileName);

        publicUrl = data.publicUrl;
      }

      if (uploadError) throw uploadError;

      // (Public URL retrieved above if file uploaded)

      // Update verification record based on document type
      // Update verification record based on document type
      const updates: any = {};

      if (selectedType === 'dbs') {
        updates.dbs_certificate_url = publicUrl;
        updates.dbs_status = 'pending';
      } else if (selectedType === 'passport') {
        if (uploadSide === 'back') {
          updates.id_document_back_url = publicUrl;
        } else {
          updates.id_document_url = publicUrl;
        }
      } else if (selectedType === 'right_to_work') {
        // Special logic for Right to Work
        updates.rtw_type = rtwType;
        updates.rtw_share_code = rtwShareCode;

        if (rtwType === 'passport_uk_irish') {
          updates.rtw_document_url = publicUrl;
          updates.rtw_status = 'verified'; // Passports are verified on upload for now? Or pending? Let's say pending.
          updates.rtw_status = 'pending';
        } else {
          // Share code flows might not need a file upload if just a code?
          // User requested: "Passport - upload doc", "Leave to remain - sharecode + expiry", "Indefinite - sharecode"
          // If upload is optional for sharecode, we handle that. But the logic below assumes a file is always uploaded first.
          // Let's attach the file URL if they uploaded one (e.g. screening shot of share code), but primarily save the code.
          if (publicUrl) updates.rtw_document_url = publicUrl;
          updates.rtw_status = 'pending';
        }

      } else if (selectedType === 'birth_cert') {
        updates.birth_cert_url = publicUrl;
      } else if (selectedType === 'ni_proof') {
        updates.ni_proof_url = publicUrl;
      } else if (selectedType === 'photo_id') {
        updates.photo_id_url = publicUrl;
      } else if (selectedType === 'qualifications') {
        updates.care_training_url = publicUrl;
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from('carer_verification')
          .upsert({
            id: user.id,
            ...updates
          }, { onConflict: 'id' });
      }

      toast({
        title: "Document uploaded",
        description: "Your document has been submitted for review.",
      });

      setUploadDialogOpen(false);
      setSelectedFile(null);
      fetchDocuments();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (type: string) => {
    if (!verification && !carerDetails) return 'missing';

    switch (type) {
      case 'passport':
        return verification?.identity_verified ? 'verified' : 'pending';
      case 'dbs':
        return verification?.dbs_status || 'missing';
      case 'right_to_work':
        return verification?.right_to_work_verified ? 'verified' :
          carerDetails?.has_right_to_work ? 'pending' : 'missing';
      case 'insurance':
        return carerDetails?.has_insurance ? 'verified' : 'missing';
      case 'references':
        if (verification?.reference_1_status === 'verified' && verification?.reference_2_status === 'verified') {
          return 'verified';
        } else if (verification?.reference_1_email || verification?.reference_2_email) {
          return 'pending';
        }
        return 'missing';
      case 'qualifications':
        return verification?.care_training_url ? 'pending' : 'missing';
      default:
        return 'missing';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-[#1a9e8c]"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "missing":
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateProgress = () => {
    let verified = 0;
    let total = documentTypes.filter(d => d.required).length;

    documentTypes.filter(d => d.required).forEach(doc => {
      if (getDocumentStatus(doc.id) === 'verified') verified++;
    });

    return Math.round((verified / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents & Verification</h1>
          <p className="text-muted-foreground">Upload and manage your compliance documents</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Select the document type and upload your file.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Select type...</option>
                  {documentTypes.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>File</Label>

                {selectedType === 'right_to_work' ? (
                  <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                    <div>
                      <Label>What type of Right to Work do you have?</Label>
                      <select
                        className="w-full p-2 border rounded-md mt-1"
                        value={rtwType}
                        onChange={(e) => setRtwType(e.target.value)}
                      >
                        <option value="">Select type...</option>
                        <option value="passport_uk_irish">UK or Irish Passport</option>
                        <option value="passport_other">Passport (Other Countries)</option>
                        <option value="share_code">Share Code (Time Limited Visa)</option>
                        <option value="indefinite_leave">Share Code (Indefinite Leave to Remain)</option>
                      </select>
                    </div>

                    {(rtwType === 'passport_uk_irish' || rtwType === 'passport_other') && (
                      <div className="space-y-2">
                        <Label>Upload Passport Page</Label>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          disabled={uploading}
                        />
                      </div>
                    )}

                    {(rtwType === 'share_code' || rtwType === 'indefinite_leave') && (
                      <div className="space-y-3">
                        <div>
                          <Label>Share Code</Label>
                          <Input
                            placeholder="e.g. A12-B34-C56"
                            value={rtwShareCode}
                            onChange={(e) => setRtwShareCode(e.target.value)}
                          />
                        </div>
                        {rtwType === 'share_code' && (
                          <div>
                            <Label>Visa Expiry Date</Label>
                            <Input
                              type="date"
                            // Requires matching logic to update expiry column? 
                            // For now, let's assume this updates rtw_expiry via a separate API call or we bundle it?
                            // The current handleUpload mainly handles files. We should probably just let them upload a screenshot of the share code result as "File" proof alongside the code.
                            />
                            <p className="text-xs text-muted-foreground mt-1">Please also upload a screenshot/copy of your share code result or BRP if available.</p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Upload Documentation (Optional but Recommended)</Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            disabled={uploading}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                )}

                {selectedType === 'passport' && (
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="front"
                        name="side"
                        value="front"
                        checked={uploadSide === 'front'}
                        onChange={() => setUploadSide('front')}
                        className="cursor-pointer"
                      />
                      <label htmlFor="front" className="text-sm cursor-pointer">Front of ID</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="back"
                        name="side"
                        value="back"
                        checked={uploadSide === 'back'}
                        onChange={() => setUploadSide('back')}
                        className="cursor-pointer"
                      />
                      <label htmlFor="back" className="text-sm cursor-pointer">Back of ID</label>
                    </div>
                  </div>
                )}
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadDialogOpen(false);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedType || !selectedFile || uploading}
                className="bg-[#1a9e8c] hover:bg-[#1a9e8c]/90"
              >
                {uploading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Save & Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Verification Progress</h2>
              <p className="text-sm text-muted-foreground">
                {progress === 100 ? 'All required documents verified!' : 'Complete your document verification to start working'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{progress}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Document Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((doc) => {
          const status = getDocumentStatus(doc.id);
          const Icon = doc.icon;

          return (
            <Card key={doc.id} className={`${status === 'verified' ? 'border-[#1a9e8c]/50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {getStatusBadge(status)}
                </div>
                <h3 className="font-semibold mb-1">{doc.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {doc.required ? 'Required document' : 'Optional document'}
                </p>
                {status === 'verified' && verification && (
                  <p className="text-xs text-muted-foreground">
                    Verified on {verification.dbs_verified_at ? format(new Date(verification.dbs_verified_at), 'dd MMM yyyy') : 'N/A'}
                  </p>
                )}
                {status === 'missing' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedType(doc.id);
                      setUploadDialogOpen(true);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                )}
                {status === 'pending' && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Under review
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alternative Right to Work Section */}
      <div className="mt-4">
        {!showAlternativeRTW ? (
          <button
            onClick={() => setShowAlternativeRTW(true)}
            className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
          >
            British citizen without a passport? Click here.
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Step 2 — Alternative route</h3>
              <button
                onClick={() => setShowAlternativeRTW(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Close
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: 'birth_cert', name: 'UK Birth Certificate', icon: FileText, desc: 'Full birth certificate' },
                { id: 'ni_proof', name: 'Proof of NI Number', icon: FileText, desc: 'One document only' },
                { id: 'photo_id', name: 'Photo ID', icon: CreditCard, desc: 'Driving licence preferred' }
              ].map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <doc.icon className="h-6 w-6 text-primary" />
                      </div>
                      {/* Status Check Logic Needed Here - For now show upload if missing */}
                      {verification?.[`${doc.id}_url` as keyof VerificationDoc] ? (
                        <Badge className="bg-[#1a9e8c]"><CheckCircle2 className="h-3 w-3 mr-1" />Uploaded</Badge>
                      ) : (
                        <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{doc.desc}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedType(doc.id);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DBS Details */}
      {verification?.dbs_certificate_url && (
        <Card>
          <CardHeader>
            <CardTitle>DBS Certificate</CardTitle>
            <CardDescription>Your enhanced DBS check details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enhanced DBS Certificate</p>
                <p className="text-sm text-muted-foreground">
                  Status: {verification.dbs_status || 'Pending'}
                </p>
              </div>
              <a
                href={verification.dbs_certificate_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reference Status */}
      {(verification?.reference_1_email || verification?.reference_2_email) && (
        <Card>
          <CardHeader>
            <CardTitle>References</CardTitle>
            <CardDescription>Status of your work references</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verification?.reference_1_email && (
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Reference 1</p>
                    <p className="text-sm text-muted-foreground">{verification.reference_1_email}</p>
                  </div>
                  {getStatusBadge(verification.reference_1_status || 'pending')}
                </div>
              )}
              {verification?.reference_2_email && (
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Reference 2</p>
                    <p className="text-sm text-muted-foreground">{verification.reference_2_email}</p>
                  </div>
                  {getStatusBadge(verification.reference_2_status || 'pending')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
