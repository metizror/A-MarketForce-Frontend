import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Search, ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Contact, type Company } from '@/types/dashboard.types';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { importContacts, type ContactImportData } from '@/store/slices/contactsImport.slice';

interface ImportDataModuleProps {
  onImportComplete: (contacts: Contact[], companies: Company[]) => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'table' | 'complete';

interface ColumnMapping {
  [key: string]: string;
}

interface ImportedRow {
  [key: string]: string;
}

export function ImportDataModule({ onImportComplete }: ImportDataModuleProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isImporting, importResult, error: importError } = useAppSelector((state) => state.contactsImport);
  
  const [currentStep, setCurrentStep] = useState('upload' as ImportStep);
  const [file, setFile] = useState(null as File | null);
  const [csvData, setCsvData] = useState([] as string[][]);
  const [excelHeaders, setExcelHeaders] = useState([] as string[]);
  const [importedRows, setImportedRows] = useState([] as ImportedRow[]);
  const [columnMapping, setColumnMapping] = useState({} as ColumnMapping);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState({ contacts: 0, companies: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc' as 'asc' | 'desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewRowsPerPage, setPreviewRowsPerPage] = useState(25);

  // Excel fields from specification (24 fields)
  const requiredFields = [
    'firstName', 'lastName', 'email', 'companyName'
  ];

  const availableFields = [
    // Contact Fields (9)
    'firstName', 'lastName', 'jobTitle', 'jobLevel', 'jobRole', 
    'email', 'phone', 'directPhone', 'contactLinkedIn',
    // Company Fields (13)
    'companyName', 'address', 'address1', 'address2', 'city', 'state', 'zipCode', 'country',
    'website', 'revenue', 'employeeSize', 'industry', 'subIndustry', 'companyLinkedIn', 'technology',
    // System Fields (3)
    'amfNotes', 'lastUpdateDate', 'LinkedInUrl'
  ];

  const handleFileUpload = (event: { target: { files?: FileList | null } }) => {
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
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length === 0) {
          toast.error('The Excel file appears to be empty');
          return;
        }

        console.log("jsonData", jsonData)

        // First row is headers
        const headers = jsonData[0].map((h: unknown) => String(h || '').trim()).filter((h: string) => h);
        const rows = jsonData.slice(1).map((row: unknown[]) => {
          const rowObj: ImportedRow = {};
          headers.forEach((header: string, index: number) => {
            rowObj[header] = String(row[index] || '').trim();
          });
          return rowObj;
        }).filter((row: ImportedRow) => Object.values(row).some((val: string) => val)); // Filter empty rows

        setExcelHeaders(headers);
        setImportedRows(rows);
        
        // Convert to old format for compatibility
        const csvFormat = [headers, ...rows.map(row => headers.map(h => row[h] || ''))];
        setCsvData(csvFormat);
        
        setCurrentStep('mapping');
        toast.success(`Successfully loaded ${rows.length} rows from Excel file`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('Failed to parse Excel file. Please ensure it is a valid .xls or .xlsx file.');
      }
    };
    reader.readAsBinaryString(uploadedFile);
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

    try {
      // Get createdBy value from user
      const createdBy = user?.name || (user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'System Admin');

      // Transform imported rows to API format
      const importData: ContactImportData[] = importedRows.map((row: ImportedRow) => {
        const mappedData: Record<string, string> = {};
        
        // Map Excel columns to fields
        Object.entries(columnMapping).forEach(([excelColumn, field]) => {
          if (field === 'skip') return;
          mappedData[field as string] = row[excelColumn] || '';
        });

        // Transform to API format
        return {
          firstName: mappedData.firstName || '',
          lastName: mappedData.lastName || '',
          jobTitle: mappedData.jobTitle || '',
          jobLevel: mappedData.jobLevel || '',
          jobRole: mappedData.jobRole || '',
          email: mappedData.email || '',
          phone: mappedData.phone || '',
          directPhone: mappedData.directPhone || '',
          address1: mappedData.address1 || mappedData.address || '',
          address2: mappedData.address2 || '',
          city: mappedData.city || '',
          state: mappedData.state || '',
          zipCode: mappedData.zipCode || '',
          country: mappedData.country || '',
          website: mappedData.website || '',
          industry: mappedData.industry || '',
          subIndustry: mappedData.subIndustry || '',
          LinkedInUrl: mappedData.LinkedInUrl || mappedData.contactLinkedIn || mappedData.companyLinkedIn || '',
          companyName: mappedData.companyName || '',
          employeeSize: mappedData.employeeSize || '',
          revenue: mappedData.revenue || '',
          amfNotes: mappedData.amfNotes || '',
          createdBy: createdBy || 'System Admin'
        };
      });

      // Simulate progress while API call is in progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Call the API
      const result = await dispatch(importContacts({ data: importData })).unwrap();
      
      clearInterval(progressInterval);
      setImportProgress(100);

      // Update results
      const successCount = result.success || importData.length;
      const failedCount = result.failed || 0;
      
      setImportResults({ 
        contacts: successCount, 
        companies: 0 // API only imports contacts
      });

      // Show success/error messages
      if (result.success && result.success > 0) {
        toast.success(`Successfully imported ${result.success} contact(s)`);
      }
      if (result.failed && result.failed > 0) {
        toast.warning(`${result.failed} contact(s) failed to import`);
      }
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach((error: { row: number; email: string; error: string }) => {
          toast.error(`Row ${error.row} (${error.email}): ${error.error}`);
        });
      }

