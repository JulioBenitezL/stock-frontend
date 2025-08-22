import React, { useState } from 'react';
import { useProductos, useDeleteProducto } from '../../hooks/useProductos';
import { Button, Table, TableRow, TableCell, Loading } from '../../components';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ProductoForm } from './ProductoForm';
import { formatCurrency } from '../../utils';
import type { Producto } from '../../types';

export const ProductosPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const { data: productos = [], isLoading, error } = useProductos();
  const deleteProducto = useDeleteProducto();

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      try {
        await deleteProducto.mutateAsync(id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProducto(null);
  };

  if (isLoading) return <Loading message="Cargando productos..." />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar los productos</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  if (showForm) {
    return (
      <ProductoForm
        producto={editingProducto}
        onClose={handleCloseForm}
        onSuccess={handleCloseForm}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No hay productos registrados</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer producto
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table headers={['Nombre', 'Cantidad', 'Unidad', 'Precio Venta', 'Insumos', 'Acciones']}>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.cantidad}</TableCell>
                <TableCell>{producto.unidad}</TableCell>
                <TableCell>
                  {producto.precio_venta 
                    ? formatCurrency(producto.precio_venta) 
                    : 'No definido'
                  }
                </TableCell>
                <TableCell>
                  {producto.insumos_ids.length > 0
                    ? `${producto.insumos_ids.length} insumo(s)`
                    : 'Sin insumos'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(producto)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => producto.id && handleDelete(producto.id)}
                      disabled={deleteProducto.isPending}
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
