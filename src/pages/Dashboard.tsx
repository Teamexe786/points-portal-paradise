import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageManager, User } from '@/lib/storage';
import { Trophy, Gift, HelpCircle, User as UserIcon, Mail, Phone, Coins } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = StorageManager.getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const dashboardCards = [
    {
      title: "Start Earning",
      description: "Watch ads and earn points",
      icon: Trophy,
      action: () => navigate('/earn'),
      buttonText: "Earn Points",
      gradient: "bg-gradient-primary"
    },
    {
      title: "Redeem Points",
      description: "Convert your points to rewards",
      icon: Gift,
      action: () => navigate('/redeem'),
      buttonText: "Redeem Now",
      gradient: "bg-gradient-reward"
    },
    {
      title: "Contact Support",
      description: "Get help with your account",
      icon: HelpCircle,
      action: () => navigate('/support'),
      buttonText: "Get Help",
      gradient: "bg-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.fullName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to earn more points and unlock amazing rewards?
          </p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phoneNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Coins className="h-8 w-8 text-reward-gold" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-reward-gold">{user.points}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-primary transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 ${card.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={card.action}
                    className="w-full"
                    variant={index === 1 ? "default" : "outline"}
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Your Journey</CardTitle>
            <CardDescription>
              Track your progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{user.points}</div>
                <p className="text-muted-foreground">Total Points Earned</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {Math.floor(user.points / 100)}
                </div>
                <p className="text-muted-foreground">Rewards Eligible</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-reward-gold mb-2">
                  {new Date(user.registeredAt).toLocaleDateString()}
                </div>
                <p className="text-muted-foreground">Member Since</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};