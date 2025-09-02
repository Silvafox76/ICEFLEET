
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Plus, 
  Search,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import type { ComplianceDocument } from '@/lib/types';
import { calculateDaysUntilExpiry, getComplianceStatus, formatDate } from '@/lib/types';

interface ExtendedComplianceDocument extends ComplianceDocument {
  vehicle?: {
    make: string;
    model: string;
    licensePlate: string;
  };
  trailer?: {
    type: string;
    serialNumber: string;
  };
}

export default function ComplianceDashboard() {
  const [documents, setDocuments] = useState<ExtendedComplianceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  // Form state
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    type: 'INSURANCE',
    documentNumber: '',
    issueDate: '',
    expiryDate: '',
    assetType: 'VEHICLE',
    assetId: '',
    issuer: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/compliance/documents')
      .then(res => res.json())
      .then(data => {
        setDocuments(data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching compliance documents:', error);
        setLoading(false);
      });
  }, []);

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...documentForm,
          issueDate: new Date(documentForm.issueDate),
          expiryDate: new Date(documentForm.expiryDate)
        })
      });
      
      if (response.ok) {
        const newDocument = await response.json();
        setDocuments([...documents, newDocument]);
        setIsDocumentDialogOpen(false);
        setDocumentForm({
          type: 'INSURANCE',
          documentNumber: '',
          issueDate: '',
          expiryDate: '',
          assetType: 'VEHICLE',
          assetId: '',
          issuer: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error adding compliance document:', error);
    }
  };

  if (loading) {
    return <ComplianceSkeleton />;
  }

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc?.documentNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      doc?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc?.type === selectedType;
    
    return matchesSearch && matchesType;
  }) ?? [];

  // Calculate summary stats
  const totalDocuments = documents?.length ?? 0;
  const expiredDocs = documents?.filter(doc => 
    calculateDaysUntilExpiry(doc?.expiryDate ?? new Date()) <= 0
  )?.length ?? 0;
  const expiringSoonDocs = documents?.filter(doc => {
    const days = calculateDaysUntilExpiry(doc?.expiryDate ?? new Date());
    return days > 0 && days <= 30;
  })?.length ?? 0;
  const validDocs = totalDocuments - expiredDocs - expiringSoonDocs;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-[#0B1F3A]">{totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-[#2F80FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valid</p>
                <p className="text-2xl font-bold text-[#11A36A]">{validDocs}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#11A36A]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{expiringSoonDocs}</p>
              </div>
              <Clock className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-[#D92D20]">{expiredDocs}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-[#D92D20]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F80FF] focus:border-[#2F80FF] outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2F80FF] focus:border-[#2F80FF] outline-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="INSURANCE">Insurance</option>
                <option value="REGISTRATION">Registration</option>
                <option value="INSPECTION">Inspection</option>
                <option value="COMMERCIAL_PERMIT">Commercial Permit</option>
                <option value="SPECIAL_PERMIT">Special Permit</option>
              </select>
              
              <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Compliance Document</DialogTitle>
                    <DialogDescription>
                      Enter the compliance document details for tracking
                    </DialogDescription>
                  </DialogHeader>
                  <ComplianceDocumentForm 
                    form={documentForm} 
                    setForm={setDocumentForm} 
                    onSubmit={handleDocumentSubmit} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0B1F3A] flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Compliance Documents
          </CardTitle>
          <CardDescription>All regulatory documents and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocuments?.map((doc) => (
              <ComplianceDocumentCard key={doc?.id} document={doc} />
            ))}
            {!filteredDocuments?.length && (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No compliance documents found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceDocumentCard({ document }: { document: ExtendedComplianceDocument }) {
  const daysUntilExpiry = calculateDaysUntilExpiry(document?.expiryDate ?? new Date());
  const status = getComplianceStatus(daysUntilExpiry);

  let assetInfo = 'No Asset';
  if (document?.vehicle) {
    assetInfo = `${document.vehicle.make} ${document.vehicle.model} (${document.vehicle.licensePlate})`;
  } else if (document?.trailer) {
    assetInfo = `${document.trailer.type} Trailer (${document.trailer.serialNumber})`;
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-semibold text-[#0B1F3A] text-sm">
            {document?.type?.replace('_', ' ')} - {document?.documentNumber}
          </h4>
          <StatusBadge status={status}>
            {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
          </StatusBadge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium">Asset:</span>
            <span>{assetInfo}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Expires: {formatDate(document?.expiryDate ?? new Date())}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Issued:</span>
            <span>{formatDate(document?.issueDate ?? new Date())}</span>
          </div>
          {document?.notes && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Notes:</span>
              <span className="truncate">{document.notes}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        {status === 'red' && (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        )}
        <Button variant="ghost" size="sm">
          View
        </Button>
      </div>
    </div>
  );
}

function ComplianceDocumentForm({ form, setForm, onSubmit }: {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="docType">Document Type</Label>
          <Select value={form.type} onValueChange={(value) => setForm({...form, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INSURANCE">Insurance Policy</SelectItem>
              <SelectItem value="REGISTRATION">Registration</SelectItem>
              <SelectItem value="INSPECTION">Safety Inspection</SelectItem>
              <SelectItem value="COMMERCIAL_PERMIT">Commercial Permit</SelectItem>
              <SelectItem value="SPECIAL_PERMIT">Special Permit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="documentNumber">Document Number</Label>
          <Input
            id="documentNumber"
            value={form.documentNumber}
            onChange={(e) => setForm({...form, documentNumber: e.target.value})}
            placeholder="Policy/permit number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assetType">Asset Type</Label>
          <Select value={form.assetType} onValueChange={(value) => setForm({...form, assetType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VEHICLE">Vehicle</SelectItem>
              <SelectItem value="TRAILER">Trailer</SelectItem>
              <SelectItem value="DRIVER">Driver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assetId">Asset ID</Label>
          <Input
            id="assetId"
            value={form.assetId}
            onChange={(e) => setForm({...form, assetId: e.target.value})}
            placeholder="Vehicle/Trailer/Driver ID"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({...form, issueDate: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
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
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm({...form, notes: e.target.value})}
          placeholder="Additional notes about this document"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setForm({
          type: 'INSURANCE',
          documentNumber: '',
          issueDate: '',
          expiryDate: '',
          assetType: 'VEHICLE',
          assetId: '',
          issuer: '',
          notes: ''
        })}>
          Reset
        </Button>
        <Button type="submit" className="bg-[#2F80FF] hover:bg-[#1e6acc] text-white">
          Add Document
        </Button>
      </div>
    </form>
  );
}

function ComplianceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}
