<script setup lang="ts">
const props = defineProps({
	content: {
		type: String,
		default: "",
	},
});
</script>

<template>
	<p class="dynamic-text">{{ props.content }}</p>
</template>
<style scoped>
.dynamic-text {
	line-height: 1.6;
	margin: 0.5rem 0;
}
</style>
