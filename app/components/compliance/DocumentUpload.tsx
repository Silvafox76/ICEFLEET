'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  Shield,
  Plus,
  Trash2,
  Camera,
  Scan
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface DocumentForm {
  type: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  assetType: string;
  assetId: string;
  issuer: string;
  notes: string;
}

const documentTypes = [
  { value: 'INSURANCE', label: 'Insurance Policy' },
  { value: 'REGISTRATION', label: 'Vehicle Registration' },
  { value: 'INSPECTION', label: 'Safety Inspection Certificate' },
  { value: 'COMMERCIAL_PERMIT', label: 'Commercial Operating Permit' },
  { value: 'SPECIAL_PERMIT', label: 'Special Transport Permit' },
];

const assetTypes = [
  { value: 'VEHICLE', label: 'Vehicle' },
  { value: 'TRAILER', label: 'Trailer' },
  { value: 'DRIVER', label: 'Driver' },
];

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState<DocumentForm>({
    type: '',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    assetType: '',
    assetId: '',
    issuer: '',
    notes: ''
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelection = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/', 'application/pdf'];
      const isValid = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Please use images or PDF files.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const simulateUpload = async (fileId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const file = files.find(f => f.id === fileId);
      if (!file) {
        reject(new Error('File not found'));
        return;
      }

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading' as const } : f
      ));

      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        
        // Simulate random success/failure (90% success rate)
        if (Math.random() > 0.1) {
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'success' as const, progress: 100 }
              : f
          ));
          resolve(`/uploads/${file.file.name}-${Date.now()}`);
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, status: 'error' as const, error: 'Upload failed. Please try again.' }
              : f
          ));
          reject(new Error('Upload failed'));
        }
      }, 2000 + Math.random() * 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.type || !form.documentNumber || !form.expiryDate || !form.assetType || !form.assetId) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document file.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const uploadPromises = files.map(file => simulateUpload(file.id));
      const uploadedPaths = await Promise.all(uploadPromises);

      // Create document record
      const documentData = {
        ...form,
        issueDate: form.issueDate ? new Date(form.issueDate) : new Date(),
        expiryDate: new Date(form.expiryDate),
        cloudStoragePath: uploadedPaths[0], // Use first uploaded file
        status: 'VALID'
      };

      const response = await fetch('/api/compliance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData)
      });

      if (response.ok) {
        toast({
          title: "Document uploaded successfully",
          description: "Your compliance document has been added to the system.",
        });

        // Reset form
        setForm({
          type: '',
          documentNumber: '',
          issueDate: '',
          expiryDate: '',
          assetType: '',
          assetId: '',
          issuer: '',
          notes: ''
        });
        setFiles([]);
        
        onUploadComplete?.();
      } else {
        throw new Error('Failed to save document');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload compliance documents and associate them with fleet assets
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Information</CardTitle>
            <CardDescription>
              Enter the document details and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="docType">Document Type *</Label>
                <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentNumber">Document Number *</Label>
                <Input
                  id="documentNumber"
                  value={form.documentNumber}
                  onChange={(e) => setForm({...form, documentNumber: e.target.value})}
                  placeholder="Policy/permit number"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetType">Asset Type *</Label>
                <Select value={form.assetType} onValueChange={(value) => setForm({...form, assetType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assetId">Asset ID *</Label>
                <Input
                  id="assetId"
                  value={form.assetId}
                  onChange={(e) => setForm({...form, assetId: e.target.value})}
                  placeholder="Vehicle/Trailer/Driver ID"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm({...form, issueDate: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({...form, expiryDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="issuer">Issuing Authority</Label>
              <Input
                id="issuer"
                value={form.issuer}
                onChange={(e) => setForm({...form, issuer: e.target.value})}
                placeholder="e.g., Ministry of Transportation"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                placeholder="Additional notes about this document"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Files</CardTitle>
            <CardDescription>
              Upload images or PDF files of the documents (max 10MB each)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports: Images (JPG, PNG, etc.) and PDF files up to 10MB
                  </p>
                </div>
                
                <div className="mt-4 flex justify-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      // This would typically open camera on mobile
                      toast({
                        title: "Camera feature",
                        description: "Camera functionality would be available on mobile devices",
                      });
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-gray-900">Uploaded Files ({files.length})</h4>
                {files.map((file) => (
                  <FileUploadItem
                    key={file.id}
                    file={file}
                    onRemove={() => removeFile(file.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setForm({
                type: '',
                documentNumber: '',
                issueDate: '',
                expiryDate: '',
                assetType: '',
                assetId: '',
                issuer: '',
                notes: ''
              });
              setFiles([]);
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || files.length === 0}
            className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FileUploadItem({ file, onRemove }: { 
  file: UploadedFile; 
  onRemove: () => void;
}) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (file.status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'uploading': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor()}`}>
      {/* Preview */}
      <div className="flex-shrink-0">
        {file.preview ? (
          <img 
            src={file.preview} 
            alt={file.file.name}
            className="w-12 h-12 rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.file.name}
          </p>
          <Badge variant="outline" className="text-xs">
            {(file.file.size / 1024 / 1024).toFixed(1)} MB
          </Badge>
        </div>
        
        {file.status === 'uploading' && (
          <div className="mt-2">
            <Progress value={file.progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Uploading... {Math.round(file.progress)}%
            </p>
          </div>
        )}
        
        {file.status === 'error' && file.error && (
          <p className="text-xs text-red-600 mt-1">{file.error}</p>
        )}
        
        {file.status === 'success' && (
          <p className="text-xs text-green-600 mt-1">Upload complete</p>
        )}
      </div>

      {/* Remove Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="text-red-600 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}