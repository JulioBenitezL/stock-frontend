import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insumoService } from '../services/api';
import type { Insumo } from '../types';

// Query Keys
export const insumoKeys = {
  all: ['insumos'] as const,
  detail: (id: number) => ['insumos', id] as const,
};

// Queries
export const useInsumos = () => {
  return useQuery({
    queryKey: insumoKeys.all,
    queryFn: async () => {
      const response = await insumoService.getAll();
      return response.data.data || [];
    },
  });
};

export const useInsumo = (id: number) => {
  return useQuery({
    queryKey: insumoKeys.detail(id),
    queryFn: async () => {
      const response = await insumoService.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Mutations
export const useCreateInsumo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (insumo: Omit<Insumo, 'id'>) => insumoService.create(insumo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insumoKeys.all });
    },
  });
};

export const useUpdateInsumo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Insumo> }) => 
      insumoService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: insumoKeys.all });
      queryClient.invalidateQueries({ queryKey: insumoKeys.detail(id) });
    },
  });
};

export const useDeleteInsumo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => insumoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: insumoKeys.all });
    },
  });
};
