<script setup lang="ts">
const props = defineProps({
	title: { type: String, default: "" },
	placeholder: { type: String, default: "" },
	value: { type: [String, Number], default: "" },
	modelValue: { type: [String, Number], default: "" },
	inputType: { type: String, default: "text" },
	readOnly: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "input"]);

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.value);
	emit("input", target.value);
};
</script>

<template>
	<div class="dynamic-input">
		<label v-if="props.title" class="input-label">{{ props.title }}</label>
		<input :type="props.inputType" :value="props.modelValue" @input="handleInput" :placeholder="props.placeholder"
			:disabled="props.readOnly" class="input-field" />
	</div>
</template>

<style scoped>
.dynamic-input {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin: 0.5rem 0;
	width: 100%;
}

.input-label {
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--text-secondary);
	margin-left: 0.25rem;
}

.input-field {
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
}

.input-field:hover:not(:disabled) {
	border-color: var(--primary-400);
	box-shadow: var(--shadow-md);
}

.input-field:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: var(--bg-app);
	border-color: var(--border-color);
}

.input-field::placeholder {
	color: var(--text-muted);
}
</style>
