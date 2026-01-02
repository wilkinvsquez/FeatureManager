<script setup lang="ts">
import { computed } from "vue";
import type { CSSProperties } from "vue";
import type { UIComponentStyle } from "../../types/ui-component";

interface Props {
	className?: string;
	uiStyle?: UIComponentStyle;
}
const props = defineProps<Props>();

/**
 * Container styles to be applied to the container
 * @returns {CSSProperties}
 */
const containerStyles = computed((): CSSProperties => {
	const layout = props.uiStyle?.layout;
	if (!layout) return {};

	const vars: Record<string, string | number> = {
		"--gap": layout.gap || "1rem",
		"--justify": layout.justifyContent || "flex-start",
	};

	if (layout.type === "grid") {
		vars["--cols"] = layout.columns || 1;
	}

	return vars;
});

/**
 * Layout class used in the template to apply the correct layout
 * @returns {string} - The layout class
 */
const layoutClass = computed(() => {
	return props.uiStyle?.layout?.type
		? `layout-${props.uiStyle.layout.type}`
		: "";
});
</script>

<template>
	<div
		:class="['dynamic-container', props.className, layoutClass]"
		:style="containerStyles">
		<slot />
	</div>
</template>

<style scoped>
.dynamic-container {
	width: 100%;
	box-sizing: border-box;
	container-type: inline-size;
}

/* === GRID LAYOUT === */
.layout-grid {
	display: grid;
	grid-template-columns: repeat(var(--cols, 1), 1fr);
	gap: var(--gap, 1.5rem);
}

/* Responsive: collapse to 1 column on small containers */
@container (max-width: 700px) {
	.layout-grid[style*="--cols: 3"],
	.layout-grid[style*="--cols: 4"] {
		grid-template-columns: repeat(2, 1fr) !important;
	}
}

/* Responsive: collapse to 1 column on small containers */
@container (max-width: 480px) {
	.layout-grid {
		grid-template-columns: 1fr !important;
		gap: 1rem !important;
	}
}

/* === ROW LAYOUT === */
.layout-row {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: var(--gap, 1.25rem);
	justify-content: var(--justify);
	align-items: center;
}

/* === COLUMN LAYOUT === */
.layout-column {
	display: flex;
	flex-direction: column;
	gap: var(--gap, 1.25rem);
}
</style>
