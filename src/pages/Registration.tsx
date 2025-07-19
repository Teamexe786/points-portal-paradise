import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { StorageManager, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Phone, User as UserIcon, Shield } from 'lucide-react';
import { sendOtp, verifyOtp } from '@/utils/sendOtp';


export const Registration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [step, setStep] = useState<'form' | 'otp' | 'verified'>('form');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if user already exists
    const existingUser = StorageManager.getUserByEmail(formData.email);
    if (existingUser) {
      toast({
        title: "Account exists",
        description: "An account with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendOtp(formData.email, formData.fullName);
      setStep('otp');
      toast({
        title: "OTP Sent!",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      console.error('OTP sending error:', error);
      toast({
        title: "Failed to send OTP",
        description: `Error: ${error instanceof Error ? error.message : 'Please try again later'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    
    try {
      const result = await verifyOtp(formData.email, otp);
      
      if (result.success) {
        setStep('verified');
        toast({
          title: "OTP Verified!",
          description: "You can now complete your registration.",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: result.message || "Please enter the correct OTP from your email.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      // Create new user
      const newUser: User = {
        id: StorageManager.generateId(),
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        points: 0,
        registeredAt: new Date().toISOString()
      };

      StorageManager.saveUser(newUser);
      StorageManager.setCurrentUser(newUser);

      toast({
        title: "Registration successful!",
        description: "Welcome to RewixCash. Start earning points now!",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              {step === 'form' ? (
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Shield className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === 'form' ? 'Create Your Account' : 
               step === 'otp' ? 'Verify Your Email' : 
               'Registration Complete'}
            </CardTitle>
            <CardDescription>
              {step === 'form' ? 'Join RewixCash and start earning points today!' :
               step === 'otp' ? 'Enter the 6-digit code sent to your email' :
               'Your account has been verified successfully!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'form' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                  </p>
                  <p className="font-medium">{formData.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Enter 6-digit OTP
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button 
                  onClick={handleVerifyOtp}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center">
                  <button 
                    onClick={() => setStep('form')}
                    className="text-sm text-primary hover:underline"
                  >
                    Back to form
                  </button>
                </div>
              </div>
            )}

            {step === 'verified' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    Email Verified Successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your email has been verified. Complete your registration now.
                  </p>
                </div>

                <Button 
                  onClick={handleRegister}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? "Completing Registration..." : "Complete Registration"}
                </Button>
              </div>
            )}

            {step === 'form' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};