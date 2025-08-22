import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Form, Button as BootstrapButton, Row, Col, Card, Modal } from 'react-bootstrap';
import { useCreateProduccion, useUpdateProduccion } from '../../hooks/useProducciones';
import { useProductos } from '../../hooks/useProductos';
import { useInsumos } from '../../hooks/useInsumos';
import { Button } from '../../components';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { InsumoForm } from '../Insumos/InsumoForm';
import type { Produccion } from '../../types';

interface ProduccionFormProps {
  produccion?: Produccion | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface InsumoUtilizado {
  insumo_id: number;
  cantidad_utilizada: number;
}

interface FormData {
  nombre_producto: string;
  cantidad_producida: number;
  unidad_producto: string;
  precio_venta?: number; // Nuevo campo para precio de venta
  fecha: string;
  producto_id?: number; // Ahora es opcional
  usar_producto_existente: boolean; // Campo para determinar si usar producto existente o crear uno nuevo
  insumos: InsumoUtilizado[];
}

export const ProduccionForm: React.FC<ProduccionFormProps> = ({
  produccion,
  onClose,
  onSuccess,
}) => {
  const createProduccion = useCreateProduccion();
  const updateProduccion = useUpdateProduccion();
  const { data: productos = [] } = useProductos();
  const { data: insumos = [], refetch: refetchInsumos } = useInsumos();
  
  // Estado para el modal de nuevo insumo
  const [showInsumoModal, setShowInsumoModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      nombre_producto: produccion?.nombre_producto || '',
      cantidad_producida: produccion?.cantidad_producida || 0,
      unidad_producto: produccion?.unidad_producto || 'unidades',
      precio_venta: produccion?.producto?.precio_venta || undefined,
      fecha: produccion?.fecha 
        ? new Date(produccion.fecha).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      producto_id: produccion?.producto_id || undefined,
      usar_producto_existente: !!produccion?.producto_id, // True si hay un producto_id
      insumos: produccion?.insumos_utilizados?.map(item => ({
        insumo_id: item.insumo_id,
        cantidad_utilizada: item.cantidad_utilizada
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'insumos'
  });

  const selectedProductoId = watch('producto_id');
  const usarProductoExistente = watch('usar_producto_existente');
  const selectedProducto = productos.find(p => p.id === Number(selectedProductoId));

  // Actualizar campos cuando se selecciona un producto
  useEffect(() => {
    if (selectedProducto && usarProductoExistente && !produccion) {
      setValue('nombre_producto', selectedProducto.nombre);
      setValue('unidad_producto', selectedProducto.unidad);
      setValue('precio_venta', selectedProducto.precio_venta || undefined);
    }
  }, [selectedProducto, setValue, produccion, usarProductoExistente]);

  // Limpiar campos cuando se cambia entre usar producto existente o crear nuevo
  useEffect(() => {
    if (!usarProductoExistente) {
      setValue('producto_id', undefined);
      if (!produccion) {
        setValue('nombre_producto', '');
        setValue('unidad_producto', 'unidades');
        setValue('precio_venta', undefined); // No setear 0
      }
    }
  }, [usarProductoExistente, setValue, produccion]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Datos del formulario completos:', data); // Debug mejorado
      console.log('Valor raw de usar_producto_existente:', data.usar_producto_existente); // Debug
      console.log('Tipo de usar_producto_existente:', typeof data.usar_producto_existente); // Debug
      
      // Convertir el valor a boolean explícitamente - LÍNEA 105 CORREGIDA
      const usarExistente = data.usar_producto_existente === true;
      console.log('Usar producto existente (convertido):', usarExistente); // Debug

      const produccionData: any = {
        nombre_producto: data.nombre_producto,
        cantidad_producida: Number(data.cantidad_producida),
        unidad_producto: data.unidad_producto,
        fecha: new Date(data.fecha).toISOString(),
        insumos: data.insumos.map(insumo => ({
          insumo_id: Number(insumo.insumo_id),
          cantidad_utilizada: Number(insumo.cantidad_utilizada)
        })),
      };

      // Solo agregar producto_id si usamos un producto existente
      if (usarExistente && data.producto_id) {
        produccionData.producto_id = Number(data.producto_id);
        console.log('Usando producto existente con ID:', produccionData.producto_id);
      }

      // Agregar precio_venta si creamos un producto nuevo
      if (!usarExistente) {
        console.log('CREANDO PRODUCTO NUEVO - Entrando al if');
        const precio = data.precio_venta;
        console.log('Precio de venta del formulario:', precio);
        console.log('Tipo de precio:', typeof precio);
        
        if (precio !== undefined && precio !== null && !isNaN(precio) && precio > 0) {
          produccionData.precio_venta = Number(precio);
        } else {
          // En lugar de poner 0, lanzar un error
          throw new Error('Debe ingresar un precio de venta válido para el nuevo producto');
        }
        console.log('Precio de venta procesado:', produccionData.precio_venta);
      } else {
        console.log('USANDO PRODUCTO EXISTENTE - No se agrega precio_venta');
      }

      console.log('Datos finales enviados al backend:', produccionData);

      if (produccion?.id) {
        await updateProduccion.mutateAsync({ id: produccion.id, data: produccionData });
      } else {
        await createProduccion.mutateAsync(produccionData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar producción:', error);
      alert('Error al guardar la producción: ' + (error as any).message);
    }
  };

  const addInsumo = () => {
    append({ insumo_id: 0, cantidad_utilizada: 0 });
  };

  // Funciones para manejar el modal de insumo
  const handleOpenInsumoModal = () => {
    setShowInsumoModal(true);
  };

  const handleCloseInsumoModal = () => {
    setShowInsumoModal(false);
  };

  const handleInsumoSuccess = () => {
    setShowInsumoModal(false);
    refetchInsumos(); // Actualizar la lista de insumos
  };

  const getAvailableInsumos = (currentIndex: number) => {
    const usedInsumoIds = watch('insumos')
      .map((item, index) => index !== currentIndex ? Number(item.insumo_id) : null)
      .filter(id => id !== null && id !== 0);
    
    return insumos.filter(insumo => !usedInsumoIds.includes(insumo.id!));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">
          {produccion ? 'Editar Producción' : 'Nueva Producción'}
        </h2>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            {/* Opción para usar producto existente o crear nuevo */}
            <Form.Group className="mb-3">
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  id="usar-existente"
                  label="Usar producto existente"
                  name="usar_producto_existente"
                  value="true"
                  checked={usarProductoExistente === true}
                  onChange={() => setValue('usar_producto_existente', true)}
                />
                <Form.Check
                  type="radio"
                  id="crear-nuevo"
                  label="Crear producto nuevo"
                  name="usar_producto_existente"
                  value="false"
                  checked={usarProductoExistente === false}
                  onChange={() => setValue('usar_producto_existente', false)}
                />
              </div>
            </Form.Group>

            {/* Selector de producto existente - solo si se selecciona usar existente */}
            {usarProductoExistente && (
              <Form.Group className="mb-3">
                <Form.Label>Producto *</Form.Label>
                <Form.Select
                  {...register('producto_id', {
                    required: usarProductoExistente ? 'Debe seleccionar un producto' : false,
                    valueAsNumber: true
                  })}
                  isInvalid={!!errors.producto_id}
                >
                  <option value={0}>Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.producto_id?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto *</Form.Label>
              <Form.Control
                type="text"
                {...register('nombre_producto', {
                  required: 'El nombre del producto es requerido'
                })}
                readOnly={usarProductoExistente && !!selectedProducto}
                className={usarProductoExistente && selectedProducto ? 'bg-light' : ''}
                isInvalid={!!errors.nombre_producto}
                placeholder={usarProductoExistente ? 'Se completará automáticamente al seleccionar producto' : 'Nombre del nuevo producto'}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre_producto?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad Producida *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                {...register('cantidad_producida', {
                  required: 'La cantidad producida es requerida',
                  min: { value: 0.01, message: 'La cantidad debe ser mayor a 0' },
                  valueAsNumber: true
                })}
                isInvalid={!!errors.cantidad_producida}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cantidad_producida?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Unidad del Producto *</Form.Label>
              <Form.Control
                type="text"
                {...register('unidad_producto', {
                  required: 'La unidad es requerida'
                })}
                readOnly={usarProductoExistente && !!selectedProducto}
                className={usarProductoExistente && selectedProducto ? 'bg-light' : ''}
                placeholder={usarProductoExistente ? 'Se completará automáticamente' : 'ej: kg, litros, unidades'}
                isInvalid={!!errors.unidad_producto}
              />
              <Form.Control.Feedback type="invalid">
                {errors.unidad_producto?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Campo de precio de venta - solo cuando se crea producto nuevo */}
            {!usarProductoExistente && (
              <Form.Group className="mb-3">
                <Form.Label>Precio de Venta *</Form.Label>
                <Controller
                  name="precio_venta"
                  control={control}
                  rules={{
                    required: !usarProductoExistente ? 'El precio de venta es requerido' : false,
                    min: { value: 0, message: 'El precio debe ser mayor o igual a 0' }
                  }}
                  render={({ field }) => (
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value === undefined || field.value === null ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseFloat(value));
                      }}
                      isInvalid={!!errors.precio_venta}
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.precio_venta?.message}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Precio por unidad para la venta del producto
                </Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora *</Form.Label>
              <Form.Control
                type="datetime-local"
                {...register('fecha', {
                  required: 'La fecha es requerida'
                })}
                isInvalid={!!errors.fecha}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fecha?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {!usarProductoExistente && (
              <div className="bg-info-subtle p-3 rounded">
                <small className="text-info-emphasis">
                  <strong>Nota:</strong> Se creará un nuevo producto con este nombre, unidad y precio. 
                  El stock inicial será la cantidad producida.
                </small>
              </div>
            )}
          </Col>
        </Row>

        {/* Sección de Insumos */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Insumos Utilizados</h5>
            <div className="d-flex gap-2">
              <BootstrapButton
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={handleOpenInsumoModal}
              >
                <Package size={16} className="me-1" />
                Nuevo Insumo
              </BootstrapButton>
              <BootstrapButton
                type="button"
                variant="success"
                size="sm"
                onClick={addInsumo}
              >
                <Plus size={16} className="me-1" />
                Agregar Insumo
              </BootstrapButton>
            </div>
          </Card.Header>
          <Card.Body>
            {fields.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted mb-3">
                  No se han agregado insumos. 
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <BootstrapButton
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={handleOpenInsumoModal}
                  >
                    <Package size={16} className="me-1" />
                    Crear Nuevo Insumo
                  </BootstrapButton>
                  <span className="text-muted">o</span>
                  <BootstrapButton
                    type="button"
                    variant="success"
                    size="sm"
                    onClick={addInsumo}
                  >
                    <Plus size={16} className="me-1" />
                    Agregar Insumo Existente
                  </BootstrapButton>
                </div>
              </div>
            )}
            
            {fields.map((field, index) => {
              const availableInsumos = getAvailableInsumos(index);
              const selectedInsumoId = watch(`insumos.${index}.insumo_id`);
              const selectedInsumo = insumos.find(i => i.id === Number(selectedInsumoId));

              return (
                <Row key={field.id} className="mb-3 align-items-end">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Insumo</Form.Label>
                      <Form.Select
                        {...register(`insumos.${index}.insumo_id`, {
                          required: 'Debe seleccionar un insumo',
                          valueAsNumber: true
                        })}
                        isInvalid={!!errors.insumos?.[index]?.insumo_id}
                      >
                        <option value={0}>Seleccionar insumo</option>
                        {availableInsumos.map(insumo => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nombre} (Stock: {insumo.cantidad} {insumo.unidad})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.insumos?.[index]?.insumo_id?.message}
                      </Form.Control.Feedback>
                      {availableInsumos.length === 0 && (
                        <Form.Text className="text-warning">
                          No hay más insumos disponibles. 
                          <BootstrapButton
                            variant="link"
                            size="sm"
                            className="p-0 ms-1"
                            onClick={handleOpenInsumoModal}
                          >
                            Crear nuevo insumo
                          </BootstrapButton>
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        Cantidad Utilizada 
                        {selectedInsumo && ` (${selectedInsumo.unidad})`}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        {...register(`insumos.${index}.cantidad_utilizada`, {
                          required: 'La cantidad es requerida',
                          min: { value: 0.01, message: 'La cantidad debe ser mayor a 0' },
                          max: selectedInsumo ? {
                            value: selectedInsumo.cantidad,
                            message: `No puede usar más de ${selectedInsumo.cantidad} ${selectedInsumo.unidad}`
                          } : undefined,
                          valueAsNumber: true
                        })}
                        isInvalid={!!errors.insumos?.[index]?.cantidad_utilizada}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.insumos?.[index]?.cantidad_utilizada?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <BootstrapButton
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => remove(index)}
                      className="mb-2"
                    >
                      <Trash2 size={16} />
                    </BootstrapButton>
                  </Col>
                </Row>
              );
            })}
          </Card.Body>
        </Card>

        <div className="d-flex gap-2">
          <BootstrapButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-grow-1"
          >
            {isSubmitting ? 'Guardando...' : produccion ? 'Actualizar' : 'Crear'}
          </BootstrapButton>
          <BootstrapButton
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-grow-1"
          >
            Cancelar
          </BootstrapButton>
        </div>
      </Form>

      {/* Modal para crear nuevo insumo */}
      <Modal show={showInsumoModal} onHide={handleCloseInsumoModal} size="lg">
        <Modal.Body className="p-0">
          <InsumoForm
            onClose={handleCloseInsumoModal}
            onSuccess={handleInsumoSuccess}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
