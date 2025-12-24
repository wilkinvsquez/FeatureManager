<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
	title: { type: String, default: "Section" },
	defaultOpen: { type: Boolean, default: true },
});
const isOpen = ref(props.defaultOpen);
const toggle = () => (isOpen.value = !isOpen.value);
</script>
<template>
	<div class="dynamic-collapsible">
		<button @click="toggle" class="collapsible-header">
			<span class="title">{{ props.title }}</span>
			<span class="icon">{{ isOpen ? "▼" : "▶" }}</span>
		</button>

		<transition name="slide">
			<div v-show="isOpen" class="collapsible-content">
				<slot />
			</div>
		</transition>
	</div>
</template>
<style scoped>
.dynamic-collapsible {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	margin-bottom: 1rem;
	background: white;
	overflow: hidden;
	container-type: inline-size;
}
.collapsible-header {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 1.5rem;
	background: #f9fafb;
	border: none;
	border-bottom: 1px solid #e5e7eb;
	cursor: pointer;
	transition: background 0.2s;
	text-align: left;
}
.collapsible-header:hover {
	background: #f3f4f6;
}
.collapsible-header .title {
	font-weight: 600;
	font-size: 1.25rem;
	color: #1f2937;
}
.collapsible-content {
	padding: 1.5rem;
	background: white;
}
/* Animación simple */
.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s ease;
	max-height: 1000px;
	opacity: 1;
}
.slide-enter-from,
.slide-leave-to {
	max-height: 0;
	opacity: 0;
	padding: 0 1.5rem;
}
</style>
