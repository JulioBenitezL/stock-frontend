import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { produccionService } from '../services/api';
import type { Produccion } from '../types';

// Query Keys
export const produccionKeys = {
  all: ['producciones'] as const,
  detail: (id: number) => ['producciones', id] as const,
};

// Queries
export const useProducciones = () => {
  return useQuery({
    queryKey: produccionKeys.all,
    queryFn: async () => {
      const response = await produccionService.getAll();
      return response.data.data || [];
    },
  });
};

export const useProduccion = (id: number) => {
  return useQuery({
    queryKey: produccionKeys.detail(id),
    queryFn: async () => {
      const response = await produccionService.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Mutations
export const useCreateProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (produccion: Omit<Produccion, 'id'>) => produccionService.create(produccion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: produccionKeys.all });
    },
  });
};

export const useUpdateProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Produccion> }) => 
      produccionService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: produccionKeys.all });
      queryClient.invalidateQueries({ queryKey: produccionKeys.detail(id) });
    },
  });
};

export const useDeleteProduccion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => produccionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: produccionKeys.all });
    },
  });
};
