<script lang="ts" setup>
	const theme = {
		button: {
			color: 'info',
		},
		input: {
			color: 'info',
		},
		textarea: {
			color: 'info',
		}
	}
</script>

<template>
	<NuxtRouteAnnouncer />
	<UApp>
		<UTheme :props="theme">
			<NuxtLayout>
				<UMain class="relative">
					<NuxtPage />
				</UMain>
			</NuxtLayout>
		</UTheme>
	</UApp>
</template>

<style>
html, body {
	&::-webkit-scrollbar { display: none; }
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
