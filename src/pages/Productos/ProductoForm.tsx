import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateProducto, useUpdateProducto } from '../../hooks/useProductos';
import { useInsumos } from '../../hooks/useInsumos';
import { Button, Input, Select } from '../../components';
import { X, Trash2 } from 'lucide-react';
import type { Producto } from '../../types';

interface ProductoFormProps {
  producto?: Producto | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_venta?: number;
  insumos_ids: number[];
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  producto,
  onClose,
  onSuccess,
}) => {
  const [selectedInsumos, setSelectedInsumos] = useState<number[]>(
    producto?.insumos_ids || []
  );
  
  const createProducto = useCreateProducto();
  const updateProducto = useUpdateProducto();
  const { data: insumos = [] } = useInsumos();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nombre: producto?.nombre || '',
      cantidad: producto?.cantidad || 0,
      unidad: producto?.unidad || '',
      precio_venta: producto?.precio_venta || undefined,
      insumos_ids: producto?.insumos_ids || [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const productData = {
        ...data,
        cantidad: Number(data.cantidad),
        precio_venta: data.precio_venta ? Number(data.precio_venta) : undefined,
        insumos_ids: selectedInsumos,
      };

      if (producto?.id) {
        await updateProducto.mutateAsync({ id: producto.id, data: productData });
      } else {
        await createProducto.mutateAsync(productData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const addInsumo = (insumoId: number) => {
    if (insumoId && !selectedInsumos.includes(insumoId)) {
      setSelectedInsumos([...selectedInsumos, insumoId]);
    }
  };

  const removeInsumo = (insumoId: number) => {
    setSelectedInsumos(selectedInsumos.filter(id => id !== insumoId));
  };

  const insumoOptions = insumos.map(insumo => ({
    value: insumo.id!,
    label: insumo.nombre,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
        <Input
          label="Nombre *"
          {...register('nombre', { required: 'El nombre es requerido' })}
          error={errors.nombre?.message}
        />

        <Input
          label="Cantidad *"
          type="number"
          step="0.01"
          {...register('cantidad', {
            required: 'La cantidad es requerida',
            min: { value: 0, message: 'La cantidad debe ser mayor o igual a 0' },
            valueAsNumber: true,
          })}
          error={errors.cantidad?.message}
        />

        <Input
          label="Unidad *"
          {...register('unidad', { required: 'La unidad es requerida' })}
          error={errors.unidad?.message}
          placeholder="ej: kg, litros, unidades"
        />

        <Input
          label="Precio de Venta"
          type="number"
          step="0.01"
          {...register('precio_venta', {
            min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
            valueAsNumber: true,
          })}
          error={errors.precio_venta?.message}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Insumos
          </label>
          
          <div className="flex gap-2 mb-2">
            <Controller
              name="insumos_ids"
              control={control}
              render={() => (
                <Select
                  options={insumoOptions.filter(opt => !selectedInsumos.includes(opt.value))}
                  placeholder="Seleccionar insumo"
                  value=""
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value) {
                      addInsumo(value);
                      e.target.value = '';
                    }
                  }}
                  className="flex-1"
                />
              )}
            />
          </div>

          {selectedInsumos.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Insumos seleccionados:</h4>
              {selectedInsumos.map((insumoId) => {
                const insumo = insumos.find(i => i.id === insumoId);
                return (
                  <div key={insumoId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{insumo?.nombre || `ID: ${insumoId}`}</span>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeInsumo(insumoId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
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
