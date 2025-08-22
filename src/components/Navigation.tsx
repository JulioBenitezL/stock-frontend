import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Package, ShoppingCart, Factory, Inbox, BarChart3 } from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Insumos',
    href: '/insumos',
    icon: Inbox,
  },
  {
    name: 'Productos',
    href: '/productos',
    icon: Package,
  },
  {
    name: 'Producciones',
    href: '/producciones',
    icon: Factory,
  },
  {
    name: 'Ventas',
    href: '/ventas',
    icon: ShoppingCart,
  },
];

export const Navigation: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand>
          <strong>Sistema de Stock</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <LinkContainer key={item.name} to={item.href}>
                  <Nav.Link>
                    <Icon size={16} className="me-1" style={{ display: 'inline' }} />
                    {item.name}
                  </Nav.Link>
                </LinkContainer>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
