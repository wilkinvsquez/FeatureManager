<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import JsonInterpreter from "../interpreter/JsonInterpreter.vue";
import { useAssetStore } from "../../stores/asset.store";
import { useFlagStore } from "../../stores/flags.store";
import { SHOWCASE_ASSET } from "../../constants/showcase";

const toast = useToast();
const assetStore = useAssetStore();
const flagStore = useFlagStore();
const jsonInput = ref(JSON.stringify(SHOWCASE_ASSET, null, 2));

const parsedNodes = ref<any[]>([]);
const error = ref<string | null>(null);

const isDragging = ref(false);
const editorWidth = ref(50);
const currentAssetId = ref<string | null>(null);

/**
 * Parse JSON input to nodes array for JsonInterpreter
 */
const parseJson = () => {
	try {
		const raw = JSON.parse(jsonInput.value);
		const document = raw.document || raw;
		parsedNodes.value = [document];
		error.value = null;
	} catch (e: any) {
		console.error("UIDemo: Parse JSON Error:", e);
		error.value = e.message;
		parsedNodes.value = [];
	}
};

/**
 * Watch for changes in the asset schema from the store
 * Only update when switching to a different asset
 */
watch(() => assetStore.currentAsset, async newAsset => {
	if (newAsset && newAsset.id !== currentAssetId.value) {
		currentAssetId.value = newAsset.id;
		try {
			jsonInput.value = JSON.stringify(newAsset.schema, null, 2);
			parseJson();
			const rawSchema = newAsset.schema as any;
			if (rawSchema.serviceId) {
				await flagStore.fetchFlagsByServiceId(rawSchema.serviceId);
			}
		} catch (e) {
			console.error("UIDemo: Error parsing schema:", e);
		}
	}
},
	{ immediate: true },
);

/**
 * Recursively extract all flags from the schema
 */
const extractFlags = (component: any, serviceId: string, flags: any[] = []) => {
	if (!component) return flags;
	if (component.keyname) {
		let val = component.value;
		if (val === undefined) val = component.props || {};

		flags.push({
			keyname: component.keyname,
			serviceId,
			value: val,
			description: component.description || `Auto-generated for ${component.type}`,
		});
	}

	if (component.children) {
		component.children.forEach((c: any) => extractFlags(c, serviceId, flags));
	}
	if (component.components) {
		component.components.forEach((c: any) => extractFlags(c, serviceId, flags));
	}

	return flags;
};

/**
 * Start dragging editor to resize the playground width
 */
const startDrag = () => {
	isDragging.value = true;
	document.addEventListener("mousemove", onDrag);
	document.addEventListener("mouseup", stopDrag);
};

/**
 * Dragging editor to resize the playground width
 */
const onDrag = (e: MouseEvent) => {
	if (!isDragging.value) return;
	const container = document.querySelector(".playground") as HTMLElement;
	if (!container) return;

	const containerWidth = container.offsetWidth;
	const newWidth = (e.clientX / containerWidth) * 100;

	if (newWidth > 20 && newWidth < 80) editorWidth.value = newWidth;
};

/**
 * Stop dragging editor to resize the playground width
 */
const stopDrag = () => {
	isDragging.value = false;
	document.removeEventListener("mousemove", onDrag);
	document.removeEventListener("mouseup", stopDrag);
};

/**
 * Format JSON input to a UIComponent
 */
const formatJson = () => {
	try {
		const obj = JSON.parse(jsonInput.value);
		jsonInput.value = JSON.stringify(obj, null, 2);
		error.value = null;
	} catch (e: any) {
		error.value = "Cannot format invalid JSON";
	}
};

/**
 * Save changes to the asset schema
 */
