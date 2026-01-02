<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDark = ref(false);

const toggleTheme = () => {
	isDark.value = !isDark.value;
	const theme = isDark.value ? "dark" : "light";
	document.documentElement.setAttribute("data-theme", theme);
	localStorage.setItem("theme", theme);
};

onMounted(() => {
	const savedTheme = localStorage.getItem("theme");
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;

	if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
		isDark.value = true;
		document.documentElement.setAttribute("data-theme", "dark");
	} else {
		isDark.value = false;
		document.documentElement.setAttribute("data-theme", "light");
	}
});
</script>

<template>
	<button
		class="theme-toggle"
		@click="toggleTheme"
		:title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
		<div class="toggle-track">
			<div class="toggle-thumb" :class="{ 'is-dark': isDark }">
				<span v-if="!isDark" class="icon">☀️</span>
				<span v-else class="icon">🌙</span>
			</div>
		</div>
	</button>
</template>

<style scoped>
.theme-toggle {
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	outline: none;
	transition: transform var(--transition-fast);
}

.theme-toggle:hover {
	transform: scale(1.1);
}

.toggle-track {
	width: 56px;
	height: 28px;
	background-color: var(--border-color);
	border-radius: var(--radius-full);
	position: relative;
	transition: background-color var(--transition-normal);
	border: 1px solid var(--border-color);
}

.toggle-thumb {
	width: 24px;
	height: 24px;
	background-color: var(--bg-card);
	border-radius: var(--radius-full);
	position: absolute;
	top: 1px;
	left: 1px;
	transition: transform var(--transition-normal),
		background-color var(--transition-normal);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: var(--shadow-sm);
}

.toggle-thumb.is-dark {
	transform: translateX(28px);
	background-color: var(--primary-500);
}

.icon {
	font-size: 14px;
	user-select: none;
}

[data-theme="dark"] .toggle-track {
	background-color: var(--primary-900);
	border-color: var(--primary-800);
}
</style>
