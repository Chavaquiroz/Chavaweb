<template>
	<div class="bg-white dark:bg-slate-700 rounded-xl border-2 border-white dark:border-slate-700 shadow-lg">
		<div class="flex flex-row-reverse w-full gap-1 p-2">
			<UButton
				icon="i-lucide-x"
				color="error"
				size="xs"
				class="rounded-full"
			/>
			<UButton
				icon="i-lucide-maximize-2"
				color="neutral"
				size="xs"
				class="rounded-full bg-gray-400"
			/>
			<UButton
				icon="i-lucide-minus"
				color="neutral"
				size="xs"
				class="rounded-full bg-gray-400"
			/>
		</div>
		<slot />
	</div>
</template>

