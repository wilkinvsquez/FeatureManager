import api from './api';
import type { Flag } from '../types/flag';

export const FlagService = {
    async getAll(serviceId?: string): Promise<Flag[]> {
        const params = serviceId ? { serviceId } : {};
        const response = await api.get('/flags', { params });
        return response.data;
    },

    async create(flag: Partial<Flag>): Promise<Flag> {
        const response = await api.post('/flags', flag);
        return response.data;
    },

    async update(id: string, flag: Partial<Flag>): Promise<Flag> {
        const response = await api.patch(`/flags/${id}`, flag);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/flags/${id}`);
    }
};