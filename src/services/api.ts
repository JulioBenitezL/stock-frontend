import axios from 'axios';
import type { Insumo, Producto, Produccion, Venta, ApiResponse } from '../types';

// Usar variable de entorno para la URL de la API, con fallback para desarrollo local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🔗 Configurando API con URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// INSUMOS
export const insumoService = {
  getAll: () => api.get<ApiResponse<Insumo[]>>('/insumos'),
  getById: (id: number) => api.get<ApiResponse<Insumo>>(`/insumos/${id}`),
  create: (insumo: Omit<Insumo, 'id'>) => api.post<ApiResponse<Insumo>>('/insumos', insumo),
  update: (id: number, insumo: Partial<Insumo>) => api.put<ApiResponse<Insumo>>(`/insumos/${id}`, insumo),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/insumos/${id}`),
};

// PRODUCTOS
export const productoService = {
  getAll: () => api.get<ApiResponse<Producto[]>>('/productos'),
  getById: (id: number) => api.get<ApiResponse<Producto>>(`/productos/${id}`),
  create: (producto: Omit<Producto, 'id'>) => api.post<ApiResponse<Producto>>('/productos', producto),
  update: (id: number, producto: Partial<Producto>) => api.put<ApiResponse<Producto>>(`/productos/${id}`, producto),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/productos/${id}`),
};

// PRODUCCIONES
export const produccionService = {
  getAll: () => api.get<ApiResponse<Produccion[]>>('/producciones'),
  getById: (id: number) => api.get<ApiResponse<Produccion>>(`/producciones/${id}`),
  create: (produccion: Omit<Produccion, 'id'>) => api.post<ApiResponse<Produccion>>('/producciones', produccion),
  update: (id: number, produccion: Partial<Produccion>) => api.put<ApiResponse<Produccion>>(`/producciones/${id}`, produccion),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/producciones/${id}`),
};

// VENTAS
export const ventaService = {
  getAll: () => api.get<ApiResponse<Venta[]>>('/ventas'),
  getById: (id: number) => api.get<ApiResponse<Venta>>(`/ventas/${id}`),
  create: (venta: Omit<Venta, 'id'>) => api.post<ApiResponse<Venta>>('/ventas', venta),
  update: (id: number, venta: Partial<Venta>) => api.put<ApiResponse<Venta>>(`/ventas/${id}`, venta),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/ventas/${id}`),
};

export { api };
