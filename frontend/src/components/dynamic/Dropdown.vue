<script setup lang="ts">
interface Option {
	display?: string;
	label?: string;
	value: any;
}

const props = defineProps({
	title: { type: String, default: "Section" },
	value: { type: String, default: "" },
	modelValue: { type: String, default: "" },
	options: { type: Array<Option>, default: () => [] },
	placeholder: { type: String, default: "Select an option" },
	readOnly: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "change"]);

/**
 * Handles change event from the dropdown and emits the updated value
 * Converts the value to a number if it looks like a number
 */
const handleChange = (event: Event) => {
	const target = event.target as HTMLSelectElement;
	const value = target.value;
	const numValue = Number(value);
	const finalValue = !isNaN(numValue) && value !== "" ? numValue : value;

	emit("update:modelValue", finalValue);
	emit("change", finalValue);
};
</script>

<template>
	<div class="dynamic-dropdown">
		<label v-if="props.title" class="dropdown-label">{{
			props.title
		}}</label>
		<select
			:value="props.modelValue || props.value"
			@change="handleChange"
			:disabled="props.readOnly"
			class="dropdown-select">
			<option
				v-for="(option, index) in props.options"
				:key="index"
				:value="option.value">
				{{ option.display || option.label || option.value }}
			</option>
		</select>
	</div>
</template>

<style scoped>
.dynamic-dropdown {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin: 0.5rem 0;
	width: 100%;
}

.dropdown-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin-left: 0.25rem;
}

.dropdown-select {
	padding: 0.75rem 1rem;
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	font-size: 0.95rem;
	color: var(--text-main);
	background-color: var(--bg-input);
	outline: none;
	cursor: pointer;
	transition: all var(--transition-fast);
	appearance: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 1rem center;
	background-size: 1.25rem;
	padding-right: 2.5rem;
	box-shadow: var(--shadow-sm);
}

.dropdown-select:hover:not(:disabled) {
	border-color: var(--primary-400);
	box-shadow: var(--shadow-md);
}

.dropdown-select:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dropdown-select:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--bg-app);
	border-color: var(--border-color);
}
</style>
