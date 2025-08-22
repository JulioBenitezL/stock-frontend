import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import type { ButtonProps as BootstrapButtonProps } from 'react-bootstrap';

interface ButtonProps extends Omit<BootstrapButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const bootstrapSize = size === 'md' ? undefined : size;
  
  return (
    <BootstrapButton
      variant={variant}
      size={bootstrapSize}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
};
