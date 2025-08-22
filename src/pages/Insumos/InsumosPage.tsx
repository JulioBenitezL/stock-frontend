import React, { useState } from 'react';
import { Row, Col, Card, Alert, ButtonGroup } from 'react-bootstrap';
import { useInsumos, useDeleteInsumo } from '../../hooks/useInsumos';
import { Button, Table, TableRow, TableCell, Loading } from '../../components';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { InsumoForm } from './InsumoForm';
import { formatCurrency } from '../../utils';
import type { Insumo } from '../../types';

export const InsumosPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null);

  const { data: insumos = [], isLoading, error } = useInsumos();
  const deleteInsumo = useDeleteInsumo();

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este insumo?')) {
      try {
        await deleteInsumo.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar insumo:', error);
        alert('Error al eliminar el insumo');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInsumo(null);
  };

  if (isLoading) return <Loading message="Cargando insumos..." />;

  if (error) {
    return (
      <Row className="justify-content-center">
        <Col md={6}>
          <Alert variant="danger" className="text-center">
            <p>Error al cargar los insumos</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Alert>
        </Col>
      </Row>
    );
  }

  if (showForm) {
    return (
      <InsumoForm
        insumo={editingInsumo}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-6 mb-0">Insumos</h1>
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} className="me-1" />
              Nuevo Insumo
            </Button>
          </div>
        </Col>
      </Row>

      {insumos.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center py-5">
                <p className="text-muted mb-3">No hay insumos registrados</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={16} className="me-1" />
                  Agregar primer insumo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table headers={['Nombre', 'Cantidad', 'Unidad', 'Precio Unitario', 'Acciones']}>
              {insumos.map((insumo) => (
                <TableRow key={insumo.id}>
                  <TableCell>{insumo.nombre}</TableCell>
                  <TableCell>{insumo.cantidad}</TableCell>
                  <TableCell>{insumo.unidad}</TableCell>
                  <TableCell>
                    {insumo.precio_unitario 
                      ? formatCurrency(insumo.precio_unitario) 
                      : 'No definido'
                    }
                  </TableCell>
                  <TableCell>
                    <ButtonGroup size="sm">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(insumo)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => insumo.id && handleDelete(insumo.id)}
                        disabled={deleteInsumo.isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};
