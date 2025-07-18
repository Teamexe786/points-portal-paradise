import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StorageManager, User } from '@/lib/storage';
import { Users, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    pendingRedeems: 0,
    openMessages: 0
  });

  useEffect(() => {
    // Check admin auth
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = () => {
    const allUsers = StorageManager.getUsers();
    const redeemRequests = StorageManager.getRedeemRequests();
    const supportMessages = StorageManager.getSupportMessages();

    setUsers(allUsers);
    setStats({
      totalUsers: allUsers.length,
      totalPoints: allUsers.reduce((sum, user) => sum + user.points, 0),
      pendingRedeems: redeemRequests.filter(r => r.status === 'pending').length,
      openMessages: supportMessages.filter(m => m.status === 'open').length
    });
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      color: "text-primary"
    },
    {
      title: "Total Points Earned",
      value: stats.totalPoints.toLocaleString(),
      icon: TrendingUp,
      description: "Across all users",
      color: "text-reward-gold"
    },
    {
      title: "Pending Redeems",
      value: stats.pendingRedeems,
      icon: DollarSign,
      description: "Awaiting processing",
      color: "text-warning"
    },
    {
      title: "Open Messages",
      value: stats.openMessages,
      icon: MessageSquare,
      description: "Support tickets",
      color: "text-destructive"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, redemptions, and support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            onClick={() => navigate('/admin/withdrawals')}
            className="h-20 bg-gradient-primary hover:opacity-90"
          >
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <div>Manage Withdrawals</div>
              {stats.pendingRedeems > 0 && (
                <div className="text-xs bg-primary-foreground/20 rounded-full px-2 py-1 mt-1">
                  {stats.pendingRedeems} pending
                </div>
              )}
            </div>
          </Button>

          <Button
            onClick={() => navigate('/admin/support')}
            variant="outline"
            className="h-20"
          >
            <div className="text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <div>Support Messages</div>
              {stats.openMessages > 0 && (
                <div className="text-xs bg-muted rounded-full px-2 py-1 mt-1">
                  {stats.openMessages} open
                </div>
              )}
            </div>
          </Button>

          <Button
            onClick={loadData}
            variant="outline"
            className="h-20"
          >
            <div className="text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div>Refresh Data</div>
            </div>
          </Button>
        </div>

        {/* Users Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>
              All users registered in the reward portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users registered yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          <span className="font-semibold text-reward-gold">
                            {user.points}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.registeredAt).toLocaleDateString()}
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