import React, { useState } from 'react';
import { useVentas, useDeleteVenta } from '../../hooks/useVentas';
import { Button, Table, TableRow, TableCell, Loading } from '../../components';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { VentaForm } from './VentaForm';
import { formatCurrency, formatDate } from '../../utils';
import type { Venta } from '../../types';

export const VentasPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);

  const { data: ventas = [], isLoading, error } = useVentas();
  const deleteVenta = useDeleteVenta();

  const handleEdit = (venta: Venta) => {
    setEditingVenta(venta);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta venta?')) {
      try {
        await deleteVenta.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar venta:', error);
        alert('Error al eliminar la venta');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVenta(null);
  };

  if (isLoading) return <Loading message="Cargando ventas..." />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las ventas</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <VentaForm
        venta={editingVenta}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Venta
        </Button>
      </div>

      {ventas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay ventas registradas</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primera venta
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table headers={['Producto ID', 'Cantidad', 'Precio Unitario', 'Total', 'Fecha', 'Acciones']}>
            {ventas.map((venta) => (
              <TableRow key={venta.id}>
                <TableCell>{venta.producto_id}</TableCell>
                <TableCell>{venta.cantidad}</TableCell>
                <TableCell>{formatCurrency(venta.precio_unitario)}</TableCell>
                <TableCell>{formatCurrency(venta.cantidad * venta.precio_unitario)}</TableCell>
                <TableCell>{formatDate(venta.fecha)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(venta)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => venta.id && handleDelete(venta.id)}
                      disabled={deleteVenta.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
};
