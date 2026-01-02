<script setup lang="ts">
import { watch, onUnmounted } from "vue";

const props = defineProps({
	isOpen: {
		type: Boolean,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
});
defineEmits(["close"]);

// Watch isOpen to toggle body scrolling
watch(
	() => props.isOpen,
	newValue => {
		if (newValue) {
			document.body.style.overflow = "hidden";
			document.documentElement.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
			document.documentElement.style.overflow = "";
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	document.body.style.overflow = "";
	document.documentElement.style.overflow = "";
});
</script>

<template>
	<Teleport to="body">
		<div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
			<div class="modal-content" @click.stop>
				<header>
					<h3>{{ title }}</h3>
					<button @click="$emit('close')" class="close-btn">
						&times;
					</button>
				</header>
				<div class="modal-body">
					<slot></slot>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	width: 100vw;
	height: 100vh;
	background: var(--glass-bg);
	backdrop-filter: blur(12px);
	display: grid;
	place-items: center;
	padding: 2rem;
	z-index: 10000;
	animation: fadeIn var(--transition-normal);
	overflow-y: auto;
}

.modal-content {
	background-color: var(--bg-card);
	padding: 3rem;
	border-radius: var(--radius-2xl);
	width: 95%;
	max-width: 700px;
	box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
	color: var(--text-main);
	border: 1px solid var(--border-color);
	animation: slideUp var(--transition-normal);
	position: relative;
	margin: auto; /* Final check for centering in grid */
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2.5rem;
}

.modal-body {
	width: 100%;
}

/* Custom scrollbar for modal body */
.modal-body::-webkit-scrollbar {
	width: 6px;
}

.modal-body::-webkit-scrollbar-track {
	background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
	background: var(--border-color);
	border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
	background: var(--text-muted);
}

header h3 {
	font-size: 1.75rem;
	font-weight: 800;
	letter-spacing: -0.02em;
	color: var(--text-main);
}

.close-btn {
	background-color: var(--bg-app);
	border: 1px solid var(--border-color);
	width: 36px;
	height: 36px;
	border-radius: var(--radius-full);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	cursor: pointer;
	color: var(--text-secondary);
	transition: all var(--transition-fast);
	flex-shrink: 0;
}

.close-btn:hover {
	background-color: var(--error);
	color: white;
	border-color: var(--error);
	transform: rotate(90deg);
}

@keyframes slideUp {
	from {
		transform: translateY(30px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

@media (max-width: 768px) {
	.modal-overlay {
		padding: 1rem;
	}

	.modal-content {
		padding: 1.5rem;
		border-radius: var(--radius-xl);
	}
}
</style>
