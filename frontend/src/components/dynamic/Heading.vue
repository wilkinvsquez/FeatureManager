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
	margin: 1.5rem 0 1rem;
	line-height: 1.25;
	color: var(--text-main);
	font-weight: 800;
	letter-spacing: -0.02em;
}

h1.dynamic-heading {
	font-size: 2.5rem;
}
h2.dynamic-heading {
	font-size: 2rem;
}
h3.dynamic-heading {
	font-size: 1.5rem;
}
h4.dynamic-heading {
	font-size: 1.25rem;
}
</style>
