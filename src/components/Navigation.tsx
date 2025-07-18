import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StorageManager } from '@/lib/storage';
import { Home, Gift, Trophy, HelpCircle, Shield, LogOut } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();
  const currentUser = StorageManager.getCurrentUser();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    StorageManager.clearCurrentUser();
    window.location.href = '/';
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/earn', label: 'Earn', icon: Trophy },
    { path: '/redeem', label: 'Redeem', icon: Gift },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <nav className="bg-gradient-primary shadow-primary border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-foreground">
              🎁 RewardPortal
            </Link>
            
            {currentUser && !isAdmin && (
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground font-medium'
                          : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentUser && !isAdmin && (
              <div className="text-primary-foreground/90 text-sm">
                <span className="font-medium">{currentUser.points}</span> points
              </div>
            )}
            
            {!isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            {currentUser && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};