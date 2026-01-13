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
        if (!file) {
            toast({
                title: 'No file selected',
                description: 'Please select a file to upload',
                variant: 'destructive',
            });
            return;
        }

        if (requiresExpiry && !expiryDate) {
            toast({
                title: 'Expiry date required',
                description: 'Please enter the document expiry date',
                variant: 'destructive',
            });
            return;
        }

        setUploading(true);

        try {
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
            const { data: { publicUrl } } = supabase.storage
                .from('verification-documents')
                .getPublicUrl(fileName);

            // Update carer_verification table
            const updateData: any = {
                [`${documentType}_document_url`]: publicUrl,
                [`${documentType}_status`]: 'pending',
            };

            if (requiresExpiry && expiryDate) {
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
                <div className="space-y-2">
                    <Label htmlFor={`file-${documentType}`}>Upload Document</Label>
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

                {requiresExpiry && (
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
                    disabled={!file || uploading}
                    className="w-full"
                >
                    {uploading ? (
                        <>
                            <Upload className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
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
