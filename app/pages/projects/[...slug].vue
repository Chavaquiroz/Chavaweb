<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

</script>


<template>
	<UContainer class="">
		<div class="h-24"></div>
		<h1 class="text-4xl font-bold text-center my-8">{{ page.title }}</h1>
		<div class="flex flex-col lg:flex-row gap-16">
			<div class="flex flex-col flex-2 gap-8">
				<div class="sm:px-10">
					<UCarousel
						v-slot="{ item }"
						loop
						arrows
						dots
						:autoplay="{ delay: 3000 }"
						:items="page.meta.images"
						:ui="{ item: 'basis-1/1' }"
					>
						<img :src="item"  class="w-full rounded-lg aspect-4/3 object-cover" loading="lazy">
					</UCarousel>
				</div>
				<div class="text-center text-blue-400 hover:underline text-xl mt-12 mb-4">
					<NuxtLink>Try it here</NuxtLink>
				</div>
				<div>
					<div class="flex gap-4 flex-wrap justify-center">
						<UIcon v-for="icon in page.meta.technologies"  :name="icon" class="size-10" />
					</div>
				</div>
			</div>
			<div class="flex flex-col flex-1">
				<ContentRenderer
					v-if="page"
					:value="page"
				/>
			</div>
		</div>
	</UContainer>
</template>

