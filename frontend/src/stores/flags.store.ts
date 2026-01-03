import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { FlagService } from '../services/flag.service';
import type { Flag } from '../types/flag';

export const useFlagStore = defineStore('flags', () => {
    const flags = ref<Flag[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const currentServiceId = ref<string>(''); // Filtro actual

    const filteredFlags = computed(() => {
        if (!currentServiceId.value) return flags.value;
        return flags.value.filter(f => f.serviceId === currentServiceId.value);
    });

    const uniqueServiceIds = computed(() => {
        const ids = new Set(flags.value.map(f => f.serviceId));
        return Array.from(ids);
    });

    // Actions
    /**
     * Fetch flags for a specific serviceId
     * @param serviceId Service ID
     */
    const fetchFlagsByServiceId = async (serviceId: string) => {
        loading.value = true;
        try {
            flags.value = await FlagService.getAll(serviceId);
            console.log("Flags loaded:", flags.value);
        } catch (e: any) {
            error.value = "Failed to load flags";
        } finally {
            loading.value = false;
        }
    };

    /**
     * Gets all flags
     */
    const fetchFlags = async () => {
        loading.value = true;
        try {
            flags.value = await FlagService.getAll();
        } catch (e: any) {
            error.value = "Failed to load flags";
        } finally {
            loading.value = false;
        }
    };

    /**
     * Save a flag
     * @param flag 
     */
    const saveFlag = async (flag: Partial<Flag>) => {
        loading.value = true;
        try {
            if (flag.id) {
                await FlagService.update(flag.id, flag);
            } else {
                await FlagService.create(flag);
            }
            await fetchFlags(); // Recargar
        } catch (e: any) {
            throw new Error("Error saving flag: " + e.message);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete a flag
     * @param id Flag ID
     */
    const deleteFlag = async (id: string) => {
        loading.value = true;
        try {
            await FlagService.delete(id);
            await fetchFlags();
        } catch (e) {
            throw new Error("Error deleting flag");
        } finally {
            loading.value = false;
        }
    };

    return {
        flags,
        loading,
        error,
        currentServiceId,
        filteredFlags,
        uniqueServiceIds,
        fetchFlagsByServiceId,
        fetchFlags,
        saveFlag,
        deleteFlag
    };
});