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
 * Container styles
 * @returns {CSSProperties}
 */
const containerStyles = computed((): CSSProperties => {
	const layout = props.uiStyle?.layout;
	if (!layout) return {};

	// Pasamos variables CSS dinámicas para usarlas en el @container query
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
	grid-template-columns: repeat(var(--cols, 1), minmax(0, 1fr));
	gap: var(--gap);
}

/* Responsive:only collapse when viewport < 450px */
@container (max-width: 450px) {
	.layout-grid {
		grid-template-columns: 1fr !important;
	}
}

/* === ROW LAYOUT === */
.layout-row {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: var(--gap);
	justify-content: var(--justify);
	align-items: center;
}

/* === COLUMN LAYOUT === */
.layout-column {
	display: flex;
	flex-direction: column;
	gap: var(--gap);
}
</style>
