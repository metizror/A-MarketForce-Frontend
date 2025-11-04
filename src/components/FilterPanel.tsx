import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  filters: any;
  setFilters: (filters: any) => void;
  onClose: () => void;
}

export function FilterPanel({ filters, setFilters, onClose }: FilterPanelProps) {
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [contactExpanded, setContactExpanded] = useState(true);

  const employeeSizes = [
    '1 - 25',
    '26 - 50',
    '51 - 100',
    '101 - 250',
    '251 - 500',
    '501 - 1000',
    '1001 - 2500',
    '2501 - 5000',
    '5001 - 10000',
    'over 10,001'
  ];
  const revenues = ['Less than 1M',
    '1M - 5M',
    '5M - 10M',
    '10M - 50M',
    '50M - 100M',
    '100M - 250M',
    '250M - 500M',
    '500M - 1B',
    'More than 1B',
  ];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Marketing', 'Education', 'Manufacturing'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia'];
  const states = ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington'];
  const jobLevels = ['Entry', 'Mid', 'Senior', 'Director', 'VP', 'C-Level'];
  const jobRoles = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="w-full flex items-center gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-4 space-y-6">
            {/* Company Level Filters */}
            <Collapsible open={companyExpanded} onOpenChange={setCompanyExpanded}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                <span className="font-medium text-gray-900">Company Level</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${companyExpanded ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Search company..."
                    value={filters.companyName || ''}
                    onChange={(e) => handleFilterChange('companyName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Employee Size</Label>
                  <Select value={filters.employeeSize || ''} onValueChange={(value) => handleFilterChange('employeeSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeSizes.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Revenue</Label>
                  <Select value={filters.revenue || ''} onValueChange={(value) => handleFilterChange('revenue', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenues.map((revenue) => (
                        <SelectItem key={revenue} value={revenue}>{revenue}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Industry</Label>
                  <Select value={filters.industry || ''} onValueChange={(value) => handleFilterChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Country</Label>
                  <Select value={filters.country || ''} onValueChange={(value) => handleFilterChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">State</Label>
                  <Select value={filters.state || ''} onValueChange={(value) => handleFilterChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technology" className="text-sm">Technology / Software</Label>
                  <Input
                    id="technology"
                    placeholder="e.g. React, Salesforce..."
                    value={filters.technology || ''}
                    onChange={(e) => handleFilterChange('technology', e.target.value)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Contact Level Filters */}
            <Collapsible open={contactExpanded} onOpenChange={setContactExpanded}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                <span className="font-medium text-gray-900">Contact Level</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${contactExpanded ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="job-title" className="text-sm">Job Title</Label>
                  <Input
                    id="job-title"
                    placeholder="Search job title..."
                    value={filters.jobTitle || ''}
                    onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Job Role</Label>
                  <Select value={filters.jobRole || ''} onValueChange={(value) => handleFilterChange('jobRole', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Job Level</Label>
                  <Select value={filters.jobLevel || ''} onValueChange={(value) => handleFilterChange('jobLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </ScrollArea>

      {/* Apply Button */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          className="w-full"
          style={{ backgroundColor: '#EF8037' }}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}