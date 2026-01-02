import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AssetService } from '../services/asset.service';
import type { Asset } from '../types/asset';
import type { UIComponent } from '../types/ui-component';

export const useAssetStore = defineStore('assets', () => {
    // State
    const assets = ref<Asset[]>([]);
    const currentAsset = ref<Asset | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const assetSchema = computed(() => currentAsset.value?.schema || null);

    // Actions
    const fetchAsset = async (key: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const asset = await AssetService.get(key);
            currentAsset.value = asset;
        } catch (e: any) {
            console.error(e);
            error.value = `Failed to fetch asset: ${key}`;
            currentAsset.value = null;
        } finally {
            isLoading.value = false;
        }
    };

    const saveAsset = async (key: string, schema: UIComponent) => {
        isLoading.value = true;
        error.value = null;
        try {
            const asset = await AssetService.save(key, schema);
            currentAsset.value = asset;
            return asset;
        } catch (e: any) {
            console.error(e);
            error.value = "Failed to save asset";
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchAssets = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const fetched = await AssetService.getAll();
            assets.value = fetched;
            return fetched;
        } catch (e: any) {
            console.error(e);
            error.value = "Failed to fetch assets";
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteAsset = async (key: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            await AssetService.delete(key);
            assets.value = assets.value.filter(a => a.key !== key);
            if (currentAsset.value?.key === key) {
                currentAsset.value = null;
            }
        } catch (e: any) {
            console.error(e);
            error.value = "Failed to delete asset";
            throw e;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        assets,
        currentAsset,
        isLoading,
        error,
        assetSchema,
        fetchAsset,
        saveAsset,
        fetchAssets,
        deleteAsset
    };
});