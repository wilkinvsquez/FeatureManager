<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
	title: { type: String, default: "" },
	value: { type: String, default: "" },
	min: { type: String, default: "" },
	max: { type: String, default: "" },
});

const dateValue = ref(props.value);
</script>

<template>
	<div class="dynamic-input">
		<label v-if="title" class="input-label">{{ title }}</label>
		<input
			type="date"
			v-model="dateValue"
			:min="min"
			:max="max"
			class="input-field" />
	</div>
</template>

<style scoped>
.dynamic-input {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	margin: 0.5rem 0;
	width: 100%;
}

.input-label {
	font-size: 0.85rem;
	font-weight: 500;
	color: #374151;
}

.input-field {
	padding: 0.6rem 0.8rem;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 0.95rem;
	color: #1f2937;
	outline: none;
	font-family: inherit;
	transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
