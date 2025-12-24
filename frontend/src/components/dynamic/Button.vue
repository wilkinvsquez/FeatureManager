<script setup lang="ts">
const props = defineProps<{
	title?: string;
	btnType?: "primary" | "secondary" | "danger" | "outlined";
	onClick?: (event: MouseEvent) => void;
}>();

/**
 * Handle click event
 * @param event - The click event
 */
const handleClick = (event: MouseEvent) => {
	if (props.onClick) {
		props.onClick(event);
	}
};
</script>
<template>
	<button
		:class="['dynamic-btn', props.btnType || 'primary']"
		@click="handleClick">
		{{ props.title || "Button" }}
	</button>
</template>

<style scoped>
.dynamic-btn {
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}
.primary {
	background: #3b82f6;
	color: white;
}
.secondary {
	background: #6b7280;
	color: white;
}
.danger {
	background: #ef4444;
	color: white;
}
.outlined {
	background: transparent;
	border: 2px solid #3b82f6;
	color: #3b82f6;
}
.outlined:hover {
	background: #eff6ff;
}
.dynamic-btn:hover {
	opacity: 0.9;
	transform: translateY(-2px);
}
</style>
