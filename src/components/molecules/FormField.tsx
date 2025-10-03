/**
 * FormField Molecule Component
 * Combines Label, Input, and ErrorMessage for form fields
 */

import React from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { cn } from '../../utils/cn';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    error, 
    required = false,
    disabled = false,
    className,
    ...props 
  }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        <Label htmlFor={name} className={required ? 'after:content-["*"] after:ml-0.5 after:text-destructive' : ''}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          required={required}
          disabled={disabled}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        <ErrorMessage
          id={`${name}-error`}
          message={error}
          show={!!error}
        />
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };