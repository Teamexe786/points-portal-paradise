import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StorageManager, RedeemRequest } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CheckCircle, Clock, Gift, CreditCard, ArrowLeft } from 'lucide-react';

export const AdminWithdrawals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<RedeemRequest[]>([]);

  useEffect(() => {
    // Check admin auth
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    loadRequests();
  }, [navigate]);

  const loadRequests = () => {
    const allRequests = StorageManager.getRedeemRequests();
    setRequests(allRequests.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));
  };

  const markAsPaid = (requestId: string) => {
    StorageManager.markRedeemRequestAsPaid(requestId);
    loadRequests();
    
    toast({
      title: "Request Processed",
      description: "The redemption request has been marked as paid.",
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const completedRequests = requests.filter(r => r.status === 'paid');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Withdrawal Requests
            </h1>
            <p className="text-muted-foreground">
              Manage user redemption requests and process payments
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{completedRequests.length}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <DollarSign className="h-4 w-4 text-reward-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-reward-gold">
                {requests.reduce((sum, r) => sum + r.points, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All redemption requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span>Pending Requests</span>
            </CardTitle>
            <CardDescription>
              Redemption requests that need to be processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending redemption requests
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.userName}</div>
                            <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {request.upiId ? (
                              <>
                                <CreditCard className="h-4 w-4" />
                                <span>UPI</span>
                              </>
                            ) : (
                              <>
                                <Gift className="h-4 w-4" />
                                <span>Gift Card</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {request.upiId && (
                              <div className="font-mono">{request.upiId}</div>
                            )}
                            {request.giftCard && (
                              <div className="capitalize">{request.giftCard.replace('-', ' ')}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-reward-gold">
                            {request.points}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate text-sm">
                            {request.note || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => markAsPaid(request.id)}
                            className="bg-gradient-primary hover:opacity-90"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Completed Requests</span>
            </CardTitle>
            <CardDescription>
              Successfully processed redemption requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No completed requests yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.userName}</div>
                            <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {request.upiId ? (
                              <>
                                <CreditCard className="h-4 w-4" />
                                <span>UPI</span>
                              </>
                            ) : (
                              <>
                                <Gift className="h-4 w-4" />
                                <span>Gift Card</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {request.upiId && (
                              <div className="font-mono">{request.upiId}</div>
                            )}
                            {request.giftCard && (
                              <div className="capitalize">{request.giftCard.replace('-', ' ')}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-reward-gold">
                            {request.points}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};