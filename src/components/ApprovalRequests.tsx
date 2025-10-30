import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { CheckCircle2, XCircle, Clock, User, Mail, Building, Calendar } from 'lucide-react';
import { ApprovalRequest } from '../App';
import { toast } from 'sonner';

interface ApprovalRequestsProps {
  approvalRequests: ApprovalRequest[];
  setApprovalRequests: (requests: ApprovalRequest[]) => void;
  currentUser: { name: string; role: string };
  onApprove?: (request: ApprovalRequest) => void;
}

export function ApprovalRequests({ 
  approvalRequests, 
  setApprovalRequests, 
  currentUser,
  onApprove 
}: ApprovalRequestsProps) {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');

  const pendingRequests = approvalRequests.filter(req => req.status === 'pending');
  const approvedRequests = approvalRequests.filter(req => req.status === 'approved');
  const rejectedRequests = approvalRequests.filter(req => req.status === 'rejected');

  const handleApprove = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setNotes('');
  };

  const handleReject = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setNotes('');
  };

  const confirmAction = () => {
    if (!selectedRequest) return;

    const updatedRequests = approvalRequests.map(req =>
      req.id === selectedRequest.id
        ? {
            ...req,
            status: actionType === 'approve' ? 'approved' : 'rejected',
            reviewedBy: currentUser.name,
            reviewedAt: new Date().toISOString(),
            notes: notes.trim() || undefined
          }
        : req
    );

    setApprovalRequests(updatedRequests);

    if (actionType === 'approve') {
      toast.success(`Customer registration approved for ${selectedRequest.firstName} ${selectedRequest.lastName}`);
      if (onApprove) {
        onApprove(selectedRequest);
      }
    } else {
      toast.success(`Customer registration rejected for ${selectedRequest.firstName} ${selectedRequest.lastName}`);
    }

    setSelectedRequest(null);
    setActionType(null);
    setNotes('');
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Registration Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {approvalRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No registration requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={selectedRequest !== null && actionType !== null} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
        setNotes('');
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {actionType === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Optional)'}
                </label>
                <Textarea
                  placeholder={actionType === 'approve' 
                    ? 'Add any notes about this approval...' 
                    : 'Provide a reason for rejection...'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  className={actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {actionType === 'approve' ? (
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

