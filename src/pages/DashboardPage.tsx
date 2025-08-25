import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useInsumos } from '../hooks/useInsumos';
import { useProductos } from '../hooks/useProductos';
import { useProducciones } from '../hooks/useProducciones';
import { useVentas } from '../hooks/useVentas';
import { Loading } from '../components';
import { formatCurrency, formatDate} from '../utils';
import { Package, ShoppingCart, Factory, Inbox, TrendingUp, AlertTriangle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: insumos = [], isLoading: loadingInsumos } = useInsumos();
  const { data: productos = [], isLoading: loadingProductos } = useProductos();
  const { data: producciones = [], isLoading: loadingProducciones } = useProducciones();
  const { data: ventas = [], isLoading: loadingVentas } = useVentas();

  const isLoading = loadingInsumos || loadingProductos || loadingProducciones || loadingVentas;

  if (isLoading) {
    return <Loading message="Cargando dashboard..." />;
  }

  // Estadísticas
  const stats = [
    {
      title: 'Insumos',
      value: insumos.length,
      icon: Inbox,
      link: '/insumos',
      color: 'primary',
    },
    {
      title: 'Productos',
      value: productos.length,
      icon: Package,
      link: '/productos',
      color: 'success',
    },
    {
      title: 'Producciones',
      value: producciones.length,
      icon: Factory,
      link: '/producciones',
      color: 'warning',
    },
    {
      title: 'Ventas',
      value: ventas.length,
      icon: ShoppingCart,
      link: '/ventas',
      color: 'info',
    },
  ];

  // Insumos con bajo stock
  const insumosLowStock = insumos.filter(insumo => insumo.cantidad < 10);
  
  // Productos con bajo stock
  const productosLowStock = productos.filter(producto => producto.cantidad < 5);

  // Ventas recientes
  const ventasRecientes = ventas
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  // Total de ventas del mes actual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const ventasDelMes = ventas.filter(venta => {
    const ventaDate = new Date(venta.fecha);
    return ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear;
  });
  
  const totalVentasDelMes = ventasDelMes.reduce((total, venta) => 
    total + (venta.cantidad * venta.precio_unitario), 0
  );

  // Total de ventas del día actual
  const today = new Date().toDateString(); // Obtiene solo la fecha como string (sin hora)
  
  const ventasDelDia = ventas.filter(venta => {
    const ventaDate = new Date(venta.fecha).toDateString(); // Convierte fecha de venta a string (sin hora)
    return ventaDate === today; // Compara solo las fechas
  });
  
  const totalVentasDelDia = ventasDelDia.reduce((total, venta) => 
    total + (venta.cantidad * venta.precio_unitario), 0
  );

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 mb-1">Dashboard</h1>
          <p className="text-muted">Sistema de Gestión de Stock</p>
        </Col>
      </Row>

      {/* Estadísticas principales */}
      <Row className="mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Col key={stat.title} md={6} lg={3} className="mb-3">
              <Link to={stat.link} style={{ textDecoration: 'none' }}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div className={`p-3 rounded bg-${stat.color} text-white me-3`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <Card.Subtitle className="mb-1 text-muted">{stat.title}</Card.Subtitle>
                        <Card.Title className="mb-0">{stat.value}</Card.Title>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>

      {/* Resumen de ventas del día y mes */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <TrendingUp size={20} className="text-info me-2" />
                <Card.Title className="mb-0">Ventas de Hoy</Card.Title>
              </div>
              <Row>
                <Col md={6}>
                  <div>
                    <p className="text-muted mb-1">Total de Ventas</p>
                    <h3 className="text-info mb-0">{ventasDelDia.length}</h3>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <p className="text-muted mb-1">Monto Total</p>
                    <h3 className="text-info mb-0">{formatCurrency(totalVentasDelDia)}</h3>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <TrendingUp size={20} className="text-success me-2" />
                <Card.Title className="mb-0">Ventas del Mes</Card.Title>
              </div>
              <Row>
                <Col md={6}>
                  <div>
                    <p className="text-muted mb-1">Total de Ventas</p>
                    <h3 className="text-success mb-0">{ventasDelMes.length}</h3>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <p className="text-muted mb-1">Monto Total</p>
                    <h3 className="text-success mb-0">{formatCurrency(totalVentasDelMes)}</h3>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Alertas de stock bajo */}
        {(insumosLowStock.length > 0 || productosLowStock.length > 0) && (
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <AlertTriangle size={20} className="text-danger me-2" />
                  <Card.Title className="mb-0">Alertas de Stock</Card.Title>
                </div>
                
                {insumosLowStock.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-muted">Insumos con Stock Bajo:</h6>
                    <ListGroup variant="flush">
                      {insumosLowStock.slice(0, 5).map((insumo) => (
                        <ListGroup.Item key={insumo.id} className="px-0 py-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{insumo.nombre}</span>
                            <Badge bg="danger">{insumo.cantidad} {insumo.unidad}</Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}

                {productosLowStock.length > 0 && (
                  <div>
                    <h6 className="text-muted">Productos con Stock Bajo:</h6>
                    <ListGroup variant="flush">
                      {productosLowStock.slice(0, 5).map((producto) => (
                        <ListGroup.Item key={producto.id} className="px-0 py-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{producto.nombre}</span>
                            <Badge bg="danger">{producto.cantidad} {producto.unidad}</Badge>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Ventas recientes */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Ventas Recientes</Card.Title>
              {ventasRecientes.length > 0 ? (
                <ListGroup variant="flush">
                  {ventasRecientes.map((venta) => {
                    // Buscar el producto correspondiente
                    const producto = productos.find(p => p.id === venta.producto_id);
                    return (
                      <ListGroup.Item key={venta.id} className="px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-medium">
                              {producto ? producto.nombre : `Producto ID: ${venta.producto_id}`}
                            </div>
                            <small className="text-muted">
                              {formatDate(venta.fecha)}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="fw-medium">{venta.cantidad} unidades</div>
                            <small className="text-success">
                              {formatCurrency(venta.cantidad * venta.precio_unitario)}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <p className="text-muted mb-0">No hay ventas recientes</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
