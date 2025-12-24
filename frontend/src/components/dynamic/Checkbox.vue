<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
	title: { type: String, default: "" },
	value: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
});

const isChecked = ref(props.value);

/**
 * Toggle the checkbox
 */
const toggle = () => {
	if (!props.disabled) isChecked.value = !isChecked.value;
};
</script>

<template>
	<div
		class="dynamic-checkbox"
		:class="{ disabled: disabled }"
		@click="toggle">
		<div class="checkbox-box" :class="{ checked: isChecked }">
			<svg
				v-if="isChecked"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round">
				<polyline points="20 6 9 17 4 12"></polyline>
			</svg>
		</div>
		<span v-if="title" class="checkbox-label">{{ title }}</span>
	</div>
</template>

<style scoped>
.dynamic-checkbox {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 0.5rem 0;
	cursor: pointer;
	user-select: none;
}

.dynamic-checkbox.disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.checkbox-box {
	width: 20px;
	height: 20px;
	border: 2px solid #d1d5db;
	border-radius: 4px;
	background: white;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.checkbox-box.checked {
	background: #3b82f6;
	border-color: #3b82f6;
	color: white;
}

.checkbox-box svg {
	width: 14px;
	height: 14px;
}

.checkbox-label {
	font-size: 0.9rem;
	color: #374151;
	line-height: 1.2;
}
</style>
