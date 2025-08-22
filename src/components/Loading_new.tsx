import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => {
  return <Spinner animation="border" size={size} />;
};

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};
