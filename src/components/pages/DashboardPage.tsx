/**
 * DashboardPage Component
 * Main dashboard page for authenticated users
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '../organisms/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../molecules/Card';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Text variant="xl" weight="bold">
                Dashboard
              </Text>
              <Text variant="sm" color="muted">
                Welcome back, {user.email}
              </Text>
            </div>
            <UserMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>
                  You have successfully signed in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="sm" color="muted">
                  Account created: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
                {user.lastLoginAt && (
                  <Text variant="sm" color="muted" className="mt-1">
                    Last login: {new Date(user.lastLoginAt).toLocaleDateString()}
                  </Text>
                )}
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Text variant="sm" weight="medium">Email:</Text>
                    <Text variant="sm" color="muted">{user.email}</Text>
                  </div>
                  <div>
                    <Text variant="sm" weight="medium">User ID:</Text>
                    <Text variant="sm" color="muted" className="font-mono text-xs">
                      {user.id}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your account and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export { DashboardPage };
