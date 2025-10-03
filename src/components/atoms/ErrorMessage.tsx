/**
 * ErrorMessage Atom Component
 * Reusable error message component for form validation
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  show?: boolean;
}

const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ className, message, show = true, ...props }, ref) => {
    if (!show || !message) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'text-sm text-destructive font-medium',
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {message}
      </div>
    );
  }
);
ErrorMessage.displayName = 'ErrorMessage';

export { ErrorMessage };
