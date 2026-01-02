<script setup lang="ts">
import { ref, watch } from "vue";
import Arrow from "../../assets/icons/Arrow.vue";

const props = defineProps({
	title: { type: String, default: "Section" },
	defaultOpen: { type: Boolean, default: false },
	isCollapsed: { type: Boolean, default: undefined },
});

const isOpen = ref(
	props.isCollapsed !== undefined ? !props.isCollapsed : props.defaultOpen,
);

const toggle = () => (isOpen.value = !isOpen.value);

watch(
	() => props.isCollapsed,
	newVal => {
		if (newVal !== undefined) isOpen.value = !newVal;
	},
);
</script>
<template>
	<div class="dynamic-collapsible" :class="{ 'is-open': isOpen }">
		<button @click="toggle" class="collapsible-header">
			<span class="title">{{ props.title }}</span>
			<span class="icon-wrapper" :class="{ rotated: isOpen }">
				<Arrow />
			</span>
		</button>

		<transition name="expand">
			<div v-show="isOpen" class="collapsible-content">
				<div class="content-inner">
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>
<style scoped>
.dynamic-collapsible {
	border: 1px solid var(--border-color);
	border-radius: var(--radius-lg);
	margin-bottom: 1.5rem;
	background-color: var(--bg-card);
	overflow: hidden;
	box-shadow: var(--shadow-sm);
	transition: all var(--transition-normal);
}

.dynamic-collapsible.is-open {
	box-shadow: var(--shadow-md);
	border-color: var(--primary-300);
}

.collapsible-header {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.25rem 1.5rem;
	background: var(--bg-app);
	border: none;
	cursor: pointer;
	transition: all var(--transition-normal);
	text-align: left;
}

.collapsible-header:hover {
	background-color: var(--border-color);
}

.collapsible-header .title {
	font-weight: 700;
	font-size: 1.125rem;
	color: var(--text-main);
	letter-spacing: -0.01em;
}

.icon-wrapper {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform var(--transition-normal);
	color: var(--text-secondary);
}

.icon-wrapper.rotated {
	transform: rotate(180deg);
}

.chevron {
	width: 1.25rem;
	height: 1.25rem;
}

.collapsible-content {
	background-color: var(--bg-card);
}

.content-inner {
	display: flex;
	flex-direction: column;
	padding: 1.5rem;
	gap: 1rem;
}

.expand-enter-active,
.expand-leave-active {
	transition: all var(--transition-normal) ease-in-out;
	max-height: 2000px;
	opacity: 1;
}
.expand-enter-from,
.expand-leave-to {
	max-height: 0;
	opacity: 0;
	overflow: hidden;
}

[data-theme="dark"] .dynamic-collapsible.is-open {
	border-color: var(--primary-800);
}
</style>
