<script setup lang="ts">
const props = defineProps({
	content: { type: String, default: "" },
	title: { type: String, default: "" },
});
</script>

<template>
	<p class="dynamic-text">{{ props.content || props.title }}</p>
</template>
<style scoped>
.dynamic-text {
	line-height: 1.7;
	margin: 0.75rem 0;
	color: var(--text-secondary);
	font-size: 0.9375rem;
}
</style>
