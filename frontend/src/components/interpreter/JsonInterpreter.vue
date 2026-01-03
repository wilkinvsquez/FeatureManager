<template>
	<component v-for="(node, index) in nodes" :is="resolver.getComponentType(node)" v-bind="resolver.getComponentBindings(
		node,
		readOnly,
		isCollapsed,
		notification,
		moduleContext,
	)
		" :key="index">
		<template v-if="resolver.hasChildren(node)">
			<JsonInterpreter :nodes="resolver.getChildren(node)" :readOnly="readOnly" :isCollapsed="isCollapsed"
				:notification="notification" :moduleContext="moduleContext" />
		</template>
	</component>
</template>

<script setup lang="ts">
import { type PropType, ref, watch } from "vue";
import resolverService from "../../services/interpreter/ResolverService";

const resolver = resolverService;

const props = defineProps({
	nodes: {
		type: Array as PropType<Array<any>>,
		required: true,
	},
	readOnly: {
		type: Boolean,
		default: false,
	},
	isCollapsed: {
		type: Boolean,
		required: false,
	},
	notification: {
		type: Object,
		required: false,
	},
	moduleContext: {
		type: String,
		required: false,
	},
});

const readOnlyState = ref(props.readOnly);
const collapsedState = ref(props.isCollapsed);

watch(
	() => props.readOnly,
	(newValue: boolean) => {
		readOnlyState.value = newValue;
	},
);

watch(
	() => props.isCollapsed,
	(newValue: boolean) => {
		collapsedState.value = newValue;
	},
);
</script>

<style scoped>
/* Styles can be added here if needed */
</style>
