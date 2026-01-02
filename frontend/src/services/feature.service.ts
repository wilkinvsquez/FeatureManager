import type { Feature, CreateFeatureDto } from "../types/feature";
import api from "./api";

export const FeatureService = {
    /**
     * Get all features
     * @returns Promise<Feature[]>
     */
    async getAll(): Promise<Feature[]> {
        const response = await api.get('/features');
        return response.data;
    },

    /**
     * Get feature by id
     * @param id Feature id
     * @returns Promise<Feature>
     */
    async getById(id: string): Promise<Feature> {
        const response = await api.get<Feature>(`/features/${id}`);
        return response.data;
    },

    /**
     * Create feature
     * @param feature Feature data
     * @returns Promise<Feature>
     */
    async create(feature: Feature): Promise<Feature> {
        const response = await api.post('/features', feature);
        return response.data;
    },

    /**
     * Update feature
     * @param id Feature id
     * @param data Feature data
     * @returns Promise<Feature>
     */
    async update(id: string, data: Partial<CreateFeatureDto>): Promise<Feature> {
        const response = await api.patch<Feature>(`/features/${id}`, data);
        return response.data;
    },

    /** 
     * Delete feature
     * @param id Feature id
     * @returns Promise<void>
     */
    async delete(id: string): Promise<void> {
        await api.delete(`/features/${id}`);
    },
}   