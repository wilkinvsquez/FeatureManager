<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
	title: { type: String, default: "" },
	value: { type: Boolean, default: false },
	modelValue: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	readOnly: { type: Boolean, default: false },
})

const emit = defineEmits(["update:modelValue", "change"]);

const toggleId = computed(() => `toggle-${Math.random().toString(36).substr(2, 9)}`);

const handleToggle = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit("update:modelValue", target.checked);
	emit("change", target.checked);
};
</script>

<template>
	<div class="dynamic-toggle">
		<input type="checkbox" :id="toggleId" :checked="props.modelValue ?? props.value" @change="handleToggle"
			:disabled="props.readOnly || props.disabled" class="toggle-input" />
		<label :for="toggleId" class="toggle-label">
			<span class="toggle-switch"></span>
			<span v-if="props.title" class="toggle-text">{{
				props.title
			}}</span>
		</label>
	</div>
</template>

<style scoped>
.dynamic-toggle {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin: 0.75rem 0;
	padding: 0.5rem 0.75rem;
	border-radius: var(--radius-lg);
	transition: all var(--transition-normal);
}

.dynamic-toggle:hover {
	background-color: rgba(var(--primary-500-rgb, 59, 130, 246), 0.03);
}

.toggle-input {
	display: none;
}

.toggle-label {
	display: flex;
	align-items: center;
	gap: 1rem;
	cursor: pointer;
	user-select: none;
	width: 100%;
}

.toggle-input:disabled+.toggle-label {
	opacity: 0.5;
	cursor: not-allowed;
}

.toggle-switch {
	position: relative;
	flex-shrink: 0;
	width: 52px;
	height: 28px;
	background-color: var(--border-color);
	border-radius: var(--radius-full);
	transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
	border: 1px solid var(--border-color);
	box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.toggle-switch::after {
	content: "";
	position: absolute;
	top: 3px;
	left: 3px;
	width: 20px;
	height: 20px;
	background-color: white;
	border-radius: 50%;
	transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.toggle-input:checked+.toggle-label .toggle-switch {
	background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
	border-color: var(--primary-600);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.toggle-input:checked+.toggle-label .toggle-switch::after {
	transform: translateX(24px);
	box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.toggle-text {
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--text-main);
	letter-spacing: -0.01em;
}

[data-theme="dark"] .toggle-switch {
	background-color: var(--bg-input);
	box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .toggle-switch::after {
	background-color: #f1f5f9;
}

[data-theme="dark"] .toggle-input:checked+.toggle-label .toggle-switch {
	background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
	box-shadow: 0 0 15px rgba(59, 130, 246, 0.25);
}

.dynamic-toggle:focus-within {
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
</style>
