import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock } from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication
    if (adminCode.toLowerCase() === 'admin') {
      localStorage.setItem('admin_logged_in', 'true');
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin panel!",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin code. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>
              Enter admin credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="text-sm font-medium">
                  Admin Code
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminCode"
                    name="adminCode"
                    type="text"
                    placeholder="Enter admin code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Hint: For demo purposes, use "admin"
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to User Portal
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};