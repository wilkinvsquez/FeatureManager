<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	title?: string;
	value?: boolean;
	modelValue?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const checkboxId = computed(
	() => `checkbox-${Math.random().toString(36).substr(2, 9)}`,
);

const handleChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.checked);
	emit("change", target.checked);
};
</script>

<template>
	<div class="dynamic-checkbox">
		<input
			type="checkbox"
			:id="checkboxId"
			:checked="props.modelValue ?? props.value"
			@change="handleChange"
			:disabled="props.readOnly || props.disabled"
			class="checkbox-input" />
		<label :for="checkboxId" class="checkbox-label">
			{{ props.title }}
		</label>
	</div>
</template>

<style scoped>
.dynamic-checkbox {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 0.5rem 0;
}

.checkbox-input {
	width: 20px;
	height: 20px;
	cursor: pointer;
	border: 2px solid var(--border-color);
	border-radius: var(--radius-sm);
	background-color: var(--bg-input);
	appearance: none;
	display: grid;
	place-content: center;
	transition: all var(--transition-fast);
	box-shadow: var(--shadow-sm);
}

.checkbox-input::before {
	content: "";
	width: 12px;
	height: 12px;
	transform: scale(0);
	transition: 120ms transform ease-in-out;
	box-shadow: inset 1em 1em var(--bg-card);
	background-color: CanvasText;
	clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.checkbox-input:checked {
	background-color: var(--primary-500);
	border-color: var(--primary-600);
}

.checkbox-input:checked::before {
	transform: scale(1);
}

.checkbox-input:focus {
	outline: none;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.checkbox-input:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	background-color: var(--bg-app);
}

.checkbox-label {
	font-size: 0.9375rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	user-select: none;
}

.checkbox-input:disabled + .checkbox-label {
	opacity: 0.6;
	cursor: not-allowed;
}

[data-theme="dark"] .checkbox-input:checked {
	background-color: var(--primary-600);
}
</style>
