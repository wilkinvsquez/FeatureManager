<script setup lang="ts">
const props = defineProps({
	level: {
		type: Number,
		default: 2,
	},
	text: {
		type: String,
		default: "",
	},
});
</script>

<template>
	<component :is="`h${props.level}`" class="dynamic-heading">
		{{ props.text }}
	</component>
</template>
<style scoped>
.dynamic-heading {
	margin: 1rem 0;
	line-height: 1.2;
}
</style>
