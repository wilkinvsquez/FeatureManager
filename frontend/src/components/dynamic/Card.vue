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
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	margin-bottom: 1rem;
	border: 1px solid #e5e7eb;
	overflow: hidden;
	text-align: left;
	container-type: inline-size;
}
.card-header {
	padding: 1.5rem 1.5rem 0.5rem;
}
.card-title {
	margin: 0;
	font-size: 1.1rem;
	font-weight: 600;
	color: #111827; /* Gris oscuro casi negro */
}
.card-description {
	padding: 0 1.5rem 1rem;
	color: #6b7280;
	font-size: 0.875rem;
	line-height: 1.4;
}
.card-body {
	padding: 0 1.5rem 1.5rem;
}
</style>
