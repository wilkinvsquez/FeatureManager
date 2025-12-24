<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
	title: { type: String, default: "" },
	value: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
});

const isChecked = ref(props.value);

const toggle = () => {
	if (!props.disabled) {
		isChecked.value = !isChecked.value;
	}
};
</script>

<template>
	<div class="dynamic-toggle-wrapper">
		<div
			class="toggle-switch"
			:class="{ active: isChecked, disabled: disabled }"
			@click="toggle">
			<div class="toggle-track"></div>
			<div class="toggle-thumb"></div>
		</div>
		<span v-if="title" class="toggle-label">{{ title }}</span>
	</div>
</template>

<style scoped>
.dynamic-toggle-wrapper {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin: 0.5rem 0;
}

.toggle-switch {
	position: relative;
	width: 44px;
	height: 24px;
	cursor: pointer;
	user-select: none;
}

.toggle-switch.disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.toggle-track {
	width: 100%;
	height: 100%;
	background-color: #d1d5db;
	border-radius: 99px;
	transition: background-color 0.2s ease;
}

.active .toggle-track {
	background-color: #3b82f6;
}

.toggle-thumb {
	position: absolute;
	top: 2px;
	left: 2px;
	width: 20px;
	height: 20px;
	background-color: white;
	border-radius: 50%;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	transition: transform 0.2s ease;
}

.active .toggle-thumb {
	transform: translateX(20px);
}

.toggle-label {
	font-size: 0.9rem;
	color: #374151;
	/* Wraps text nicely in small columns */
	line-height: 1.2;
	flex: 1;
	word-break: break-word;
}
</style>
