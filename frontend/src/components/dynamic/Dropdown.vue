<script setup lang="ts">
import { ref } from "vue";

interface Option {
	display: string;
	value: any;
}

const props = defineProps({
	title: { type: String, default: "" },
	value: { type: [String, Number, Object], default: "" },
	options: { type: Array as () => Option[], default: () => [] },
	placeholder: { type: String, default: "Select an option" },
});

const selectedValue = ref(props.value);
</script>

<template>
	<div class="dynamic-dropdown">
		<label v-if="title" class="dropdown-label">{{ title }}</label>
		<select v-model="selectedValue" class="dropdown-select">
			<option disabled value="">{{ placeholder }}</option>
			<option
				v-for="(option, index) in options"
				:key="index"
				:value="option.value">
				{{ option.display || option }}
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
	font-size: 0.9rem;
	font-weight: 500;
	color: #374151;
}

.dropdown-select {
	appearance: none;
	background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
	background-repeat: no-repeat;
	background-position: right 1rem center;
	background-size: 1em;
	padding: 0.75rem 1rem;
	padding-right: 2.5rem;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background-color: white;
	font-size: 0.95rem;
	color: #1f2937;
	cursor: pointer;
	outline: none;
	transition: border-color 0.2s;
}

.dropdown-select:focus {
	border-color: #3b82f6;
	box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
