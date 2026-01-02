import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Editor Store - Manages editing state for dynamic components
 * Replaces the StateManager pattern with Pinia
 */
export const useEditorStore = defineStore('editor', () => {
    // State: Map<module, Map<nodeName, { value, belongTo }>>
    const inputState = ref<Map<string, Map<string, any>>>(new Map());

    // State: Map<module, isEditing>
    const moduleStatus = ref<Map<string, boolean>>(new Map());

    // State: Map<keyname, component>
    const assetFlags = ref<Map<string, any>>(new Map());

    // State: Map<module, Map<nodeName, { originalValue, currentValue }>>
    const pendingChanges = ref<Map<string, Map<string, { originalValue: any, currentValue: any }>>>(new Map());

    // State: Map<module, Map<nodeName, originalValue>> - Store original values when entering edit mode
    const originalValues = ref<Map<string, Map<string, any>>>(new Map());

    /**
     * Set input state for a specific component
     * @param nodeName - Unique identifier for the component
     * @param module - Module/ServiceId the component belongs to
     * @param belongTo - Parent keyname (for nested values)
     * @param value - The value to store
     * @param skipTracking - If true, don't track this as a change (for initial values)
     */
    const setInputState = (
        nodeName: string,
        module: string,
        belongTo: string | undefined,
        value: any,
        skipTracking = false
    ) => {
        if (!inputState.value.has(module)) {
            inputState.value.set(module, new Map());
        }

        const moduleState = inputState.value.get(module)!;
        moduleState.set(nodeName, { value, belongTo });

        // Track the change only if not skipping
        if (!skipTracking) {
            trackChange(nodeName, module, value);
        }
    };

    /**
     * Track a change and compare with original value
     * @param nodeName - Component identifier
     * @param module - Module/ServiceId
     * @param newValue - New value
     */
    const trackChange = (nodeName: string, module: string, newValue: any) => {
        // Get original value
        const originalValue = originalValues.value.get(module)?.get(nodeName);

        if (originalValue === undefined) {
            console.warn(`[EditorStore] No original value found for ${module}.${nodeName}`);
            return;
        }

        // Initialize pending changes for this module if needed
        if (!pendingChanges.value.has(module)) {
            pendingChanges.value.set(module, new Map());
        }

        const moduleChanges = pendingChanges.value.get(module)!;

        // Deep comparison function that handles objects and type coercion
        const areValuesEqual = (val1: any, val2: any): boolean => {
            // Strict equality first
            if (val1 === val2) return true;

            // Handle null/undefined
            if (val1 == null || val2 == null) return val1 == val2;

            // Get types
            const type1 = typeof val1;
            const type2 = typeof val2;

            // If both are objects, do deep JSON comparison
            if (type1 === 'object' && type2 === 'object') {
                return JSON.stringify(val1) === JSON.stringify(val2);
            }

            // If types differ, try string comparison (handles "30" vs 30, "true" vs true)
            if (type1 !== type2) {
                return String(val1) === String(val2);
            }

            // Same type, not object, not equal by ===
            return false;
        };

        // Compare with original value
        const isReverted = areValuesEqual(newValue, originalValue);

        if (isReverted) {
            // Value returned to original - remove from pending changes
            moduleChanges.delete(nodeName);
            console.log(`%c[EditorStore] ✅ REVERTED: ${nodeName}`, 'color: #10b981; font-weight: bold');
        } else {
            // Value changed - add/update pending change
            const wasAlreadyChanged = moduleChanges.has(nodeName);
            moduleChanges.set(nodeName, { originalValue, currentValue: newValue });

            if (wasAlreadyChanged) {
                console.log(`%c[EditorStore] 🔄 UPDATED: ${nodeName}`, 'color: #f59e0b; font-weight: bold');
            } else {
                console.log(`%c[EditorStore] 📝 NEW CHANGE: ${nodeName}`, 'color: #3b82f6; font-weight: bold');
            }

            console.log('  Original:', originalValue, `(${typeof originalValue})`);
            console.log('  Current:', newValue, `(${typeof newValue})`);
        }

        // Always show complete summary
        console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #6b7280');
        console.log(`%c📊 PENDING CHANGES SUMMARY FOR ${module}`, 'color: #8b5cf6; font-weight: bold; font-size: 14px');
        console.log(`%cTotal Changes: ${moduleChanges.size}`, moduleChanges.size > 0 ? 'color: #ef4444; font-weight: bold' : 'color: #10b981');

        if (moduleChanges.size > 0) {
            console.log('%cAll Pending Changes:', 'color: #6b7280; font-weight: bold');
            console.table(
                Array.from(moduleChanges.entries()).map(([key, change]) => ({
                    '🔑 Field': key,
                    '📥 Original': JSON.stringify(change.originalValue),
                    '📤 Current': JSON.stringify(change.currentValue)
                }))
            );
        } else {
            console.log('%c✨ No pending changes - all values match original', 'color: #10b981; font-style: italic');
        }
        console.log(`%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'color: #6b7280');
    };

    /**
     * Store original values when entering edit mode
     * @param module - Module/ServiceId
     */
    const captureOriginalValues = (module: string) => {
        console.log(`%c[EditorStore] 🎯 captureOriginalValues called for: ${module}`, 'color: #8b5cf6; font-weight: bold');

        const moduleState = inputState.value.get(module);
        if (!moduleState) {
            console.warn(`[EditorStore] ⚠️ No input state found for module: ${module}`);
            console.log('Available modules:', Array.from(inputState.value.keys()));
            return;
        }

        const originals = new Map<string, any>();
        moduleState.forEach((data, nodeName) => {
            originals.set(nodeName, data.value);
        });

        originalValues.value.set(module, originals);
        console.log(`%c[EditorStore] ✅ Captured ${originals.size} original values for ${module}`, 'color: #10b981; font-weight: bold');
        console.table(
            Array.from(originals.entries()).map(([key, value]) => ({
                Field: key,
                Value: JSON.stringify(value)
            }))
        );
    };

    /**
     * Get input state for a specific component
     * @param nodeName - Component identifier
     * @param module - Module/ServiceId
     * @returns The stored value or undefined
     */
    const getInputState = (nodeName: string, module: string): any => {
        const moduleState = inputState.value.get(module);
        return moduleState?.get(nodeName)?.value;
    };

    /**
     * Get all input state for a module
     * @param module - Module/ServiceId
     * @returns Map of all component states in the module
     */
    const getAllInputState = (module: string): Map<string, any> | undefined => {
        return inputState.value.get(module);
    };

    /**
     * Clear all input state for a module
     * @param module - Module/ServiceId to clear
     */
    const clearInputState = (module: string) => {
        inputState.value.delete(module);
    };

    /**
     * Set module editing status
     * @param module - Module/ServiceId
     * @param isEditing - Whether the module is in edit mode
     */
    const setModuleStatus = (module: string, isEditing: boolean) => {
        moduleStatus.value.set(module, isEditing);

        if (isEditing) {
            // Entering edit mode - capture original values
            captureOriginalValues(module);
        } else {
            // Exiting edit mode - clear pending changes and original values
            pendingChanges.value.delete(module);
            originalValues.value.delete(module);
        }
    };

    /**
     * Get module editing status
     * @param module - Module/ServiceId
     * @returns Whether the module is in edit mode
     */
    const getModuleStatus = (module: string): boolean => {
        return moduleStatus.value.get(module) || false;
    };

    /**
     * Check if module has pending changes
     * @param module - Module/ServiceId
     * @returns True if there are pending changes
     */
    const hasPendingChanges = (module: string): boolean => {
        const moduleChanges = pendingChanges.value.get(module);
        return moduleChanges ? moduleChanges.size > 0 : false;
    };

    /**
     * Get pending changes for a module
     * @param module - Module/ServiceId
     * @returns Map of pending changes
     */
    const getPendingChanges = (module: string): Map<string, { originalValue: any, currentValue: any }> | undefined => {
        return pendingChanges.value.get(module);
    };

    /**
     * Clear pending changes for a module
     * @param module - Module/ServiceId
     */
    const clearPendingChanges = (module: string) => {
        pendingChanges.value.delete(module);
    };

    /**
     * Store asset flag for a component with keyname
     * @param keyname - The keyname identifier
     * @param component - The component data
     */
    const setAssetFlag = (keyname: string, component: any) => {
        assetFlags.value.set(keyname, component);
    };

    /**
     * Get asset flag by keyname
     * @param keyname - The keyname identifier
     * @returns The stored component or undefined
     */
    const getAssetFlag = (keyname: string): any => {
        return assetFlags.value.get(keyname);
    };

    /**
     * Clear all asset flags
     */
    const clearAssetFlags = () => {
        assetFlags.value.clear();
    };

    return {
        // State
        inputState,
        moduleStatus,
        assetFlags,
        pendingChanges,
        originalValues,

        // Actions
        setInputState,
        getInputState,
        getAllInputState,
        clearInputState,
        setModuleStatus,
        getModuleStatus,
        setAssetFlag,
        getAssetFlag,
        clearAssetFlags,

        // Change tracking
        trackChange,
        captureOriginalValues,
        hasPendingChanges,
        getPendingChanges,
        clearPendingChanges,
    };
});
