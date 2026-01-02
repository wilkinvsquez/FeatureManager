import { type Component } from "vue";
import { useEditorStore } from "../../stores/editor.store";

// Import all dynamic components
import Button from "../../components/dynamic/Button.vue";
import Card from "../../components/dynamic/Card.vue";
import Collapsible from "../../components/dynamic/Collapsible.vue";
import Container from "../../components/dynamic/Container.vue";
import Dropdown from "../../components/dynamic/Dropdown.vue";
import Toggle from "../../components/dynamic/Toggle.vue";
import Checkbox from "../../components/dynamic/Checkbox.vue";
import TextInput from "../../components/dynamic/TextInput.vue";
import DatePicker from "../../components/dynamic/DatePicker.vue";
import Text from "../../components/dynamic/Text.vue";

/**
 * Component Registry - Maps type strings to Vue components
 */
const components: Record<string, Component> = {
    // Structural
    collapsible: Collapsible,
    card: Card,
    container: Container,
    containerCollapsible: Collapsible,

    // Form Components
    button: Button,
    toggleButton: Button,
    dropdown: Dropdown,
    toggle: Toggle,
    toogle: Toggle, // Common typo
    checkbox: Checkbox,
    checkBox: Checkbox,
    radioGroup: Dropdown, // Maps to dropdown for now
    input: TextInput,
    datePicker: DatePicker,
    dropdownDatePicker: DatePicker,

    // Text
    text: Text,
    toogleReference: Text,

    // Custom components (placeholder - map to container for now)
    customCloseSessionByMembership: Container,
    customGeoFence: Container,
    customYappyDeviceManager: Container,
};

/**
 * Resolver Service - Central service for component resolution and binding
 */
