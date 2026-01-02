<script setup lang="ts">
import { ref } from "vue";
import FeatureManager from "./components/FeatureManager.vue";
import AssetList from "./components/AssetList.vue";
import DynamicUIDemo from "./components/dynamic/UIDemo.vue";
import ThemeToggle from "./components/ThemeToggle.vue";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

const currentView = ref<"assets" | "features" | "dynamic">("features");
</script>

<template>
	<Toast />
	<ConfirmDialog />
	<div class="app-wrapper">
		<header class="main-header">
			<div class="header-content">
				<div class="logo-area">
					<div class="logo-icon">🚀</div>
					<h1 class="app-title">Feature Manager</h1>
				</div>

				<nav class="nav-tabs">
					<button @click="currentView = 'features'" :class="{ active: currentView === 'features' }">
						Features
					</button>
					<button @click="currentView = 'assets'" :class="{ active: currentView === 'assets' }">
						Assets
					</button>
					<button @click="currentView = 'dynamic'" :class="{ active: currentView === 'dynamic' }">
						Dynamic Demo
					</button>
				</nav>

				<div class="header-actions">
					<ThemeToggle />
				</div>
			</div>
		</header>

		<main class="main-content">
			<div class="view-container fade-in" :key="currentView">
				<AssetList v-if="currentView === 'assets'" @navigate="currentView = $event" />
				<FeatureManager v-else-if="currentView === 'features'" />
				<DynamicUIDemo v-else />
			</div>
		</main>
	</div>
</template>

<style scoped>
.app-wrapper {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: var(--bg-app);
}

.main-header {
	background-color: var(--bg-card);
	border-bottom: 1px solid var(--border-color);
	padding: 0 2rem;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: var(--shadow-sm);
	backdrop-filter: blur(10px);
	background-color: var(--glass-bg);
}

.header-content {
	max-width: 1400px;
	margin: 0 auto;
	height: 72px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.logo-area {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-icon {
	font-size: 1.5rem;
}

.app-title {
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: -0.025em;
	background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.nav-tabs {
	display: flex;
	gap: 0.5rem;
	height: 100%;
}

.nav-tabs button {
	padding: 0 1.5rem;
	height: 100%;
	border: none;
	background: transparent;
	cursor: pointer;
	font-weight: 700;
	color: var(--text-secondary);
	transition: all var(--transition-normal);
	position: relative;
	font-size: 0.95rem;
	display: flex;
	align-items: center;
	overflow: hidden;
}

.nav-tabs button:after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 3px;
	background: linear-gradient(90deg, var(--primary-400), var(--primary-600));
	transition: all var(--transition-normal);
	border-radius: var(--radius-full) var(--radius-full) 0 0;
	transform: translateX(-50%);
}

.nav-tabs button.active {
	color: var(--primary-500);
	background: rgba(59, 130, 246, 0.03);
}

.nav-tabs button.active:after {
	width: 80%;
}

.nav-tabs button:hover:not(.active) {
	color: var(--text-main);
	background: rgba(0, 0, 0, 0.02);
}

.nav-tabs button::before {
	content: "";
	position: absolute;
	top: 50%;
	left: 50%;
	width: 100px;
	height: 100px;
	background: radial-gradient(circle, var(--primary-500) 0%, transparent 70%);
	transform: translate(-50%, -50%) scale(0);
	opacity: 0;
	transition: transform 0.5s, opacity 0.5s;
	pointer-events: none;
}

.nav-tabs button:hover::before {
	transform: translate(-50%, -50%) scale(1);
	opacity: 0.05;
}

.main-content {
	flex: 1;
	padding: 2rem;
	max-width: 1400px;
	margin: 0 auto;
	width: 100%;
}

.view-container {
	width: 100%;
}

@media (max-width: 768px) {
	.main-header {
		padding: 0 1rem;
	}

	.nav-tabs {
		display: none;
		/* Mobile menu needed eventually */
	}
}
</style>
