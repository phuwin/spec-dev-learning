/**
 * LoginPage Component
 * Complete login page with form and navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../organisms/LoginForm';
import { AuthLayout } from '../organisms/AuthLayout';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { ROUTES } from '../../utils/constants';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user);
    navigate(ROUTES.DASHBOARD);
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
  };

  const handleGoToRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please sign in to your account"
    >
      <LoginForm
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      
      <div className="text-center">
        <Text variant="sm" color="muted">
          Don't have an account?{' '}
          <Button
            variant="link"
            onClick={handleGoToRegister}
            className="p-0 h-auto font-normal"
          >
            Sign up here
          </Button>
        </Text>
      </div>
    </AuthLayout>
  );
};

export { LoginPage };
