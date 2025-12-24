<script setup lang="ts">
import { ref } from "vue";
import FeaturesList from "./components/FeaturesList.vue";
import DynamicUIDemo from "./components/dynamic/UIDemo.vue";
const currentView = ref<"features" | "dynamic">("dynamic");
</script>

<template>
	<div id="app">
		<nav class="nav-tabs">
			<button
				@click="currentView = 'features'"
				:class="{ active: currentView === 'features' }">
				Feature Flags
			</button>
			<button
				@click="currentView = 'dynamic'"
				:class="{ active: currentView === 'dynamic' }">
				Dynamic UI Demo
			</button>
		</nav>
		<FeaturesList v-if="currentView === 'features'" />
		<DynamicUIDemo v-else />
	</div>
</template>

<style scoped>
#app {
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
		Ubuntu, Cantarell, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	min-height: 100vh;
	background: #ffffff;
}
.nav-tabs {
	display: flex;
	gap: 0;
	background: #f3f4f6;
	padding: 1rem;
	border-bottom: 2px solid #e5e7eb;
}
.nav-tabs button {
	padding: 0.75rem 1.5rem;
	border: none;
	background: transparent;
	cursor: pointer;
	font-weight: 500;
	color: #6b7280;
	transition: all 0.3s ease;
	border-bottom: 3px solid transparent;
}
.nav-tabs button.active {
	color: #3b82f6;
	border-bottom-color: #3b82f6;
}
.nav-tabs button:hover {
	background: #e5e7eb;
}
</style>
