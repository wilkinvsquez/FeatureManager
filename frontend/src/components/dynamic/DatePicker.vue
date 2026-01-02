<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	title?: string;
	value?: string;
	modelValue?: string;
	min?: string;
	max?: string;
	readOnly?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "input"]);

/**
 * Converts ISO date to yyyy-MM-dd format for input[type="date"]
 */
const formattedValue = computed(() => {
	const dateValue = props.modelValue || props.value;
	if (!dateValue) return "";

	try {
		const date = new Date(dateValue);
		if (isNaN(date.getTime())) return "";
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	} catch {
		return "";
	}
});

/**
 * Handles input event from the date picker and emits the updated value
 * Converts the date to ISO format for storage
 */
const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const isoDate = target.value ? new Date(target.value).toISOString() : "";
	emit("update:modelValue", isoDate);
	emit("input", isoDate);
};
</script>

<template>
	<div class="dynamic-datepicker">
		<label v-if="props.title" class="datepicker-label">{{
			props.title
		}}</label>
		<input
			type="date"
			:value="formattedValue"
			@input="handleInput"
			:min="props.min"
			:max="props.max"
			:disabled="props.readOnly"
			class="datepicker-input" />
	</div>
</template>

<style scoped>
.dynamic-datepicker {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin: 0.5rem 0;
	width: 100%;
}

.datepicker-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin-left: 0.25rem;
}

.datepicker-input {
	padding: 0.75rem 1rem;
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	font-size: 0.95rem;
	color: var(--text-main);
	background-color: var(--bg-input);
	outline: none;
	font-family: inherit;
	transition: all var(--transition-fast);
	box-shadow: var(--shadow-sm);
	color-scheme: dark light;
}

/* Ensure color scheme matches for the native date picker icon/ui */
[data-theme="dark"] .datepicker-input {
	color-scheme: dark;
}

[data-theme="light"] .datepicker-input {
	color-scheme: light;
}

.datepicker-input:hover:not(:disabled) {
	border-color: var(--primary-400);
	box-shadow: var(--shadow-md);
}

.datepicker-input:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.datepicker-input:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--bg-app);
	border-color: var(--border-color);
}
</style>
