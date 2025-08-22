export interface Insumo {
  id?: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_unitario?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_venta?: number;
  insumos_ids: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProduccionInsumo {
  id?: number;
  insumo_id: number;
  cantidad_utilizada: number;
  insumo?: Insumo;
}

export interface Produccion {
  id?: number;
  nombre_producto: string;
  cantidad_producida: number;
  unidad_producto: string;
  fecha: string;
  producto_id?: number; // Ahora es opcional
  producto?: Producto;
  insumos_utilizados?: ProduccionInsumo[];
  insumos?: { insumo_id: number; cantidad_utilizada: number; }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Venta {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  fecha: string;
  Producto?: Producto;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
