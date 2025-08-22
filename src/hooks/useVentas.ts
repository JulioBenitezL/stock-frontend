import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventaService } from '../services/api';
import type { Venta } from '../types';

// Query Keys
export const ventaKeys = {
  all: ['ventas'] as const,
  detail: (id: number) => ['ventas', id] as const,
};

// Queries
export const useVentas = () => {
  return useQuery({
    queryKey: ventaKeys.all,
    queryFn: async () => {
      const response = await ventaService.getAll();
      return response.data.data || [];
    },
  });
};

export const useVenta = (id: number) => {
  return useQuery({
    queryKey: ventaKeys.detail(id),
    queryFn: async () => {
      const response = await ventaService.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Mutations
export const useCreateVenta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (venta: Omit<Venta, 'id'>) => ventaService.create(venta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ventaKeys.all });
    },
  });
};

export const useUpdateVenta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Venta> }) => 
      ventaService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ventaKeys.all });
      queryClient.invalidateQueries({ queryKey: ventaKeys.detail(id) });
    },
  });
};

export const useDeleteVenta = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => ventaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ventaKeys.all });
    },
  });
};
