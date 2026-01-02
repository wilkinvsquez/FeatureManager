<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useAssetStore } from "../stores/asset.store";
import Modal from "./Modal.vue";
import type { Asset } from "../types/asset";

const toast = useToast();
const confirm = useConfirm();
const store = useAssetStore();
const isModalOpen = ref(false);
const emit = defineEmits(["navigate"]);

const assets = computed(() => store.assets);

const newKey = ref("");
const newJson = ref(
	'{\n  "document": {\n    "type": "card",\n    "title": "New Asset"\n  }\n}',
);

onMounted(async () => {
	console.log("[AssetList] Store methods:", Object.keys(store));
	if (typeof store.deleteAsset !== "function") {
		console.error("[AssetList] deleteAsset is NOT a function on store!");
	}
	await store.fetchAssets();
});

/**
 * Handle asset creation
 */
const handleCreate = async () => {
	try {
		const schema = JSON.parse(newJson.value);
		await store.saveAsset(newKey.value, schema);
		isModalOpen.value = false;
		toast.add({ severity: 'success', summary: 'Created', detail: 'Asset created successfully!', life: 3000 });
		await store.fetchAssets();
		emit("navigate", "dynamic");
	} catch (e) {
		toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid JSON or Error saving', life: 5000 });
	}
};

/**
 * Handle asset editing
 */
const handleEdit = (asset: Asset) => {
	store.currentAsset = asset;
	emit("navigate", "dynamic");
};

/**
 * Handle asset deletion
 */
const handleDelete = (asset: Asset) => {
	confirm.require({
		message: `Are you sure you want to delete the asset "${asset.key}"? This action cannot be undone.`,
		header: 'Confirm Deletion',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: {
			label: 'Cancel',
			severity: 'secondary',
			outlined: true
		},
		acceptProps: {
			label: 'Delete',
			severity: 'danger'
		},
		accept: async () => {
			try {
				await store.deleteAsset(asset.key);
				toast.add({
					severity: 'success',
					summary: 'Deleted',
					detail: `Asset "${asset.key}" deleted successfully`,
					life: 3000
				});
			} catch (e: any) {
				toast.add({
					severity: 'error',
					summary: 'Delete Error',
					detail: 'Error deleting asset: ' + e.message,
					life: 5000
				});
			}
		}
	});
};
</script>

<template>
	<div class="assets-container">
		<header class="header">
			<div class="header-info">
				<h2 class="title text-gradient">Asset Repository</h2>
				<p class="subtitle">
					Manage and preview your dynamic JSON assets.
				</p>
			</div>
			<button @click="isModalOpen = true" class="primary-btn">
				<span class="icon">+</span>
				<span>Create Asset</span>
			</button>
		</header>

		<div v-if="assets.length === 0" class="empty-state">
			<div class="empty-icon">📂</div>
			<h3>No assets yet</h3>
			<p>Create your first asset to start building dynamic interfaces.</p>
			<button @click="isModalOpen = true" class="primary-btn">
				Create Asset
			</button>
		</div>

		<div v-else class="assets-grid">
			<div v-for="asset in assets" :key="asset.key" class="asset-card fade-in">
				<div class="asset-badge">JSON</div>
				<button @click.stop="handleDelete(asset)" class="delete-asset-btn" title="Delete Asset">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						class="trash-icon">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>
				<div class="asset-main">
					<h3 class="asset-key">{{ asset.key }}</h3>
					<div class="asset-meta">
						<span class="version-tag">v{{ asset.version || 1 }}</span>
						<span class="dot"></span>
						<span class="updated-date">Recently updated</span>
					</div>
				</div>
				<button @click="handleEdit(asset)" class="edit-btn">
					<span>Edit & Preview</span>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						class="arrow-icon">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
							d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Modal de Creación -->
		<Modal :isOpen="isModalOpen" title="Create New Asset" @close="isModalOpen = false">
			<div class="modal-form">
				<div class="form-group">
					<label>Asset Key (ID)</label>
					<input v-model="newKey" placeholder="e.g. landing-page-v2" class="form-input" />
					<p class="input-hint">
						Unique identifier for this asset schema.
					</p>
				</div>
				<div class="form-group">
					<label>JSON Structure</label>
					<textarea v-model="newJson" rows="12" class="form-textarea"></textarea>
				</div>
				<div class="modal-actions">
					<button @click="handleCreate" class="primary-btn full-width">
						Create Asset
					</button>
				</div>
			</div>
		</Modal>
	</div>
</template>

<style scoped>
.assets-container {
	max-width: 1000px;
	margin: 0 auto;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 3rem;
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

.primary-btn {
	background: linear-gradient(145deg, var(--primary-500), var(--primary-600));
	color: white;
	padding: 0.8rem 1.75rem;
	border-radius: var(--radius-lg);
	border: none;
	font-weight: 700;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	transition: all var(--transition-normal);
	box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2),
		0 2px 4px -2px rgba(59, 130, 246, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.2);
	position: relative;
	overflow: hidden;
}

