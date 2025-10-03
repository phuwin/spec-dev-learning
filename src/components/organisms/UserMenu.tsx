/**
 * UserMenu Organism Component
 * User menu with logout functionality
 */

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Card, CardContent } from '../molecules/Card';
import { authService } from '../../services/authService';
import type { User } from '../../types/user';

export interface UserMenuProps {
  user: User;
  onLogout?: () => void;
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      onLogout?.();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={className}>
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <Text variant="sm" className="hidden sm:block">
            {user.email}
          </Text>
        </Button>

        {isOpen && (
          <Card className="absolute right-0 mt-2 w-48 z-50">
            <CardContent className="p-2">
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  <Text variant="sm" weight="medium">
                    {user.email}
                  </Text>
                  <Text variant="small" color="muted">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </div>
                <div className="border-t pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start"
                  >
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export { UserMenu };
