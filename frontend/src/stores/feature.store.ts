import { defineStore } from 'pinia';
import { FeatureService } from '../services/feature.service';
import type { Feature } from '../types/feature';
import { computed, ref } from 'vue';

export const useFeatureStore = defineStore('feature', () => {
    // States
    const features = ref<Feature[]>([]); // Features list
    const loading = ref(false); // Loading state
    const error = ref<string | null>(null); // Error state

    //Getters
    const activeFeatures = computed(() => features.value.filter(feature => feature.isActive)); // Active features
    const getFeatureByKey = computed(() => (key: string) => features.value.find(feature => feature.key === key)); // Get feature by key
    //Actions
    /**
     * Fetch all features from the API
     */
    const fetchFeatures = async () => {
        loading.value = true;
        error.value = null;
        try {
            features.value = await FeatureService.getAll();
        } catch (e: any) {
            error.value = e.message || "Error Fetching features";
        } finally {
            loading.value = false;
        }
    }

    /**
     * Create a new feature
     * @param feature Feature data
     * @returns Promise<Feature>
     */
    const createFeature = async (feature: Feature) => {
        loading.value = true;
        error.value = null;
        try {
            const newFeature = await FeatureService.create(feature);
            features.value.push(newFeature);
            return newFeature;
        } catch (e: any) {
            error.value = e.message || "Error Creating feature";
            throw e;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Update an existing feature
     * @param id Feature id
     * @param feature Feature data
     * @returns Promise<Feature>
     */
    const updateFeature = async (id: string, feature: Feature) => {
        loading.value = true;
        error.value = null;
        try {
            const updatedFeature = await FeatureService.update(id, feature);
            const index = features.value.findIndex(feature => feature.id === id);
            if (index !== -1) {
                features.value[index] = updatedFeature;
            }
            return updatedFeature;
        } catch (e: any) {
            error.value = e.message || "Error Updating feature";
            throw e;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Delete an existing feature
     * @param id Feature id
     * @returns Promise<void>
     */
    const deleteFeature = async (id: string) => {
        loading.value = true;
        error.value = null;
        try {
            await FeatureService.delete(id);
            features.value = features.value.filter(feature => feature.id !== id);
        } catch (e: any) {
            error.value = e.message || "Error Deleting feature";
            throw e;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Check if a feature is active
     * @param id Feature id
     * @returns boolean
     */
    const isFeatureActive = (id: string) => {
        const feature = features.value.find(feature => feature.id === id);
        return feature?.isActive || false;
    }

    return {
        // States
        features,
        loading,
        error,

        // Getters
        activeFeatures,
        getFeatureByKey,

        // Actions
        fetchFeatures,
        createFeature,
        updateFeature,
        deleteFeature,
        isFeatureActive,
    };
});