<script setup lang="ts">
import { computed } from "vue";
import type { UIComponent } from "../../types/ui-component";
import { getComponent } from "./ComponentRegistry";

import Renderer from "./Renderer.vue";
interface Props {
	config: UIComponent;
}
const props = defineProps<Props>();
const component = computed(() => {
	return getComponent(props.config.type);
});
const children = computed(() => {
	return props.config.components || props.config.children || [];
});

const hasChildren = computed(() => {
	return children.value.length > 0;
});

const componentProps = computed(() => {
	const {
		style,
		props: configProps,
		children,
		components,
		type,
		...rest
	} = props.config;

	return {
		...configProps, // Soporte para el formato anterior
		...rest, // Propiedades directas (title, keyname, etc.)
		uiStyle: style, // Renombramos 'style' a 'uiStyle' para evitar conflictos con HTML nativo
	};
});
</script>
<template>
	<component v-if="component" :is="component" v-bind="componentProps">
		<!-- Recursión: renderiza hijos si existen -->
		<template v-if="hasChildren">
			<Renderer
				v-for="(child, index) in children"
				:key="index"
				:config="child" />
		</template>

		<!-- Si tiene texto directo (sin hijos) -->
		<template v-else-if="config.text">
			{{ config.text }}
		</template>
	</component>

	<!-- Fallback si el componente no existe -->
	<div v-else class="unknown-component">
		Unknown component type: {{ config.type }}
	</div>
</template>
<style scoped>
.unknown-component {
	padding: 1rem;
	background: #fee;
	border: 1px solid #fcc;
	color: #c33;
	border-radius: 4px;
}
</style>
