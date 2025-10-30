import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Contact, Company } from '../App';
import { toast } from 'sonner';

interface ImportDataModuleProps {
  onImportComplete: (contacts: Contact[], companies: Company[]) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete';

interface ColumnMapping {
  [key: string]: string;
}

export function ImportDataModule({ onImportComplete }: ImportDataModuleProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState({ contacts: 0, companies: 0 });

  // Excel fields from specification (24 fields)
  const requiredFields = [
    'firstName', 'lastName', 'email', 'companyName'
  ];

  const availableFields = [
    // Contact Fields (9)
    'firstName', 'lastName', 'jobTitle', 'jobLevel', 'jobRole', 
    'email', 'phone', 'directPhone', 'contactLinkedIn',
    // Company Fields (12)
    'companyName', 'address', 'address2', 'city', 'state', 'zipCode', 'country',
    'website', 'revenue', 'employeeSize', 'industry', 'companyLinkedIn', 'technology',
    // System Fields (3)
    'amfNotes', 'lastUpdateDate'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xls' && fileExtension !== 'xlsx') {
      toast.error('Please upload only .xls or .xlsx files');
      return;
    }

    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const data = lines.map(line => 
        line.split(',').map(cell => cell.replace(/"/g, '').trim())
      );
      setCsvData(data);
      setCurrentStep('mapping');
    };
    reader.readAsText(uploadedFile);
  };

  const handleMapping = () => {
    const missingRequired = requiredFields.filter(field => 
      !Object.values(columnMapping).includes(field)
    );

    if (missingRequired.length > 0) {
      toast.error(`Please map required fields: ${missingRequired.join(', ')}`);
      return;
    }

    setCurrentStep('preview');
  };

  const handleImport = async () => {
    setCurrentStep('importing');
    setImportProgress(0);

    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Mock data creation
    const mockContacts: Contact[] = [];
    const mockCompanies: Company[] = [];

    // Create mock contacts and companies based on CSV data
    for (let i = 1; i < Math.min(csvData.length, 6); i++) { // Skip header and limit to 5 items
      const row = csvData[i];
      const mappedData: any = {};
      
      Object.entries(columnMapping).forEach(([csvColumn, field]) => {
        if (field === 'skip') return;
        const columnIndex = csvData[0].indexOf(csvColumn);
        if (columnIndex >= 0) {
          mappedData[field] = row[columnIndex] || '';
        }
      });

      const contact: Contact = {
        id: `imported-${i}`,
        name: mappedData.name || `Contact ${i}`,
        jobTitle: mappedData.jobTitle || 'Software Engineer',
        jobRole: mappedData.jobRole || 'Engineering',
        jobLevel: mappedData.jobLevel || 'Senior',
        companyName: mappedData.companyName || `Company ${i}`,
        employeeSize: mappedData.employeeSize || '100-500',
        revenue: mappedData.revenue || '$10M-$50M',
        industry: mappedData.industry || 'Technology',
        location: mappedData.location || 'San Francisco',
        country: mappedData.country || 'United States',
        state: mappedData.state || 'California',
        technology: mappedData.technology || 'React, Node.js',
        addedBy: 'Super Admin',
        addedByRole: 'superadmin',
        addedDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };

      mockContacts.push(contact);

      const company: Company = {
        id: `imported-company-${i}`,
        name: mappedData.companyName || `Company ${i}`,
        employeeSize: mappedData.employeeSize || '100-500',
        revenue: mappedData.revenue || '$10M-$50M',
        industry: mappedData.industry || 'Technology',
        location: mappedData.location || 'San Francisco',
        country: mappedData.country || 'United States',
        state: mappedData.state || 'California',
        technology: mappedData.technology || 'React, Node.js',
        addedBy: 'Super Admin',
        addedByRole: 'superadmin',
        addedDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };

      mockCompanies.push(company);
    }

    setImportResults({ 
      contacts: mockContacts.length, 
      companies: mockCompanies.length 
    });
    
    setCurrentStep('complete');
    onImportComplete(mockContacts, mockCompanies);
    toast.success('Data imported successfully!');
  };

  const resetImport = () => {
    setCurrentStep('upload');
    setFile(null);
    setCsvData([]);
    setColumnMapping({});
    setImportProgress(0);
    setImportResults({ contacts: 0, companies: 0 });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload XLS File</h3>
            <p className="text-gray-600 mb-6">Select an Excel file (.xls or .xlsx) to import contacts and companies</p>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="xls-upload"
            />
            <label htmlFor="xls-upload">
              <Button asChild className="cursor-pointer" style={{ backgroundColor: '#EF8037' }}>
                <span>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Choose XLS File
                </span>
              </Button>
            </label>
          </div>
        );

      case 'mapping':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Map Columns</h3>
            <p className="text-gray-600 mb-6">Map your CSV columns to the appropriate fields</p>
            <div className="space-y-4">
              {csvData[0]?.map((column, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-32">
                    <Badge variant="outline">{column}</Badge>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <Select
                    value={columnMapping[column] || 'skip'}
                    onValueChange={(value) => 
                      setColumnMapping(prev => ({ ...prev, [column]: value }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip this column</SelectItem>
                      {availableFields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field} {requiredFields.includes(field) && '*'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                Back
              </Button>
              <Button onClick={handleMapping} style={{ backgroundColor: '#EF8037' }}>
                Next: Preview
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Preview Data</h3>
            <p className="text-gray-600 mb-6">Review the first few rows of your data</p>
            <div className="overflow-x-auto mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.values(columnMapping).filter(field => field && field !== 'skip').map(field => (
                      <TableHead key={field}>{field}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.slice(1, 4).map((row, index) => (
                    <TableRow key={index}>
                      {Object.entries(columnMapping).map(([csvColumn, field]) => {
                        if (!field || field === 'skip') return null;
                        const columnIndex = csvData[0].indexOf(csvColumn);
                        return (
                          <TableCell key={field}>
                            {row[columnIndex] || '-'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleImport} style={{ backgroundColor: '#EF8037' }}>
                Import Data
              </Button>
            </div>
          </div>
        );

      case 'importing':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Importing Data...</h3>
            <p className="text-gray-600 mb-6">Please wait while we process your file</p>
            <Progress value={importProgress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">{importProgress}% complete</p>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Import Complete!</h3>
            <p className="text-gray-600 mb-6">Your data has been successfully imported</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-green-600">{importResults.contacts}</div>
                <div className="text-sm text-green-700">Contacts</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-blue-600">{importResults.companies}</div>
                <div className="text-sm text-blue-700">Companies</div>
              </div>
            </div>
            <Button onClick={resetImport} style={{ backgroundColor: '#EF8037' }}>
              Import Another File
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-white shadow-xl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-20 w-32 h-32 bg-gradient-to-tr from-orange-400/5 to-orange-600/5 rounded-full blur-2xl" />
      
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon Badge with Gradient */}
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
              <Upload className="w-6 h-6 text-white" strokeWidth={2.5} />
              
              {/* Icon Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-50 blur-lg" />
            </div>
            
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Import Data
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Upload Excel files (.xls or .xlsx) to import contacts and companies</p>
            </div>
          </div>
          
          {/* Decorative Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse" />
            <span className="text-xs font-medium text-orange-700">Super Admin Only</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {renderStepContent()}
      </CardContent>
      
      {/* Bottom Subtle Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </Card>
  );
}