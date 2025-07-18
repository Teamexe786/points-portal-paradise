import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StorageManager, SupportMessage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, CheckCircle, Clock, ArrowLeft, Mail } from 'lucide-react';

export const AdminSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  useEffect(() => {
    // Check admin auth
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    loadMessages();
  }, [navigate]);

  const loadMessages = () => {
    const allMessages = StorageManager.getSupportMessages();
    setMessages(allMessages.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
  };

  const markAsResolved = (messageId: string) => {
    StorageManager.markSupportMessageAsResolved(messageId);
    loadMessages();
    
    toast({
      title: "Message Resolved",
      description: "The support message has been marked as resolved.",
    });
  };

  const openMessages = messages.filter(m => m.status === 'open');
  const resolvedMessages = messages.filter(m => m.status === 'resolved');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Support Messages
            </h1>
            <p className="text-muted-foreground">
              Manage user support requests and inquiries
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
              <CardTitle className="text-sm font-medium">Open Messages</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{openMessages.length}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{resolvedMessages.length}</div>
              <p className="text-xs text-muted-foreground">Successfully handled</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{messages.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Open Messages */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <span>Open Messages</span>
            </CardTitle>
            <CardDescription>
              Support messages that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {openMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No open support messages
              </div>
            ) : (
              <div className="space-y-4">
                {openMessages.map((message) => (
                  <div key={message.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{message.subject}</h4>
                          <div className="text-sm text-muted-foreground">
                            From: {message.userName} ({message.userEmail})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.sentAt).toLocaleDateString()} at{' '}
                            {new Date(message.sentAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => markAsResolved(message.id)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Resolved
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolved Messages */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Resolved Messages</span>
            </CardTitle>
            <CardDescription>
              Successfully handled support messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resolvedMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No resolved messages yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.userName}</div>
                            <div className="text-sm text-muted-foreground">{message.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{message.subject}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-64 truncate text-sm">
                            {message.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(message.sentAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-success/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
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