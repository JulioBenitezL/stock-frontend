import React from 'react';
import { Form } from 'react-bootstrap';

interface InputProps {
  label?: string;
  error?: string;
  size?: 'sm' | 'lg';
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  step?: string;
  min?: string | number;
  max?: string | number;
  name?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  ...props
}, ref) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        ref={ref}
        isInvalid={!!error}
        {...props}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
});