const saveChanges = async () => {
	if (!assetStore.currentAsset) return toast.add({ severity: 'info', summary: 'No Asset', detail: 'No asset selected', life: 3000 });
	try {
		// Parse full schema to get serviceId and structure
		const schema = JSON.parse(jsonInput.value);
		const rawSchema = schema.document || schema;

		// 1. Save Asset
		await assetStore.saveAsset(assetStore.currentAsset.key, schema);

		// 2. Sync Flags (Auto-create/Update)
		const serviceId = schema.serviceId || rawSchema.serviceId;
		if (serviceId) {
			const flagsToSync = extractFlags(rawSchema, serviceId);
			if (flagStore.flags.length === 0) await flagStore.fetchFlags();

			let syncCount = 0;
			for (const f of flagsToSync) {
				const existing = flagStore.flags.find(
					ex =>
						ex.keyname === f.keyname && ex.serviceId === serviceId,
				);

				if (existing) {
					// Update if value changed
					if (
						JSON.stringify(existing.value) !==
						JSON.stringify(f.value)
					) {
						await flagStore.saveFlag({
							...existing,
							value: f.value,
						});
						syncCount++;
					}
				} else {
					// Create new
					await flagStore.saveFlag(f);
					syncCount++;
				}
			}
			if (syncCount > 0) console.log(`Synced ${syncCount} flags.`);
		}

		toast.add({ severity: 'success', summary: 'Success', detail: 'Asset Saved & Flags Synced Successfully!', life: 3000 });
	} catch (e: any) {
		console.error("UIDemo: Save Error:", e);
		toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving: ' + e.message, life: 5000 });
	}
};

parseJson();
watch(jsonInput, parseJson);
</script>
<template>
	<div class="playground fade-in" :style="{ gridTemplateColumns: `${editorWidth}% 8px 1fr` }">
		<!-- Left panel: Editor -->
		<div class="editor-pane">
			<div class="pane-header">
				<div class="header-left">
					<div class="header-title">
						<span class="icon">💻</span>
						<h3>JSON Configuration</h3>
					</div>
					<div v-if="error" class="status-badge error">
						Invalid JSON
					</div>
					<div v-else class="status-badge success">Live Sync</div>
				</div>
				<div class="header-actions">
					<button @click="
						jsonInput = JSON.stringify(SHOWCASE_ASSET, null, 2)
						" class="ghost-btn danger-hover">
						Reset
					</button>
					<button @click="formatJson" class="ghost-btn">
						Format
					</button>
					<button @click="saveChanges" class="save-btn-premium" :disabled="!!error">
						<span class="icon">💾</span>
						Save
					</button>
				</div>
			</div>
			<div class="editor-container">
				<textarea v-model="jsonInput" class="code-editor" spellcheck="false"></textarea>
				<div v-if="error" class="error-toast">
					<span class="error-icon">⚠️</span>
					{{ error }}
				</div>
			</div>
		</div>

		<!-- Resizer Handle -->
		<div class="resizer" @mousedown="startDrag" :class="{ active: isDragging }">
			<div class="resizer-handle"></div>
		</div>

		<!-- Right panel: Preview -->
		<div class="preview-pane">
			<div class="pane-header">
				<div class="header-title">
					<span class="icon">👁️</span>
					<h3>Live Preview</h3>
				</div>
				<div class="preview-zoom">100%</div>
			</div>
			<div class="preview-content custom-scrollbar">
				<div class="preview-inner">
					<JsonInterpreter v-if="parsedNodes.length > 0" :nodes="parsedNodes" :readOnly="false"
						:isCollapsed="false" :moduleContext="'demo-' + (currentAssetId || 'showcase')
							" />
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped>
.playground {
	display: grid;
	height: calc(100vh - 120px);
	gap: 0;
	background-color: var(--border-color);
	border-radius: var(--radius-xl);
	overflow: hidden;
	box-shadow: var(--shadow-xl);
	margin-top: 1rem;
	border: 1px solid var(--border-color);
}

.resizer {
	width: 8px;
	background-color: var(--bg-app);
	cursor: col-resize;
	transition: all var(--transition-normal);
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: center;
	border-left: 1px solid var(--border-color);
	border-right: 1px solid var(--border-color);
}

@media (max-width: 1100px) {
	.playground {
		display: flex;
		flex-direction: column;
		height: auto;
		min-height: calc(100vh - 120px);
	}

	.resizer {
		display: none;
	}

	.editor-pane,
	.preview-pane {
		height: 600px;
	}
}

.resizer:hover,
.resizer.active {
	background-color: var(--primary-500);
}

.resizer-handle {
	width: 2px;
	height: 32px;
	background-color: var(--border-color);
	border-radius: var(--radius-full);
	transition: all var(--transition-normal);
}

.resizer:hover .resizer-handle,
.resizer.active .resizer-handle {
	background-color: white;
	height: 48px;
}