.primary-btn::after {
	content: "";
	position: absolute;
	top: -50%;
	left: -60%;
	width: 40%;
	height: 200%;
	background: linear-gradient(to right,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.3) 50%,
			rgba(255, 255, 255, 0) 100%);
	transform: rotate(30deg);
	transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	pointer-events: none;
	opacity: 0;
}

.primary-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3),
		0 4px 6px -4px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover::after {
	left: 120%;
	opacity: 1;
}

.primary-btn:active {
	transform: translateY(0) scale(0.96);
}

.full-width {
	width: 100%;
}

.assets-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 1.5rem;
}

.asset-card {
	background-color: var(--bg-card);
	padding: 1.75rem;
	border: 1px solid var(--border-color);
	border-radius: var(--radius-xl);
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	transition: all var(--transition-normal);
	box-shadow: var(--shadow-sm);
	position: relative;
	overflow: hidden;
}

.asset-card:hover {
	transform: translateY(-4px);
	border-color: var(--primary-400);
	box-shadow: var(--shadow-lg);
}

.asset-badge {
	position: absolute;
	top: 0;
	left: 0;
	background: var(--primary-500);
	color: white;
	font-size: 0.625rem;
	font-weight: 900;
	padding: 4px 10px;
	border-radius: 0 0 var(--radius-md) 0;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.asset-key {
	font-size: 1.375rem;
	font-weight: 800;
	color: var(--text-main);
	margin: 0.5rem 0 0.25rem 0;
	letter-spacing: -0.01em;
}

.asset-meta {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.version-tag {
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--primary-600);
	background-color: rgba(59, 130, 246, 0.1);
	padding: 2px 10px;
	border-radius: var(--radius-full);
}

.dot {
	width: 4px;
	height: 4px;
	background-color: var(--border-color);
	border-radius: 50%;
}

.updated-date {
	font-size: 0.75rem;
	color: var(--text-muted);
	font-weight: 500;
}

.delete-asset-btn {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: transparent;
	border: none;
	padding: 0.5rem;
	border-radius: var(--radius-md);
	color: var(--text-muted);
	cursor: pointer;
	transition: all var(--transition-normal);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 5;
}

.trash-icon {
	width: 1.25rem;
	height: 1.25rem;
}

.delete-asset-btn:hover {
	background-color: rgba(239, 68, 68, 0.1);
	color: var(--error);
	transform: scale(1.1);
}

.edit-btn {
	background-color: var(--bg-app);
	border: 1px solid var(--border-color);
	padding: 0.8rem 1.25rem;
	border-radius: var(--radius-lg);
	cursor: pointer;
	color: var(--text-secondary);
	transition: all var(--transition-normal);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	font-weight: 700;
	font-size: 0.9rem;
	width: 100%;
}

.edit-btn:hover {
	border-color: var(--primary-500);
	color: var(--primary-600);
	background-color: var(--bg-card);
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.arrow-icon {
	width: 1.125rem;
	height: 1.125rem;
	transition: transform var(--transition-normal);
}

.edit-btn:hover .arrow-icon {
	transform: translateX(4px);
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

/* Modal Form styling */
.modal-form {
	display: flex;
	flex-direction: column;
	gap: 1.75rem;
	padding: 0.5rem 0;
}

.form-group label {
	display: block;
	margin-bottom: 0.6rem;
	font-weight: 700;
	color: var(--text-main);
	font-size: 0.95rem;
}

.form-input {
	width: 100%;
	padding: 0.8rem 1.125rem;
	border: 1px solid var(--border-color);
	border-radius: var(--radius-lg);
	background-color: var(--bg-input);
	color: var(--text-main);
	outline: none;
	transition: all var(--transition-fast);
	font-size: 1rem;
}

.form-input:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
	width: 100%;
	padding: 1.25rem;
	border: 1px solid var(--border-color);
	border-radius: var(--radius-lg);
	background-color: var(--bg-input);
	color: var(--text-main);
	outline: none;
	font-family: "JetBrains Mono", "Fira Code", monospace;
	font-size: 0.9rem;
	line-height: 1.6;
	resize: vertical;
	transition: all var(--transition-fast);
}

.form-textarea:focus {
	border-color: var(--primary-500);
	box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-hint {
	font-size: 0.8rem;
	color: var(--text-muted);
	margin-top: 0.6rem;
}

@media (max-width: 768px) {
	.header {
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
	}

	.primary-btn {
		width: 100%;
	}

	.assets-grid {
		grid-template-columns: 1fr;
	}
}
</style>