export default {
    /**
     * Resolve component by type string
     * @param type - Component type string
     * @returns Vue component or null
     */
    resolveComponent(type: string): Component | null {
        return components[type] || null;
    },

    /**
     * Get component type from node
     * @param node - Component node
     * @returns Vue component or null
     */
    getComponentType(node: Record<string, any>): Component | null {
        const type = node.type;
        return components[type] || null;
    },

    /**
     * Get component props (excluding type and internal props)
     * @param node - Component node
     * @returns Props object
     */
    getComponentProps(node: Record<string, any>): Record<string, any> {
        const { type, nodeName, keyId, keyname, ...props } = node;
        return props;
    },

    /**
     * Check if node has children
     * @param node - Component node
     * @returns True if has children
     */
    hasChildren(node: Record<string, any>): boolean {
        return !!(node.content || node.components);
    },

    /**
     * Get children from node
     * @param node - Component node
     * @returns Array of child nodes
     */
    getChildren(node: Record<string, any>): any[] {
        return node.content || node.components || [];
    },

    /**
     * Get component bindings with state management
     * @param node - Component node
     * @param readOnly - Whether component is read-only
     * @param isCollapsed - Whether component is collapsed
     * @param notification - Notification instance (optional)
     * @returns Bindings object
     */
    getComponentBindings(
        node: any,
        readOnly = false,
        isCollapsed?: boolean,
        notification?: any,
        moduleContext?: string
    ): Record<string, any> {
        const editorStore = useEditorStore();

        // Initialize bindings with props
        const bindings: Record<string, any> = {
            ...this.getComponentProps(node),
        };

        // Explicitly include nodeName and keyname if they exist (were removed by getComponentProps)
        if (node.nodeName) bindings.nodeName = node.nodeName;
        if (node.keyname) bindings.keyname = node.keyname;

        // Map 'style' to 'uiStyle' for Container component compatibility
        // CRITICAL: Do NOT delete bindings.style here as other components (like Button) need it
        if (node.style) {
            bindings.uiStyle = node.style;
        }

        // Add notification if provided
        if (notification) {
            bindings.notification = notification;
        }

        // Add collapsed state if provided
        if (typeof isCollapsed === 'boolean') {
            bindings.isCollapsed = isCollapsed;
        }

        // Store asset flag if keyname exists
        if (node.keyname) {
            editorStore.setAssetFlag(node.keyname, node);
        }

        // Determine effective module (context overrides node metadata)
        const module = moduleContext || node.metadata?.module;

        // Ensure metadata in bindings reflects the effective module for component internal logic (e.g. Button.vue)
        if (module) {
            bindings.metadata = {
                ...(node.metadata || {}),
                module: module,
                nodeName: node.nodeName // Also include nodeName here for safety
            };
        }

        // Determine readOnly state based on module editing status
        // If effective module exists, check if that module is being edited
        // EXCEPTION: moduleStatus button should NEVER be readOnly (it controls the edit state)
        if (module && node.nodeName !== 'moduleStatus') {
            const isEditing = editorStore.getModuleStatus(module);
            // Components are readOnly (disabled) when NOT editing
            bindings.readOnly = !isEditing;
        } else {
            // If no module or is moduleStatus button, use the passed readOnly value
            bindings.readOnly = readOnly;
        }

        // Handle visibility based on visibilityKey
        if (node.visibilityKey && module) {
            const isVisible = editorStore.getInputState(
                node.visibilityKey,
                module
            );
            bindings.style = {
                ...(bindings.style || {}),
                display: isVisible ? "block" : "none",
            };
        }

        // Add icon if present
        if (node.icon) {
            bindings.icon = node.icon;
        }

        // List of buttons that should only be visible and active during edit mode
        // Generalized list to catch common action patterns
        const actionPatterns = ['apply', 'reset', 'push', 'save', 'submit'];
        const isActionSubmitButton = actionPatterns.some(p =>
            (node.onClick && typeof node.onClick === 'string' && node.onClick.toLowerCase().includes(p)) ||
            (node.nodeName && node.nodeName.toLowerCase().includes(p))
        );

        // For action-type buttons, control visibility based on edit mode
        if (isActionSubmitButton) {
            if (module) {
                const isEditing = editorStore.getModuleStatus(module);
                // Hide buttons when NOT in edit mode
                if (!isEditing) {
                    bindings.style = {
                        ...(bindings.style || {}),
                        display: 'none'
                    };
                }
            }
        }

        // Handle onClick events
        if (node.onClick) {
            bindings.onClick = () => {
                console.log('[ResolverService] onClick triggered for:', node.onClick, 'node:', node);

                // For moduleStatus, we need to determine if we're editing or canceling
                if (node.onClick === 'moduleStatus' && module) {
                    const isCurrentlyEditing = editorStore.getModuleStatus(module);
                    const eventData = {
                        module: module,
                        event: isCurrentlyEditing ? 'cancel' : 'edit'
                    };
                    console.log('[ResolverService] Calling moduleStatus with:', eventData);
                    this.handleButtonClick(node.onClick, eventData);
                } else {
                    // For other actions, pass the metadata (keeping original module if needed, 
                    // or maybe we should inject the effective module here too?)
                    // For summary/apply, we definitely need the effective module
                    const effectiveEventData = {
                        ...(node.metadata || {}),
                        module: module, // Override with effective module
                        nodeName: node.nodeName
                    };
                    this.handleButtonClick(node.onClick, effectiveEventData);
                }
            };
        }

        // For action-type buttons, disable if no pending changes
        if (isActionSubmitButton) {
            if (module) {
                const hasChanges = editorStore.hasPendingChanges(module);
                // Override readOnly based on pending changes
                bindings.readOnly = !hasChanges;
            }
        }

        // Handle v-model binding for components with value
        if ("value" in node && node.nodeName && module) {
            // Initialize input state with the original value from JSON if not already set
            const existingValue = editorStore.getInputState(
                node.nodeName,
                module
            );

            if (existingValue === undefined) {
                // First time seeing this component - store its original value
                editorStore.setInputState(
                    node.nodeName,
                    module,
                    node.metadata?.belongTo,
                    node.value,
                    true // Skip tracking on initial load
                );
            }

            // Get current value from editor store (now guaranteed to exist)
            const currentValue = editorStore.getInputState(
                node.nodeName,
                module
            );

            bindings.modelValue = currentValue !== undefined ? currentValue : node.value;

            // Set up update handler
            bindings["onUpdate:modelValue"] = (value: any) => {
                editorStore.setInputState(
                    node.nodeName,
                    module,
                    node.metadata?.belongTo,
                    value
                );
            };
        }

        return bindings;
    },

    /**
     * Handle button click actions
     * @param action - Action name
     * @param event - Event data
     */
    handleButtonClick(action: string, event?: any) {
        const actions: Record<string, Function> = {
            moduleStatus: () => this.moduleStatus(event),
            applyChangesLater: () => this.openSummary(event, false),
            applyChangesNow: () => this.openSummary(event, true),
        };

        if (actions[action]) {
            actions[action](event);
        } else {
            console.warn(`[ResolverService] No handler for action: ${action}`);
        }
    },

    /**
     * Handle module status toggle (edit/cancel)
     * @param event - Event with module and event type
     */
    moduleStatus(event: any) {
        const editorStore = useEditorStore();

        console.log('[ResolverService] moduleStatus called with event:', event);

        if (event && event.event === 'edit') {
            console.log('[ResolverService] Setting module to EDIT mode:', event.module);
            editorStore.setModuleStatus(event.module, true);
        } else if (event && event.event === 'cancel') {
            console.log('[ResolverService] Setting module to CANCEL mode:', event.module);
            editorStore.setModuleStatus(event.module, false);
            editorStore.clearInputState(event.module);
        } else {
            console.warn('[ResolverService] Unknown event type:', event);
        }
    },

    /**
     * Open summary modal
     * @param event - Event with module info
     * @param isApplyNow - Whether to apply immediately
     */
    openSummary(event: any, isApplyNow: boolean) {
        const editorStore = useEditorStore();

        if (event && event.module) {
            const moduleState = editorStore.getAllInputState(event.module);

            if (!moduleState || moduleState.size === 0) {
                console.log('[ResolverService] No changes to apply');
                return;
            }

            // TODO: Implement modal logic
            console.log(`[ResolverService] Opening summary for ${event.module}`, {
                isApplyNow,
                changes: moduleState
            });
        }
    },
};
