// Document Upload Component for Carer Verification
import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type DocumentType = 'dbs' | 'id' | 'rtw' | 'insurance';

interface DocumentUploadProps {
    carerId: string;
    documentType: DocumentType;
    onUploadComplete?: (url: string) => void;
    requiresExpiry?: boolean;
}

const DOCUMENT_LABELS: Record<DocumentType, string> = {
    dbs: 'Enhanced DBS Certificate',
    id: 'ID/Passport',
    rtw: 'Right to Work Document',
    insurance: 'Public Liability Insurance',
};

const DOCUMENT_DESCRIPTIONS: Record<DocumentType, string> = {
    dbs: 'Upload your Enhanced DBS certificate. Must be dated within the last 3 years.',
    id: 'Upload a valid passport or driving license.',
    rtw: 'Upload proof of your right to work in the UK (e.g., passport, visa, share code).',
    insurance: 'Upload your Public Liability Insurance certificate (minimum £6 million cover).',
};

export function DocumentUpload({
    carerId,
    documentType,
    onUploadComplete,
    requiresExpiry = false,
}: DocumentUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [rtwType, setRtwType] = useState<string>('');
    const [shareCode, setShareCode] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(selectedFile.type)) {
                toast({
                    title: 'Invalid file type',
                    description: 'Please upload a PDF, JPG, or PNG file',
                    variant: 'destructive',
                });
                return;
            }

            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast({
                    title: 'File too large',
                    description: 'File size must be less than 5MB',
                    variant: 'destructive',
                });
                return;
            }

            setFile(selectedFile);
            setUploadStatus('idle');
        }
    };

    const handleUpload = async () => {
        // Validation logic
        if (documentType === 'rtw') {
            if (!rtwType) {
                toast({ title: 'RTW Type Required', description: 'Please select your right to work type', variant: 'destructive' });
                return;
            }
            if (rtwType === 'passport' && !file) {
                toast({ title: 'Passport Required', description: 'Please upload your passport document', variant: 'destructive' });
                return;
            }
            if ((rtwType === 'visa' || rtwType === 'indefinite') && !shareCode) {
                toast({ title: 'Share Code Required', description: 'Please enter your share code', variant: 'destructive' });
                return;
            }
            if (rtwType === 'visa' && !expiryDate) {
                toast({ title: 'Expiry Date Required', description: 'Please enter your visa expiry date', variant: 'destructive' });
                return;
            }
        } else if (!file) {
            toast({
                title: 'No file selected',
                description: 'Please select a file to upload',
                variant: 'destructive',
            });
            return;
        }

        if (requiresExpiry && !expiryDate && documentType !== 'rtw') {
            toast({
                title: 'Expiry date required',
                description: 'Please enter the document expiry date',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
            let publicUrl = '';

            if (file) {
                // Upload file to Supabase Storage
                const fileExt = file.name.split('.').pop();
                const fileName = `${carerId}/${documentType}_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('verification-documents')
                    .upload(fileName, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl: url } } = supabase.storage
                    .from('verification-documents')
                    .getPublicUrl(fileName);

                publicUrl = url;
            }

            // Update carer_verification table
            const updateData: any = {
                [`${documentType}_status`]: 'pending',
            };

            if (publicUrl) {
                updateData[`${documentType}_document_url`] = publicUrl;
            }

            if (documentType === 'rtw') {
                updateData.rtw_type = rtwType;
                if (shareCode) updateData.rtw_share_code = shareCode;
                if (rtwType === 'visa' && expiryDate) updateData.rtw_expiry = expiryDate;
            } else if (requiresExpiry && expiryDate) {
                updateData[`${documentType}_expiry`] = expiryDate;
            }

            const { error: updateError } = await supabase
                .from('carer_verification')
                .upsert({
                    id: carerId,
                    ...updateData,
                });

            if (updateError) throw updateError;

            setUploadStatus('success');
            toast({
                title: 'Document uploaded successfully',
                description: 'Your document has been submitted for verification',
            });

            onUploadComplete?.(publicUrl);
        } catch (error: any) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload document',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {DOCUMENT_LABELS[documentType]}
                </CardTitle>
                <CardDescription>{DOCUMENT_DESCRIPTIONS[documentType]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {documentType === 'rtw' && (
                    <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="space-y-2">
                            <Label>Right to Work Type</Label>
                            <select
                                className="w-full h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a9e8c]/20"
                                value={rtwType}
                                onChange={(e) => setRtwType(e.target.value)}
                            >
                                <option value="">Select type...</option>
                                <option value="passport">UK or Irish Passport</option>
                                <option value="visa">Leave to Remain (Visa)</option>
                                <option value="indefinite">Indefinite Leave to Remain</option>
                            </select>
                        </div>

                        {(rtwType === 'visa' || rtwType === 'indefinite') && (
                            <div className="space-y-2">
                                <Label htmlFor="share-code">Share Code</Label>
                                <Input
                                    id="share-code"
                                    placeholder="Enter your 9-digit share code"
                                    value={shareCode}
                                    onChange={(e) => setShareCode(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor={`file-${documentType}`}>
                        {documentType === 'rtw' && (rtwType === 'visa' || rtwType === 'indefinite')
                            ? 'Upload Proof Document (Optional)'
                            : 'Upload Document'}
                    </Label>
                    <Input
                        id={`file-${documentType}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {file && (
                        <p className="text-sm text-muted-foreground">
                            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                </div>

                {((requiresExpiry && documentType !== 'rtw') || (documentType === 'rtw' && rtwType === 'visa')) && (
                    <div className="space-y-2">
                        <Label htmlFor={`expiry-${documentType}`}>Expiry Date</Label>
                        <Input
                            id={`expiry-${documentType}`}
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            disabled={uploading}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-[#1a9e8c] hover:bg-[#1a9e8c]/90"
                >
                    {uploading ? (
                        <>
                            <Upload className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            {documentType === 'rtw' ? 'Save RTW Details' : 'Upload Document'}
                        </>
                    )}
                </Button>

                {uploadStatus === 'success' && (
                    <Alert className="border-green-500 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Document uploaded successfully and is pending verification
                        </AlertDescription>
                    </Alert>
                )}

                {uploadStatus === 'error' && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to upload document. Please try again.
                        </AlertDescription>
                    </Alert>
                )}

                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Accepted formats: PDF, JPG, PNG (max 5MB). Your document will be reviewed by our admin team.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
