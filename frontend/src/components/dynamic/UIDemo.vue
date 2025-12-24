<script setup lang="ts">
import { ref, watch } from "vue";
import DynamicRenderer from "../dynamic/Renderer.vue";
import type { UIComponent } from "../../types/ui-component";

const jsonInput = ref(
	JSON.stringify(
		{
			serviceId: "SMART_HOME_DEMO",
			document: {
				style: {
					layout: { type: "column", gap: "2rem" },
				},
				type: "container",
				components: [
					{
						type: "container",
						style: { layout: { type: "column", gap: "0.5rem" } },
						components: [
							{
								type: "heading",
								level: 1,
								text: "🏠 Smart Home Control",
							},
							{
								type: "text",
								text: "Manage your environment from a single dynamic interface.",
							},
						],
					},
					{
						type: "container",
						style: {
							layout: { type: "grid", columns: 3, gap: "1.5rem" },
						},
						components: [
							{
								type: "card",
								title: "🛋️ Living Room",
								description: "Entertainment & Comfort",
								components: [
									{
										type: "container",
										style: {
											layout: {
												type: "column",
												gap: "1rem",
											},
										},
										components: [
											{
												type: "toggle",
												title: "Master Lights",
												value: true,
											},
											{
												type: "dropdown",
												title: "Ambiance Mode",
												value: "relax",
												options: [
													{
														display: "Relaxing",
														value: "relax",
													},
													{
														display: "Movie Night",
														value: "movie",
													},
													{
														display: "Focus / Work",
														value: "focus",
													},
												],
											},
											{
												type: "collapsible",
												title: "🌡️ Climate Control",
												components: [
													{
														type: "input",
														title: "Temperature (°C)",
														value: 22,
														inputType: "number",
													},
													{
														type: "checkbox",
														title: "Eco Mode (Save Energy)",
														value: true,
													},
												],
											},
										],
									},
								],
							},
							{
								type: "card",
								title: "🛡️ Security System",
								description: "Status: ARMED",
								components: [
									{
										type: "toggle",
										title: "Arm System",
										value: true,
									},
									{ type: "text", text: "Active Sensors:" },
									{
										type: "container",
										style: {
											layout: {
												type: "grid",
												columns: 2,
											},
										},
										components: [
											{
												type: "checkbox",
												title: "Front Door",
												value: true,
												disabled: true,
											},
											{
												type: "checkbox",
												title: "Back Door",
												value: true,
												disabled: true,
											},
											{
												type: "checkbox",
												title: "Garage",
												value: false,
												disabled: true,
											},
											{
												type: "checkbox",
												title: "Windows",
												value: true,
												disabled: true,
											},
										],
									},
									{
										type: "date",
										title: "Schedule Vacation Mode",
										value: "2025-12-25",
									},
								],
							},
							{
								type: "card",
								title: "📶 Connectivity",
								description: "Network Management",
								components: [
									{
										type: "input",
										title: "SSID Name",
										value: "SkyNet_5G",
									},
									{
										type: "input",
										title: "Admin Password",
										value: "secure123",
										inputType: "password",
									},
									{
										type: "container",
										style: {
											layout: {
												type: "row",
												justifyContent: "space-between",
												alignItems: "center",
											},
										},
										components: [
											{
												type: "text",
												text: "Guest Network",
											},
											{ type: "toggle", value: false },
										],
									},
									{
										type: "button",
										title: "Run Speed Test",
										btnType: "outlined",
									},
								],
							},
						],
					},
					{
						type: "container",
						style: {
							layout: {
								type: "row",
								justifyContent: "center",
								gap: "1rem",
							},
						},
						components: [
							{
								type: "button",
								title: "Reset All Systems",
								btnType: "danger",
							},
							{
								type: "button",
								title: "Save Configuration",
								btnType: "primary",
							},
						],
					},
				],
			},
		},
		null,
		2,
	),
);

const parsedConfig = ref<UIComponent | null>(null);
const error = ref<string | null>(null);

const isDragging = ref(false);
const editorWidth = ref(50);

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
 * Parse JSON input to a UIComponent
 */
const parseJson = () => {
	try {
		const raw = JSON.parse(jsonInput.value);
		parsedConfig.value = raw.document || raw;
		error.value = null;
	} catch (e: any) {
		error.value = e.message;
	}
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

parseJson();
watch(jsonInput, parseJson);
</script>
<template>
	<div
		class="playground"
		:style="{ gridTemplateColumns: `${editorWidth}% 4px 1fr` }">
		<!-- Left panel: Editor -->
		<div class="editor-pane">
			<div class="pane-header">
				<div class="header-left">
					<h3>JSON Configuration</h3>
					<span v-if="error" class="status error">Invalid JSON</span>
					<span v-else class="status success">Live</span>
				</div>
				<button @click="formatJson" class="format-btn">Format</button>
			</div>
			<textarea
				v-model="jsonInput"
				class="code-editor"
				spellcheck="false"></textarea>
			<div v-if="error" class="error-msg">{{ error }}</div>
		</div>

		<!-- Resizer Handle -->
		<div
			class="resizer"
			@mousedown="startDrag"
			:class="{ active: isDragging }"></div>

		<!-- Right panel: Preview -->
		<div class="preview-pane">
			<div class="pane-header">
				<h3>Live Preview</h3>
			</div>
			<div class="preview-content">
				<DynamicRenderer v-if="parsedConfig" :config="parsedConfig" />
			</div>
		</div>
	</div>
</template>
<style scoped>
.playground {
	display: grid;
	height: calc(100vh - 60px);
	gap: 0;
	background: #e5e7eb;
}

.resizer {
	width: 4px;
	background: #e5e7eb;
	cursor: col-resize;
	transition: background 0.2s;
	z-index: 10;
}

.resizer:hover,
.resizer.active {
	background: #3b82f6;
}

.editor-pane,
.preview-pane {
	background: white;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	container-type: inline-size;
}
.pane-header {
	padding: 1rem;
	background: #f8f9fa;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.header-left {
	display: flex;
	gap: 1rem;
	align-items: center;
}
.pane-header h3 {
	margin: 0;
	font-size: 0.9rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #6b7280;
}
.format-btn {
	padding: 0.25rem 0.75rem;
	font-size: 0.8rem;
	background: #e5e7eb;
	color: #374151;
	border: 1px solid #d1d5db;
	border-radius: 4px;
}
.format-btn:hover {
	background: #d1d5db;
	border-color: #9ca3af;
}
.code-editor {
	flex: 1;
	padding: 1rem;
	font-family: "Fira Code", "Consolas", monospace;
	font-size: 14px;
	line-height: 1.5;
	border: none;
	resize: none;
	background: #1e1e1e;
	color: #d4d4d4;
	outline: none;
}
.preview-content {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
	background: #ffffff;
}
.status {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-weight: bold;
}
.status.success {
	background: #dcfce7;
	color: #166534;
}
.status.error {
	background: #fee2e2;
	color: #991b1b;
}
.error-msg {
	background: #fee2e2;
	color: #991b1b;
	padding: 0.5rem;
	font-size: 0.8rem;
	font-family: monospace;
}

/* Deep styles for the hero card */
:deep(.hero-card) {
	text-align: center;
	padding: 3rem;
	background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
	color: white;
	border-radius: 12px;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
:deep(.actions) {
	display: flex;
	gap: 1rem;
	justify-content: center;
	margin-top: 2rem;
}
:deep(h1) {
	margin-bottom: 0.5rem;
}
</style>