      setCurrentStep('complete');
    } catch (error: any) {
      setImportProgress(0);
      const errorMessage = error.message || importError || 'Failed to import contacts';
      toast.error(errorMessage);
      setCurrentStep('preview'); // Go back to preview on error
    }
  };

  const resetImport = () => {
    setCurrentStep('upload');
    setFile(null);
    setCsvData([]);
    setExcelHeaders([]);
    setImportedRows([]);
    setColumnMapping({});
    setImportProgress(0);
    setImportResults({ contacts: 0, companies: 0 });
    setSearchQuery('');
    setSortField('');
    setSortDirection('asc');
    setCurrentPage(1);
    setRowsPerPage(25);
  };

  // Get mapped data for display
  const getMappedData = useMemo(() => {
    return importedRows.map((row: ImportedRow) => {
      const mapped: Record<string, string> = {};
      Object.entries(columnMapping).forEach(([excelColumn, field]) => {
        if (field && field !== 'skip' && typeof field === 'string') {
          mapped[field] = row[excelColumn] || '';
        }
      });
      return mapped;
    });
  }, [importedRows, columnMapping]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...getMappedData];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(query)
        )
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = String(a[sortField] || '').toLowerCase();
        const bValue = String(b[sortField] || '').toLowerCase();
        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return result;
  }, [getMappedData, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  // Get display columns (mapped fields)
  const displayColumns = useMemo(() => {
    return Object.values(columnMapping).filter(field => field && field !== 'skip');
  }, [columnMapping]);

  // Filter rows based on search query for preview (must be at top level)
  const filteredPreviewRows = useMemo(() => {
    if (!searchQuery) return importedRows;
    const query = searchQuery.toLowerCase();
    return importedRows.filter((row: ImportedRow) => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(query)
      )
    );
  }, [importedRows, searchQuery]);

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
          <div className="flex flex-col" style={{ minHeight: '500px' }}>
            <h3 className="text-lg font-medium mb-4">Map Columns</h3>
            <p className="text-gray-600 mb-6">Map your Excel columns to the appropriate fields</p>
            <div 
              className="space-y-4 mb-6 border rounded-lg p-4 bg-gray-50 mapping-scroll-container"
              style={{ 
                maxHeight: 'calc(100vh - 450px)',
                minHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'thin',
                scrollbarColor: '#EF8037 #f1f1f1'
              }}
            >
              {excelHeaders.map((column: string, index: number) => (
                <div key={index} className="flex items-center space-x-4 bg-white p-3 rounded-md border border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="w-32 flex-shrink-0">
                    <Badge variant="outline" className="font-medium">{column}</Badge>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <Select
                    value={columnMapping[column] || 'skip'}
                    onValueChange={(value: string) => 
                      setColumnMapping((prev: ColumnMapping) => ({ ...prev, [column]: value }))
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
            <div className="sticky bottom-0 left-0 right-0 flex justify-end gap-3 pt-6 pb-4 mt-auto border-t-2 border-gray-300 bg-white shadow-lg z-50 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('upload')}
                className="min-w-[110px] h-11 border-gray-300 hover:bg-gray-50 font-medium"
              >
                Back
              </Button>
              <Button 
                onClick={handleMapping} 
                style={{ backgroundColor: '#EF8037' }}
                className="min-w-[150px] h-11 font-semibold shadow-md hover:opacity-90"
              >
                Next: Preview
              </Button>
            </div>
          </div>
        );

      case 'preview': {
        // Show all rows - no pagination, just scrolling

        return (
          <div className="flex flex-col space-y-4 pb-20">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Preview Data</h3>
              <p className="text-sm text-gray-600">
                Review all rows of your data • <span className="font-semibold text-orange-600">{filteredPreviewRows.length}</span> {filteredPreviewRows.length === 1 ? 'row' : 'rows'} total
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-shrink-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search data..."
                  value={searchQuery}
                  onChange={(e: { target: { value: string } }) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="pl-10 h-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Table Container with Scroll - Shows All Data */}
            <div 
              className="mb-4 border rounded-lg bg-white shadow-sm preview-table-scroll"
              style={{ 
                height: '500px',
                overflow: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#EF8037 #f1f1f1'
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white z-10 shadow-sm border-b-2 border-gray-200">
                    <tr>
                      {displayColumns.map(field => (
                        <th 
                          key={field} 
                          className="bg-white font-semibold text-left px-4 py-3 text-gray-700 whitespace-nowrap"
                        >
                          {field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPreviewRows.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={displayColumns.length} 
                          className="text-center py-12 text-gray-500"
                        >
                          {searchQuery ? 'No results found' : 'No data to display'}
                        </td>
                      </tr>
                    ) : (
                      filteredPreviewRows.map((row: ImportedRow, index: number) => (
                        <tr 
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {Object.entries(columnMapping).map(([excelColumn, field]) => {
                            if (!field || field === 'skip') return null;
                            return (
                              <td 
                                key={field}
                                className="px-4 py-3 text-gray-700 whitespace-nowrap"
                              >
                                {row[excelColumn] || '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Count Info */}
            {filteredPreviewRows.length > 0 && (
              <div className="flex items-center justify-between flex-shrink-0 bg-gray-50 px-4 py-2 rounded-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{filteredPreviewRows.length}</span> {filteredPreviewRows.length === 1 ? 'row' : 'rows'}
                    {searchQuery && (
                      <span className="text-gray-500 ml-1">
                        (filtered from {importedRows.length} total)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Scroll to view all data ↓
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons - Sticky at Bottom - Always Visible */}
            <div className="sticky bottom-0 left-0 right-0 flex justify-end gap-3 mt-6 pt-4 pb-4 border-t-2 border-gray-300 bg-white shadow-xl z-50 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('mapping')}
                className="min-w-[110px] h-10 border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button 
                onClick={handleImport} 
                style={{ backgroundColor: '#EF8037' }}
                disabled={isImporting || filteredPreviewRows.length === 0}
                className="min-w-[160px] h-10 font-semibold shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      }

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
            {importError && (
              <p className="text-sm text-red-500 mt-4">{importError}</p>
            )}
          </div>
        );

      case 'table':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium">Imported Data</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredAndSortedData.length} {filteredAndSortedData.length === 1 ? 'row' : 'rows'} imported
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-green-50 px-3 py-1 rounded-lg">
                  <div className="text-sm font-semibold text-green-600">{importResults.contacts}</div>
                  <div className="text-xs text-green-700">Contacts</div>
                </div>
                <div className="bg-blue-50 px-3 py-1 rounded-lg">
                  <div className="text-sm font-semibold text-blue-600">{importResults.companies}</div>
                  <div className="text-xs text-blue-700">Companies</div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search imported data..."
                  value={searchQuery}
                  onChange={(e: { target: { value: string } }) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {displayColumns.map((field: string) => {
                        // Show key fields prominently
                        const isKeyField = ['firstName', 'lastName', 'email', 'phone', 'companyName'].includes(field);
                        return (
                          <TableHead 
                            key={field}
                            className={isKeyField ? "font-semibold" : ""}
                          >
                            <button
                              onClick={() => handleSort(field)}
                              className="flex items-center hover:text-orange-600 transition-colors"
                            >
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                              {getSortIcon(field)}
                            </button>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={displayColumns.length} className="text-center py-8 text-gray-500">
                          {searchQuery ? 'No results found' : 'No data to display'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((row: Record<string, string>, index: number) => {
                        const firstName = row.firstName || '';
                        const lastName = row.lastName || '';
                        const name = `${firstName} ${lastName}`.trim() || 'N/A';
                        const jobTitle = row.jobTitle || '';
                        
                        return (
                          <TableRow key={startIndex + index}>
                            {displayColumns.map((field: string) => {
                              // Special rendering for name field
                              if (field === 'firstName' || (field === 'lastName' && !displayColumns.includes('firstName'))) {
                                return (
                                  <TableCell key={field}>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-orange-100 text-orange-600 text-xs">
                                          {getInitials(firstName, lastName)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{name}</div>
                                        {jobTitle && (
                                          <div className="text-sm text-gray-500">{jobTitle}</div>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                );
                              }
                              // Skip lastName if firstName is shown (to avoid duplication)
                              if (field === 'lastName' && displayColumns.includes('firstName')) {
                                return null;
                              }
                              return (
                                <TableCell key={field}>
                                  {row[field] || '-'}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(value: string) => {
                      setRowsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_: unknown, i: number) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            style={currentPage === pageNum ? { backgroundColor: '#EF8037' } : {}}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={resetImport}>
                Import Another File
              </Button>
              <Button onClick={() => setCurrentStep('complete')} style={{ backgroundColor: '#EF8037' }}>
                Done
              </Button>
            </div>
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