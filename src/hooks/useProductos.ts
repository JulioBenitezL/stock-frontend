import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/api';
import type { Producto } from '../types';

// Query Keys
export const productoKeys = {
  all: ['productos'] as const,
  detail: (id: number) => ['productos', id] as const,
};

// Queries
export const useProductos = () => {
  return useQuery({
    queryKey: productoKeys.all,
    queryFn: async () => {
      const response = await productoService.getAll();
      return response.data.data || [];
    },
  });
};

export const useProducto = (id: number) => {
  return useQuery({
    queryKey: productoKeys.detail(id),
    queryFn: async () => {
      const response = await productoService.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Mutations
export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (producto: Omit<Producto, 'id'>) => productoService.create(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Producto> }) => 
      productoService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
      queryClient.invalidateQueries({ queryKey: productoKeys.detail(id) });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
    },
  });
};
