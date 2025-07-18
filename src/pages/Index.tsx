import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageManager } from '@/lib/storage';
import { Trophy, Gift, Users, Star, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = StorageManager.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: Trophy,
      title: "Earn Points",
      description: "Watch ads and complete tasks to earn valuable points",
      color: "text-primary"
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "Convert your points to UPI payments or gift cards",
      color: "text-reward-gold"
    },
    {
      icon: Users,
      title: "User Friendly",
      description: "Simple and intuitive interface for all users",
      color: "text-secondary"
    },
    {
      icon: CheckCircle,
      title: "Instant Processing",
      description: "Quick redemption processing with admin panel",
      color: "text-success"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-6">🎁</div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Welcome to RewixCash
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              The ultimate platform to earn points by watching ads and redeem them for real rewards. 
              Join thousands of users already earning with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              >
                Get Started - It's Free!
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Already have an account?
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose RewixCash?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform offers the best way to earn rewards through simple tasks and advertisements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-primary transition-shadow text-center">
                <CardHeader>
                  <div className={`mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Start earning in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">
                Create your free account with just your basic information
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Watch Ads</h3>
              <p className="text-muted-foreground">
                Watch 30-second advertisements to earn 1 point each
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-reward rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-muted-foreground">
                Convert 100+ points to UPI payments or gift cards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="shadow-reward bg-gradient-card text-center">
          <CardContent className="p-12">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join our community and start earning points today. It's completely free!
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-gradient-primary hover:opacity-90 font-semibold"
            >
              Start Earning Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
