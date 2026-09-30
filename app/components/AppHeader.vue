<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const links= ref<NavigationMenuItem[]>([
	{},
])

const route = useRoute()

</script>

<template>
	<div class="absolute top-0 w-full left-1/2 transform -translate-x-1/2 z-10">
		<div class="border-0 backdrop-blur-none bg-0 p-4">
			<NuxtLink href="/" class="font-mono text-xl font-bold">~{{ route.path }}</NuxtLink>

			<!-- <template #right> -->
			<!-- 	<ColorModeButton /> -->
			<!-- </template> -->
		</div>
	</div>
</template>
