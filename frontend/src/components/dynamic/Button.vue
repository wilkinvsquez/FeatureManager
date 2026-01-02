<script setup lang="ts">
import { computed } from "vue";
import { useEditorStore } from "../../stores/editor.store";

const props = defineProps<{
	title?: string;
	btnType?: "primary" | "secondary" | "danger" | "outlined" | "solid";
	states?: string[]; // ["edit", "cancel"]
	onClick?: (event: MouseEvent) => void;
	metadata?: {
		module?: string;
		belongTo?: string;
		nodeName?: string;
	};
	nodeName?: string;
	readOnly?: boolean;
	style?: Record<string, any>;
}>();

const editorStore = useEditorStore();

/**
 * Compute button label based on edit state
 * For toggleButton with states array, show different text based on module status
 */
const buttonLabel = computed(() => {
	if (props.states && props.states.length >= 2 && props.metadata?.module) {
		const isEditing = editorStore.getModuleStatus(props.metadata.module);
		return isEditing ? props.states[1] : props.states[0];
	}

	return props.title || (props.states && props.states[0]) || "Button";
});

/**
 * Compute disabled state for buttons
 * Apply Changes/Action buttons should be disabled if no pending changes
 */
const isDisabled = computed(() => {
	const actionPatterns = ["apply", "reset", "push", "save", "submit"];
	const isActionButton =
		actionPatterns.some(
			p =>
				props.nodeName?.toLowerCase().includes(p) ||
				props.metadata?.nodeName?.toLowerCase().includes(p),
		) ||
		props.nodeName === "applyConfig" ||
		props.nodeName === "resetEnv";

	if (isActionButton && props.metadata?.module) {
		const hasChanges = editorStore.hasPendingChanges(props.metadata.module);
		return !hasChanges;
	}

	if (props.nodeName === "moduleStatus") return false;
	return props.readOnly || false;
});

/**
 * Handle click event
 * @param event - The click event
 */
const handleClick = (event: MouseEvent) => {
	if (props.onClick) props.onClick(event);
};
</script>
<template>
	<button
		:class="['dynamic-btn', props.btnType || 'primary']"
		:disabled="isDisabled"
		:style="props.style"
		@click="handleClick">
		{{ buttonLabel }}
	</button>
</template>

<style scoped>
.dynamic-btn {
	padding: 0.8rem 1.75rem;
	border: none;
	border-radius: var(--radius-lg);
	font-weight: 700;
	font-size: 0.95rem;
	cursor: pointer;
	transition: all var(--transition-normal);
	font-family: inherit;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-transform: capitalize;
	gap: 0.6rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -2px rgba(0, 0, 0, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.2);
	position: relative;
	overflow: hidden;
	letter-spacing: 0.01em;
	outline: none;
}

.dynamic-btn::after {
	content: "";
	position: absolute;
	top: -50%;
	left: -60%;
	width: 40%;
	height: 200%;
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.3) 50%,
		rgba(255, 255, 255, 0) 100%
	);
	transform: rotate(30deg);
	transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	pointer-events: none;
	opacity: 0;
}

.dynamic-btn:hover:not(:disabled)::after {
	left: 120%;
	opacity: 1;
}

.dynamic-btn:active:not(:disabled) {
	transform: scale(0.96);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* Disabled state */
.dynamic-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
	background: var(--border-color) !important;
	color: var(--text-muted) !important;
	box-shadow: none;
	transform: none;
}

.primary {
	background: linear-gradient(145deg, var(--primary-500), var(--primary-600));
	color: white;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.primary:hover:not(:disabled) {
	background: linear-gradient(145deg, var(--primary-600), var(--primary-700));
	box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3),
		0 4px 6px -4px rgba(59, 130, 246, 0.3);
}

.secondary {
	background: var(--bg-card);
	color: var(--text-main);
	border: 1px solid var(--border-color);
	backdrop-filter: blur(8px);
}
.secondary:hover:not(:disabled) {
	background: var(--bg-app);
	border-color: var(--primary-400);
	color: var(--primary-600);
}

.danger {
	background: linear-gradient(145deg, var(--error), #dc2626);
	color: white;
}
.danger:hover:not(:disabled) {
	background: linear-gradient(145deg, #dc2626, #b91c1c);
	box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3),
		0 4px 6px -4px rgba(239, 68, 68, 0.3);
}

.solid {
	background: linear-gradient(145deg, var(--success), #059669);
	color: white;
}
.solid:hover:not(:disabled) {
	background: linear-gradient(145deg, #059669, #047857);
	box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3),
		0 4px 6px -4px rgba(16, 185, 129, 0.3);
}

.outlined {
	background: transparent;
	border: 2px solid var(--primary-500);
	color: var(--primary-500);
}
.outlined:hover:not(:disabled) {
	background: rgba(59, 130, 246, 0.08);
	border-color: var(--primary-600);
	color: var(--primary-600);
}

[data-theme="dark"] .secondary {
	background: rgba(45, 45, 45, 0.6);
	border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .outlined:hover:not(:disabled) {
	background: rgba(59, 130, 246, 0.15);
}
</style>
