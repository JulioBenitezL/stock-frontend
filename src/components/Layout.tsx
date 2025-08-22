import React from 'react';
import { Container } from 'react-bootstrap';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container className="py-4">
        {children}
      </Container>
    </div>
  );
};
