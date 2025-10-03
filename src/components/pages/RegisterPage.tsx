/**
 * RegisterPage Component
 * Complete registration page with form and navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../organisms/RegisterForm';
import { AuthLayout } from '../organisms/AuthLayout';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { ROUTES } from '../../utils/constants';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (user: any) => {
    console.log('Registration successful:', user);
    navigate(ROUTES.DASHBOARD);
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Get started by creating a new account"
    >
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onError={handleRegisterError}
      />
      
      <div className="text-center">
        <Text variant="sm" color="muted">
          Already have an account?{' '}
          <Button
            variant="link"
            onClick={handleGoToLogin}
            className="p-0 h-auto font-normal"
          >
            Sign in here
          </Button>
        </Text>
      </div>
    </AuthLayout>
  );
};

export { RegisterPage };
