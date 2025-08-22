import React, { useState } from 'react';
import { useProducciones, useDeleteProduccion } from '../../hooks/useProducciones';
import { Button, Table, TableRow, TableCell, Loading } from '../../components';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProduccionForm } from './ProduccionForm'
import { formatDate } from '../../utils';
import type { Produccion } from '../../types';

export const ProduccionesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduccion, setEditingProduccion] = useState<Produccion | null>(null);

  const { data: producciones = [], isLoading, error } = useProducciones();
  const deleteProduccion = useDeleteProduccion();

  const handleEdit = (produccion: Produccion) => {
    setEditingProduccion(produccion);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta producción?')) {
      try {
        await deleteProduccion.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar producción:', error);
        alert('Error al eliminar la producción');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduccion(null);
  };

  if (isLoading) return <Loading message="Cargando producciones..." />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las producciones</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <ProduccionForm
        produccion={editingProduccion}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Producciones</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Producción
        </Button>
      </div>

      {producciones.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay producciones registradas</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primera producción
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table headers={['Producto', 'Cantidad', 'Unidad', 'Insumos Utilizados', 'Fecha', 'Acciones']}>
            {producciones.map((produccion) => (
              <TableRow key={produccion.id}>
                <TableCell>{produccion.nombre_producto}</TableCell>
                <TableCell>{produccion.cantidad_producida}</TableCell>
                <TableCell>{produccion.unidad_producto}</TableCell>
                <TableCell>
                  {produccion.insumos_utilizados && produccion.insumos_utilizados.length > 0 ? (
                    <div className="text-sm">
                      {produccion.insumos_utilizados.map((item, index) => (
                        <div key={index}>
                          {item.insumo?.nombre}: {item.cantidad_utilizada} {item.insumo?.unidad}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Sin insumos registrados</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(produccion.fecha)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(produccion)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => produccion.id && handleDelete(produccion.id)}
                      disabled={deleteProduccion.isPending}
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