.editor-pane,
.preview-pane {
	background-color: var(--bg-card);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.pane-header {
	padding: 1rem 1.5rem;
	background-color: var(--bg-card);
	border-bottom: 1px solid var(--border-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 64px;
	flex-wrap: wrap;
	gap: 1rem;
}

.header-left {
	display: flex;
	gap: 1.5rem;
	align-items: center;
}

.header-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.header-title .icon {
	font-size: 1.25rem;
}

.header-title h3 {
	margin: 0;
	font-size: 0.875rem;
	text-transform: uppercase;
	font-weight: 800;
	letter-spacing: 0.05em;
	color: var(--text-secondary);
}

.header-actions {
	display: flex;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.ghost-btn {
	padding: 0.6rem 1.2rem;
	font-size: 0.8125rem;
	font-weight: 700;
	background: var(--bg-card);
	color: var(--text-secondary);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-lg);
	cursor: pointer;
	transition: all var(--transition-normal);
	box-shadow: var(--shadow-sm);
	backdrop-filter: blur(8px);
	position: relative;
	overflow: hidden;
	white-space: nowrap;
}

.ghost-btn::after {
	content: "";
	position: absolute;
	top: -50%;
	left: -60%;
	width: 40%;
	height: 200%;
	background: linear-gradient(to right,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0) 100%);
	transform: rotate(30deg);
	transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
	pointer-events: none;
	opacity: 0;
}

.ghost-btn:hover {
	background-color: var(--bg-app);
	color: var(--primary-600);
	border-color: var(--primary-400);
	box-shadow: var(--shadow-md);
	transform: translateY(-1px);
}

.ghost-btn:hover::after {
	left: 120%;
	opacity: 1;
}

.ghost-btn.danger-hover:hover {
	background-color: rgba(239, 68, 68, 0.05);
	color: var(--error);
	border-color: var(--error);
}

.save-btn-premium {
	padding: 0.6rem 1.75rem;
	font-size: 0.875rem;
	font-weight: 800;
	background: linear-gradient(145deg, var(--primary-500), var(--primary-600));
	color: white;
	border: none;
	border-radius: var(--radius-lg);
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.6rem;
	transition: all var(--transition-normal);
	box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2),
		0 2px 4px -2px rgba(59, 130, 246, 0.1),
		inset 0 1px 0 rgba(255, 255, 255, 0.2);
	position: relative;
	overflow: hidden;
	white-space: nowrap;
}

.save-btn-premium::after {
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

.save-btn-premium:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3),
		0 4px 6px -4px rgba(59, 130, 246, 0.3);
}

.save-btn-premium:hover:not(:disabled)::after {
	left: 120%;
	opacity: 1;
}

.save-btn-premium:active:not(:disabled) {
	transform: translateY(0) scale(0.96);
}

.save-btn-premium:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	filter: grayscale(1);
}

.status-badge {
	font-size: 0.6875rem;
	padding: 0.25rem 0.75rem;
	border-radius: var(--radius-full);
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.025em;
}

.status-badge.success {
	background-color: rgba(16, 185, 129, 0.1);
	color: var(--success);
	border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-badge.error {
	background-color: rgba(239, 68, 68, 0.1);
	color: var(--error);
	border: 1px solid rgba(239, 68, 68, 0.2);
}

.editor-container {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
}

.code-editor {
	flex: 1;
	padding: 1.5rem;
	font-family: "JetBrains Mono", "Fira Code", monospace;
	font-size: 14px;
	line-height: 1.6;
	border: none;
	resize: none;
	background-color: #1a1a1a;
	color: #e0e0e0;
	outline: none;
}

.error-toast {
	position: absolute;
	bottom: 1rem;
	left: 1rem;
	right: 1rem;
	background-color: var(--error);
	color: white;
	padding: 1rem 1.25rem;
	border-radius: var(--radius-lg);
	font-size: 0.875rem;
	font-weight: 600;
	box-shadow: var(--shadow-xl);
	display: flex;
	align-items: center;
	gap: 0.75rem;
	animation: slideInBottom var(--transition-normal);
}

.preview-content {
	flex: 1;
	padding: 0;
	overflow-y: auto;
	background-color: var(--bg-app);
}

.preview-inner {
	max-width: 900px;
	margin: 0 auto;
	padding: 3rem 2rem;
}

@media (max-width: 600px) {
	.pane-header {
		padding: 1rem;
	}

	.preview-inner {
		padding: 1.5rem 1rem;
	}

	.header-left {
		gap: 0.75rem;
	}
}

.preview-zoom {
	font-size: 0.75rem;
	font-weight: 700;
	color: var(--text-muted);
}

@keyframes slideInBottom {
	from {
		transform: translateY(100%);
		opacity: 0;
	}

	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* Scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
	width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: var(--border-color);
	border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: var(--text-muted);
}
</style>
