import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateVenta, useUpdateVenta } from '../../hooks/useVentas';
import { useProductos } from '../../hooks/useProductos';
import { Button, Input, Select } from '../../components';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils';
import type { Venta } from '../../types';

interface VentaFormProps {
  venta?: Venta | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  fecha: string;
}

export const VentaForm: React.FC<VentaFormProps> = ({
  venta,
  onClose,
  onSuccess,
}) => {
  const createVenta = useCreateVenta();
  const updateVenta = useUpdateVenta();
  const { data: productos = [] } = useProductos();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      producto_id: venta?.producto_id || 0,
      cantidad: venta?.cantidad || 0,
      precio_unitario: venta?.precio_unitario || 0,
      fecha: venta?.fecha 
        ? new Date(venta.fecha).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    },
  });

  const selectedProductoId = watch('producto_id');
  const cantidad = watch('cantidad');
  const precioUnitario = watch('precio_unitario');
  
  const selectedProducto = productos.find(p => p.id === Number(selectedProductoId));
  const total = cantidad && precioUnitario ? (cantidad * precioUnitario) : 0;

  const onSubmit = async (data: FormData) => {
    try {
      const ventaData = {
        ...data,
        cantidad: Number(data.cantidad),
        precio_unitario: Number(data.precio_unitario),
        producto_id: Number(data.producto_id),
        fecha: new Date(data.fecha).toISOString(),
      };

      if (venta?.id) {
        await updateVenta.mutateAsync({ id: venta.id, data: ventaData });
      } else {
        await createVenta.mutateAsync(ventaData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert('Error al guardar la venta');
    }
  };

  const productoOptions = productos.map(producto => ({
    value: producto.id!,
    label: `${producto.nombre} (Stock: ${producto.cantidad} ${producto.unidad})`,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {venta ? 'Editar Venta' : 'Nueva Venta'}
        </h2>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <div className="mb-4">
          <Controller
            name="producto_id"
            control={control}
            rules={{ required: 'Debe seleccionar un producto' }}
            render={({ field }) => (
              <Select
                label="Producto *"
                options={productoOptions}
                placeholder="Seleccionar producto"
                {...field}
                value={field.value || ''}
                error={errors.producto_id?.message}
              />
            )}
          />
        </div>

        {selectedProducto && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Producto seleccionado:</strong> {selectedProducto.nombre}<br />
              <strong>Stock disponible:</strong> {selectedProducto.cantidad} {selectedProducto.unidad}<br />
              <strong>Precio sugerido:</strong> {selectedProducto.precio_venta ? formatCurrency(selectedProducto.precio_venta) : 'No definido'}
            </p>
          </div>
        )}

        <Input
          label="Cantidad *"
          type="number"
          step="0.01"
          {...register('cantidad', {
            required: 'La cantidad es requerida',
            min: { value: 0.01, message: 'La cantidad debe ser mayor a 0' },
            max: selectedProducto ? { 
              value: selectedProducto.cantidad, 
              message: `No puede vender más de ${selectedProducto.cantidad} unidades disponibles` 
            } : undefined,
            valueAsNumber: true
          })}
          error={errors.cantidad?.message}
        />

        <Input
          label="Precio Unitario *"
          type="number"
          step="0.01"
          {...register('precio_unitario', {
            required: 'El precio unitario es requerido',
            min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
            valueAsNumber: true
          })}
          error={errors.precio_unitario?.message}
        />

        {cantidad && precioUnitario && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-lg font-semibold text-green-800">
              Total: {formatCurrency(total)}
            </p>
          </div>
        )}

        <Input
          label="Fecha y Hora *"
          type="datetime-local"
          {...register('fecha', { required: 'La fecha es requerida' })}
          error={errors.fecha?.message}
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Guardando...' : venta ? 'Actualizar' : 'Crear'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
