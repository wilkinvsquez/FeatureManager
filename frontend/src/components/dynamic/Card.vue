<script setup lang="ts">
const props = defineProps({
	title: { type: String, default: "" },
	description: { type: String, default: "" },
});
</script>
<template>
	<div class="dynamic-card">
		<div v-if="props.title" class="card-header">
			<h3 class="card-title">{{ props.title }}</h3>
		</div>
		<div v-if="props.description" class="card-description">
			{{ props.description }}
		</div>
		<div class="card-body">
			<slot />
		</div>
	</div>
</template>
<style scoped>
.dynamic-card {
	background-color: var(--bg-card);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-sm);
	margin-bottom: 1.5rem;
	border: 1px solid var(--border-color);
	overflow: hidden;
	text-align: left;
	transition: all var(--transition-normal);
	container-type: inline-size;
}

.dynamic-card:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-md);
	border-color: var(--primary-300);
}

.card-header {
	padding: 1.5rem 1.5rem 0.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.card-title {
	margin: 0;
	font-size: 1.125rem;
	font-weight: 700;
	color: var(--text-main);
	letter-spacing: -0.01em;
}

.card-description {
	padding: 0 1.5rem 1.25rem;
	color: var(--text-secondary);
	font-size: 0.9375rem;
	line-height: 1.6;
}

.card-body {
	padding: 0 1.5rem 1.5rem;
}

[data-theme="dark"] .dynamic-card:hover {
	border-color: var(--primary-700);
}
</style>
