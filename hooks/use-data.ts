import useSWR from 'swr';
import { Payment, Supplier } from '@/lib/types';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error: any = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
};

export function usePayments(filters?: { supplierId?: string; status?: string; limit?: number }) {
    // Construct query string
    const params = new URLSearchParams();
    if (filters?.supplierId) params.append('supplierId', filters.supplierId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const { data, error, isLoading, mutate } = useSWR<{ data: Payment[] }>(
        `/api/payments?${params.toString()}`,
        fetcher,
        { refreshInterval: 300000 } // Poll every 5 minutes
    );

    return {
        payments: data?.data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useSuppliers(search?: string) {
    const { data, error, isLoading, mutate } = useSWR<{ data: Supplier[] }>(
        search ? `/api/suppliers?search=${encodeURIComponent(search)}` : '/api/suppliers',
        fetcher
    );

    return {
        suppliers: data?.data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useProjects() {
    const { data, error, isLoading } = useSWR<{ data: any[] }>(
        '/api/projects',
        fetcher
    );

    return {
        projects: data?.data || [],
        isLoading,
        isError: error
    };
}
