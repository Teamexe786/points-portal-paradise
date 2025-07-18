import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageManager, SupportMessage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { HelpCircle, Send, MessageSquare, Clock, Mail } from 'lucide-react';

export const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = StorageManager.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = StorageManager.getCurrentUser();
    if (!user) return;

    try {
      const supportMessage: SupportMessage = {
        id: StorageManager.generateId(),
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        subject,
        message,
        status: 'open',
        sentAt: new Date().toISOString()
      };

      StorageManager.saveSupportMessage(supportMessage);

      toast({
        title: "Message Sent! 📧",
        description: "Your support request has been sent to our admin team.",
      });

      // Reset form
      setSubject('');
      setMessage('');
      
      // Navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonTopics = [
    {
      title: "Account Issues",
      description: "Problems with login, registration, or account access",
      icon: "👤"
    },
    {
      title: "Points & Rewards",
      description: "Questions about earning points or redeeming rewards",
      icon: "🎁"
    },
    {
      title: "Technical Support",
      description: "App bugs, loading issues, or technical difficulties",
      icon: "🔧"
    },
    {
      title: "Payment Issues",
      description: "Problems with UPI payments or gift card delivery",
      icon: "💳"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Contact Support
          </h1>
          <p className="text-muted-foreground">
            Need help? We're here to assist you with any questions or issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below and our support team will get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue or question in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending Message..." : "Send to Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Common Topics */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Common Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commonTopics.map((topic, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{topic.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{topic.title}</h4>
                      <p className="text-xs text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Mail className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Email Support</h4>
                  <p className="text-sm text-muted-foreground">support@rewardportal.com</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">Response Time</h4>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Support Hours</h4>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM EST
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/earn')}
                >
                  Earn More Points
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/redeem')}
                >
                  Redeem Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};