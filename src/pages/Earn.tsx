import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StorageManager } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Play, Clock, Coins } from 'lucide-react';

export const Earn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const user = StorageManager.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }
    setPoints(user.points);
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWatching && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAdCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWatching, timeLeft]);

  const startWatchingAd = () => {
    setIsWatching(true);
    setTimeLeft(30);
  };

  const handleAdCompleted = () => {
    const user = StorageManager.getCurrentUser();
    if (!user) return;

    const updatedUser = {
      ...user,
      points: user.points + 1
    };

    StorageManager.saveUser(updatedUser);
    setPoints(updatedUser.points);
    setIsWatching(false);

    toast({
      title: "Points Earned! 🎉",
      description: "You earned 1 point for watching the ad!",
    });
  };

  const progress = isWatching ? ((30 - timeLeft) / 30) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Earn Points by Watching Ads
          </h1>
          <p className="text-muted-foreground">
            Watch advertisements for 30 seconds and earn 1 point per ad
          </p>
        </div>

        {/* Current Points */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <Coins className="h-8 w-8 text-reward-gold" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-reward-gold">{points} Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-center">Watch Advertisement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Ad Placeholder */}
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center text-center">
              <div>
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Ad Placeholder
                </h3>
                <p className="text-muted-foreground">
                  Add AdSense code here later
                </p>
                {isWatching && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{timeLeft} seconds remaining</span>
                    </div>
                    <Progress value={progress} className="w-64 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="text-center">
              {!isWatching ? (
                <Button 
                  onClick={startWatchingAd}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Watching Ad
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button disabled size="lg" variant="outline">
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Please wait {timeLeft}s...
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Keep this tab open to earn your point!
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click "Start Watching Ad" to begin</li>
                <li>• Wait for the 30-second countdown to complete</li>
                <li>• Earn 1 point automatically when the ad finishes</li>
                <li>• You can watch multiple ads to earn more points</li>
                <li>• Minimum 100 points required for redemption</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/redeem')}
            disabled={points < 100}
          >
            Redeem Points ({points >= 100 ? 'Available' : 'Need 100+'})
          </Button>
        </div>
      </div>
    </div>
  );
};