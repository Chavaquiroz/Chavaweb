<script setup lang="ts">
	import type { BlogPostsProps } from '@nuxt/ui'

	const { data: rawposts } = await useAsyncData('posts-list', () => queryCollection('posts').all())
	const posts = ref<BlogPostsProps[]>(rawposts.value)

	const { data: index } = await useAsyncData('index', () => queryCollection('index').first())
	console.log(index.value)
</script>

<template>
	<div>
		<UBlogPosts>
			<UBlogPost
				v-for="(post, i) in posts"
				v-bind="post"
				:key="i"
				:to="post.path"
			>
			</UBlogPost>
		</UBlogPosts>
	</div>
</template>
