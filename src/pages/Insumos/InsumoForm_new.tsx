import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useCreateInsumo, useUpdateInsumo } from '../../hooks/useInsumos';
import { Button, Input } from '../../components';
import { X } from 'lucide-react';
import type { Insumo } from '../../types';

interface InsumoFormProps {
  insumo?: Insumo | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_unitario?: number;
}

export const InsumoForm: React.FC<InsumoFormProps> = ({
  insumo,
  onClose,
  onSuccess,
}) => {
  const createInsumo = useCreateInsumo();
  const updateInsumo = useUpdateInsumo();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nombre: insumo?.nombre || '',
      cantidad: insumo?.cantidad || 0,
      unidad: insumo?.unidad || '',
      precio_unitario: insumo?.precio_unitario || undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (insumo?.id) {
        await updateInsumo.mutateAsync({ id: insumo.id, data });
      } else {
        await createInsumo.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar insumo:', error);
      alert('Error al guardar el insumo');
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">
                {insumo ? 'Editar Insumo' : 'Nuevo Insumo'}
              </Card.Title>
              <Button variant="secondary" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Nombre *"
                {...register('nombre', { required: 'El nombre es requerido' })}
                error={errors.nombre?.message}
              />

              <Input
                label="Cantidad *"
                type="number"
                step="any"
                {...register('cantidad', {
                  required: 'La cantidad es requerida',
                  min: { value: 0, message: 'La cantidad debe ser mayor o igual a 0' },
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
                label="Precio Unitario"
                type="number"
                step="any"
                {...register('precio_unitario', {
                  min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
                })}
                error={errors.precio_unitario?.message}
              />

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : insumo ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
