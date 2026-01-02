<script setup lang="ts">
import { onMounted, computed, reactive } from "vue";
import { useFlagStore } from "../stores/flags.store";
import { useAssetStore } from "../stores/asset.store";
import JsonInterpreter from "./interpreter/JsonInterpreter.vue";

const flagStore = useFlagStore();
const assetStore = useAssetStore();

// Track collapsed state for each asset
const isCollapsed = reactive(new Map<string, boolean>());

onMounted(async () => {
	await Promise.all([flagStore.fetchFlags(), assetStore.fetchAssets()]);

	// Initialize collapsed state for all assets
	assetStore.assets.forEach((asset: any) => {
		if (asset.key) {
			isCollapsed.set(asset.key, true);
		}
	});
});

/**
 * Get serviceId from asset schema
 */
const getServiceId = (asset: any): string | null => {
	const raw = asset.schema as any;
	return raw.serviceId || (raw.document && raw.document.serviceId) || null;
};

/**
 * Filter assets based on the selected service ID (if any)
 */
const filteredAssets = computed(() => {
	if (!assetStore.assets) return [];

	if (!flagStore.currentServiceId) return assetStore.assets;

	return assetStore.assets.filter(asset => {
		const sId = getServiceId(asset);
		return sId === flagStore.currentServiceId;
	});
});

/**
 * Get asset document for rendering
 */
const getAssetDocument = (asset: any) => {
	const schema = asset.schema;
	if (schema && schema.document) {
		return schema.document;
	}
	return schema;
};
</script>

<template>
	<div class="manager-container">
		<header class="header">
			<div class="header-info">
				<h2 class="title text-gradient">Feature Management</h2>
				<p class="subtitle">
					Select a service to manage its dynamic features and assets.
				</p>
			</div>

			<div class="controls">
				<div class="select-wrapper">
					<select
						v-model="flagStore.currentServiceId"
						class="service-select">
						<option value="">All Services</option>
						<option
							v-for="id in flagStore.uniqueServiceIds"
							:key="id"
							:value="id">
							{{ id }}
						</option>
					</select>
					<div class="select-arrow">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
			</div>
		</header>

		<div
			v-if="flagStore.loading || assetStore.isLoading"
			class="loading-state">
			<div class="spinner"></div>
			<span>Loading components...</span>
		</div>

		<!-- Render Assets using JsonInterpreter -->
		<div class="assets-scroll-area">
			<div class="assets-container">
				<template v-for="asset in filteredAssets" :key="asset.id">
					<JsonInterpreter
						:nodes="[getAssetDocument(asset)]"
						:isCollapsed="isCollapsed.get(asset.key) ?? true"
						:moduleContext="asset.key"
						:readOnly="false" />
				</template>

				<div
					v-if="!assetStore.isLoading && filteredAssets.length === 0"
					class="empty-state">
					<div class="empty-icon">📁</div>
					<h3>No assets found</h3>
					<p>We couldn't find any assets matching your selection.</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.manager-container {
	height: 100%;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 3.5rem;
	gap: 2rem;
}

.title {
	font-size: 2.5rem;
	font-weight: 800;
	margin-bottom: 0.5rem;
	letter-spacing: -0.025em;
	color: var(--text-main);
}

.subtitle {
	color: var(--text-secondary);
	font-size: 1.125rem;
	font-weight: 500;
}

.text-gradient {
	background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
}

.controls {
	display: flex;
	gap: 1.5rem;
}

.select-wrapper {
	position: relative;
	min-width: 240px;
}

.service-select {
	width: 100%;
	padding: 0.8rem 2.75rem 0.8rem 1.25rem;
	border-radius: var(--radius-lg);
	border: 1px solid var(--border-color);
	background-color: var(--bg-card);
	color: var(--text-main);
	font-weight: 700;
	font-size: 0.95rem;
	appearance: none;
	cursor: pointer;
	transition: all var(--transition-normal);
	box-shadow: var(--shadow-sm);
	outline: none;
}

.service-select:hover {
	border-color: var(--primary-400);
	box-shadow: var(--shadow-md);
}

.service-select:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.select-arrow {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
	width: 1.25rem;
	height: 1.25rem;
	pointer-events: none;
	color: var(--text-secondary);
	transition: all var(--transition-fast);
}

.service-select:hover + .select-arrow {
	color: var(--primary-500);
}

.loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 7rem 2rem;
	gap: 1.5rem;
	color: var(--text-secondary);
}

.spinner {
	width: 52px;
	height: 52px;
	border: 5px solid var(--border-color);
	border-top-color: var(--primary-500);
	border-radius: 50%;
	animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.assets-container {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.empty-state {
	text-align: center;
	padding: 6rem 2rem;
	color: var(--text-secondary);
	background-color: var(--bg-card);
	border-radius: var(--radius-2xl);
	border: 2px dashed var(--border-color);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.25rem;
}

.empty-icon {
	font-size: 5rem;
	margin-bottom: 0.5rem;
	opacity: 0.5;
}

.empty-state h3 {
	font-size: 1.75rem;
	color: var(--text-main);
	font-weight: 800;
}

@media (max-width: 900px) {
	.header {
		flex-direction: column;
		align-items: flex-start;
		gap: 2rem;
	}

	.select-wrapper {
		min-width: 100%;
	}
}
</style>
