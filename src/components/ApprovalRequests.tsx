import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { CheckCircle2, XCircle, Clock, User, Mail, Building, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ApprovalRequest } from '@/types/dashboard.types';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getApproveRequests, approveRequest, rejectRequest } from '@/store/slices/approveRequests.slice';

interface ApprovalRequestsProps {
  approvalRequests?: ApprovalRequest[];
  setApprovalRequests?: (requests: ApprovalRequest[]) => void;
  currentUser: { name: string; role: string };
  onApprove?: (request: ApprovalRequest) => void;
}

export function ApprovalRequests({ 
  approvalRequests: propApprovalRequests, 
  setApprovalRequests: propSetApprovalRequests, 
  currentUser,
  onApprove 
}: ApprovalRequestsProps) {
  const dispatch = useAppDispatch();
  const { requests, pagination, stats, isLoading, isApproving, isRejecting, error, lastFetchParams } = useAppSelector((state) => state.approveRequests);
  
  // Use Redux state if available, otherwise fall back to props
  const approvalRequests = requests.length > 0 ? requests : (propApprovalRequests || []);
  
  const [selectedRequest, setSelectedRequest] = useState(null as ApprovalRequest | null);
  const [actionType, setActionType] = useState(null as 'approve' | 'reject' | null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(25);

  // Helper function to check if params match
  const paramsMatch = (params1: { page?: number; limit?: number } | null, params2: { page?: number; limit?: number }): boolean => {
    if (!params1) return false;
    return params1.page === params2.page && params1.limit === params2.limit;
  };

  // Fetch approve requests on component mount and when page/limit changes
  useEffect(() => {
    const currentParams = { page: currentPage, limit: pageLimit };
    
    // Check if we need to fetch:
    // 1. No data exists (requests.length === 0)
    // 2. Params changed (page or limit)
    // 3. No cache exists (lastFetchParams is null)
    const shouldFetch = 
      requests.length === 0 || 
      !paramsMatch(lastFetchParams, currentParams) ||
      lastFetchParams === null;

    if (shouldFetch) {
      dispatch(getApproveRequests(currentParams));
    }
  }, [dispatch, currentPage, pageLimit, requests.length, lastFetchParams]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleApprove = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setRejectionReason('');
  };

  const handleReject = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setRejectionReason('');
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    // Get customerId from request (it might be in id field or customerId field)
    const customerId = (selectedRequest as any).customerId 
      || (selectedRequest as any)._id 
      || selectedRequest.id
      || (selectedRequest as any).id;

    // Validate customerId exists
    if (!customerId || (typeof customerId === 'string' && customerId.trim() === '')) {
      console.error('Customer ID missing in request:', selectedRequest);
      toast.error('Customer ID is missing. Please refresh the page and try again.');
      return;
    }

    // Convert to string and trim
    const customerIdString = String(customerId).trim();

    if (actionType === 'approve') {
      try {
        await dispatch(approveRequest({ customerId: customerIdString })).unwrap();
        toast.success(`Customer registration approved for ${selectedRequest.firstName} ${selectedRequest.lastName}`);
        if (onApprove) {
          onApprove(selectedRequest);
        }
        // Refresh the list
        dispatch(getApproveRequests({ page: currentPage, limit: pageLimit }));
        setSelectedRequest(null);
        setActionType(null);
        setRejectionReason('');
      } catch (error: any) {
        toast.error(error.message || 'Failed to approve request');
      }
    } else {
      // Reject action - rejection reason is mandatory
      if (!rejectionReason.trim()) {
        toast.error('Rejection reason is required');
        return;
      }

      try {
        await dispatch(rejectRequest({ customerId: customerIdString, rejectionReason: rejectionReason.trim() })).unwrap();
        toast.success(`Customer registration rejected for ${selectedRequest.firstName} ${selectedRequest.lastName}`);
        // Refresh the list
        dispatch(getApproveRequests({ page: currentPage, limit: pageLimit }));
        setSelectedRequest(null);
        setActionType(null);
        setRejectionReason('');
      } catch (error: any) {
        toast.error(error.message || 'Failed to reject request');
      }
    }
  };

  // Use pagination from API or default values for display
  const displayPage = pagination?.currentPage || currentPage;
  const rowsPerPage = pagination?.limit || pageLimit;
  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.limit : 0;

  const handlePageNavigation = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string) => {
    const limit = parseInt(value, 10);
    setPageLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approvedRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejectedRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Table */}
      <Card className="flex flex-col flex-1 min-h-0">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Customer Registration Requests</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-20 rounded" />
                          <Skeleton className="h-8 w-20 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : approvalRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No registration requests found</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.firstName} {request.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {request.businessEmail}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {request.companyName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(request.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.reviewedBy ? (
                          <div>
                            <div className="text-sm">{request.reviewedBy}</div>
                            {request.reviewedAt && (
                              <div className="text-xs text-gray-500">
                                {formatDate(request.reviewedAt)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(request)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {request.status !== 'pending' && request.notes && (
                          <div className="text-xs text-gray-500 max-w-xs truncate" title={request.notes}>
                            {request.notes}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls - Fixed at bottom */}
          {pagination && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Label>Rows per page:</Label>
                <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalCount)} of {totalCount} results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageNavigation(Math.max(displayPage - 1, 1))}
                  disabled={!pagination?.hasPreviousPage || displayPage === 1 || isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={displayPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageNavigation(pageNum)}
                        style={displayPage === pageNum ? { backgroundColor: currentUser.role === 'superadmin' ? '#EF8037' : '#EB432F' } : {}}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageNavigation(Math.min(displayPage + 1, totalPages))}
                  disabled={!pagination?.hasNextPage || displayPage === totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={selectedRequest !== null && actionType !== null} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
        setRejectionReason('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Customer Registration' : 'Reject Customer Registration'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {actionType === 'approve' 
                    ? `Are you sure you want to approve the registration request for ${selectedRequest.firstName} ${selectedRequest.lastName}?`
                    : `Are you sure you want to reject the registration request for ${selectedRequest.firstName} ${selectedRequest.lastName}?`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{selectedRequest.firstName} {selectedRequest.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedRequest.businessEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedRequest.companyName}</span>
                </div>
              </div>
              
              {actionType === 'reject' && (
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason" className="text-sm font-medium">
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e: { target: { value: string } }) => setRejectionReason(e.target.value)}
                    rows={3}
                    required
                    className={!rejectionReason.trim() ? 'border-red-300' : ''}
                  />
                  {!rejectionReason.trim() && (
                    <p className="text-xs text-red-500">Rejection reason is required</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setRejectionReason('');
                  }}
                  disabled={isApproving || isRejecting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  disabled={isApproving || isRejecting || (actionType === 'reject' && !rejectionReason.trim())}
                  className={actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {isApproving || isRejecting ? (
                    'Processing...'
                  ) : actionType === 'approve' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

