<script setup lang="ts">
import { computed } from "vue";
import type { UIComponent } from "../../types/ui-component";
import { getComponent } from "./ComponentRegistry";
import { useFlagStore } from "../../stores/flags.store";

import Renderer from "./Renderer.vue";

interface Props {
	config: UIComponent;
}

const props = defineProps<Props>();

/**
 * Component to render
 */
const component = computed(() => {
	return getComponent(props.config.type);
});

/**
 * Children components
 */
const children = computed(() => {
	return props.config.components || props.config.children || [];
});

/**
 * Has children
 */
const hasChildren = computed(() => {
	return children.value.length > 0;
});

/**
 * Component props to pass to each component on the tree
 */
const componentProps = computed(() => {
	const { style, props: configProps, children, components, type, keyname, ...rest } = props.config;
	let finalProps = { ...configProps, ...rest, keyname, uiStyle: style };

	if (keyname) {
		const store = useFlagStore();
		const flag = store.flags.find(f => f.keyname === keyname);

		if (flag) {
			console.log(`[Renderer] Injected flag for ${keyname}:`, flag.value);
			if (typeof flag.value === "object" && flag.value !== null)
				finalProps = { ...finalProps, ...flag.value };
			else finalProps.value = flag.value;
		}
	}

	return finalProps;
});
</script>
<template>
	<component v-if="component" :is="component" v-bind="componentProps">
		<template v-if="hasChildren">
			<Renderer v-for="(child, index) in children" :key="index" :config="child" />
		</template>

		<template v-else-if="config.text">
			{{ config.text }}
		</template>
	</component>

	<div v-else class="unknown-component"> Unknown component type: {{ config.type }} </div>
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
