import api from './api';
import type { Asset } from '../types/asset';
import type { UIComponent } from '../types/ui-component';

export const AssetService = {

    /**
     * Save asset
     * @param key Asset key
     * @param schema Asset schema
     * @returns Promise<Asset>
     */
    async save(key: string, schema: UIComponent): Promise<Asset> {
        try {
            await this.get(key);
            const response = await api.patch(`/assets/${key}`, { schema });
            return response.data;
        } catch (e) {
            const response = await api.post('/assets', { key, schema });
            return response.data;
        }
    },

    /**
     * Get asset
     * @param key Asset key
     * @returns Promise<Asset>
     */
    async get(key: string): Promise<Asset> {
        const response = await api.get(`/assets/${key}`);
        return response.data;
    },

    /**
     * Get all assets
     * @returns Promise<Asset[]>
     */
    async getAll(): Promise<Asset[]> {
        const response = await api.get('/assets');
        return response.data;
    },

    /**
     * Delete asset
     * @param key Asset key
     * @returns Promise<void>
     */
    async delete(key: string): Promise<void> {
        await api.delete(`/assets/${key}`);
    },

    /**
     * Update asset
     * @param key Asset key
     * @param schema Asset schema
     * @returns Promise<Asset>
     */
    async update(key: string, schema: UIComponent): Promise<Asset> {
        const response = await api.patch(`/assets/${key}`, { schema });
        return response.data;
    },

}   