import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageManager, RedeemRequest } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Gift, AlertCircle, CheckCircle, Coins } from 'lucide-react';

export const Redeem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [points, setPoints] = useState(0);
  const [redeemType, setRedeemType] = useState<'upi' | 'gift'>('upi');
  const [upiId, setUpiId] = useState('');
  const [giftCard, setGiftCard] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = StorageManager.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }
    setPoints(user.points);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = StorageManager.getCurrentUser();
    if (!user) return;

    if (user.points < 100) {
      toast({
        title: "Insufficient Points",
        description: "You need at least 100 points to redeem.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const redeemRequest: RedeemRequest = {
        id: StorageManager.generateId(),
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        upiId: redeemType === 'upi' ? upiId : undefined,
        giftCard: redeemType === 'gift' ? giftCard : undefined,
        note: note || undefined,
        points: user.points,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      StorageManager.saveRedeemRequest(redeemRequest);

      toast({
        title: "Redeem Request Submitted! 🎉",
        description: "Your redeem request has been sent to admin for processing.",
      });

      // Reset form
      setUpiId('');
      setGiftCard('');
      setNote('');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const giftCardOptions = [
    { value: 'amazon', label: 'Amazon Gift Card' },
    { value: 'google-play', label: 'Google Play Gift Card' },
    { value: 'apple', label: 'Apple Gift Card' },
    { value: 'netflix', label: 'Netflix Gift Card' },
    { value: 'spotify', label: 'Spotify Gift Card' }
  ];

  if (points < 100) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-warning" />
              </div>
              <CardTitle className="text-2xl">Insufficient Points</CardTitle>
              <CardDescription>
                You need at least 100 points to redeem rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-3xl font-bold text-reward-gold mb-2">{points} Points</p>
                <p className="text-muted-foreground">
                  You need {100 - points} more points to redeem
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/earn')} className="bg-gradient-primary">
                  Earn More Points
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-reward rounded-full flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Redeem Your Points
          </h1>
          <p className="text-muted-foreground">
            Convert your hard-earned points into real rewards
          </p>
        </div>

        {/* Current Points */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Coins className="h-8 w-8 text-reward-gold" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Available for Redemption</p>
                <p className="text-3xl font-bold text-reward-gold">{points} Points</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        {/* Redeem Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Redeem Request Form</CardTitle>
            <CardDescription>
              Choose your preferred redemption method and submit your request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Redemption Type */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Redemption Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={redeemType === 'upi' ? 'default' : 'outline'}
                    onClick={() => setRedeemType('upi')}
                    className="h-auto p-4"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💳</div>
                      <div>UPI Payment</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={redeemType === 'gift' ? 'default' : 'outline'}
                    onClick={() => setRedeemType('gift')}
                    className="h-auto p-4"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎁</div>
                      <div>Gift Card</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* UPI ID Input */}
              {redeemType === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    type="text"
                    placeholder="Enter your UPI ID (e.g., user@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Make sure your UPI ID is correct to receive payment
                  </p>
                </div>
              )}

              {/* Gift Card Selection */}
              {redeemType === 'gift' && (
                <div className="space-y-2">
                  <Label htmlFor="giftCard">Gift Card Type</Label>
                  <Select value={giftCard} onValueChange={setGiftCard} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gift card type" />
                    </SelectTrigger>
                    <SelectContent>
                      {giftCardOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Optional Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Additional Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Any special instructions or comments..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-reward hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Request..." : "Submit Redeem Request"}
              </Button>
            </form>

            {/* Important Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Important Information:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Processing time: 1-3 business days</li>
                <li>• Minimum redemption: 100 points</li>
                <li>• You will receive confirmation once processed</li>
                <li>• For gift cards, codes will be sent to your email</li>
                <li>• For UPI payments, amount will be transferred directly</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};