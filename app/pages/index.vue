<script setup lang="ts">
import { motion } from "motion-v"
const { data: projects } = await useAsyncData(() => queryCollection('projects').all())
const { data: index } = await useAsyncData('index', () => queryCollection('index').first())

useSeoMeta({
  title: "Salvador Quiroz",
  description: "Salvador Quiroz personal webpage."
})
</script>

<template>

	<UContainer class="flex gap-30 min-h-screen items-center flex-col lg:flex-row overflow-x-hidden">
		<motion.div
			class="flex flex-col flex-1 min-h-screen justify-center"
			:initial="{ opacity: 0 }"
			:whileInView="{ opacity: 1 }"
			:transition="{ duration: 1.0, easing: 'ease-out' }"
		>
			<div>
				<h1 class="text-4xl md:text-6xl font-black text-center mb-8">{{ index.meta.main.name }}</h1>
				<div class="text-center text-xl">
					<Typing :texts="index.meta.main.titles" />
				</div>
				<div class="text-center my-8 text-xl">
					{{ index.meta.main.introduction }}
				</div>
				<div class="flex gap-4 flex-wrap justify-center">
					<UButton icon="i-lucide-face-grinning" variant="outline" class="backdrop-blur-md rounded-full" to="#about-me">About Me</UButton>
					<UButton icon="i-lucide-mail" variant="outline" class="backdrop-blur-md rounded-full" to="#contact">Contact</UButton>
					<UButton icon="i-lucide-shield-check" variant="outline" class="backdrop-blur-md rounded-full" to="#experience">Experience</UButton>
					<UButton icon="i-lucide-star-check" variant="outline" class="backdrop-blur-md rounded-full" to="#testimonials">Reviews</UButton>
					<UButton icon="i-lucide-file-user" class="rounded-full" :to="index.meta.main.cv_link">Download CV</UButton>
				</div>
			</div>
		</motion.div>
		<motion.div
			class="flex-1 min-h-screen flex items-center w-3/4 lg:w-full  z-2"
			:initial="{ opacity: 0, y: 40 }"
			:whileInView="{ opacity: 1, y: 0 }"
			:transition="{ duration: 1.0, easing: 'ease-out' }"
		>
			<WindowFrame>
				<div class="overflow-hidden relative">
					<NuxtImg src="/att/game.gif" class="aspect-4/3 object-cover" />
					<div class="mt-8 text-center justify-center items-end flex absolute inset-0 ">
						<UButton
							to="/game"
							color="secondary"
							class="animate-bounce font-bold mb-16 shadow-md bg-cyan-400"
							icon="i-lucide-gamepad-2"
						>Play Now</UButton>
					</div>
				</div>
			</WindowFrame>
		</motion.div>
	</UContainer>

	<UContainer class="min-h-screen items-center overflow-x-hidden" id="about-me">
		<motion.div
		 :initial="{ opacity: 0 }"
		 :whileInView="{ opacity: 1 }"
		>
			<h2 class="text-4xl text-center mb-8 font-black">About Me</h2>
		</motion.div>
		<div class="flex gap-20 flex-col md:flex-row">
			<div class="flex-1 md:h-300 h-150">
				<motion.div
				 :style="{ transformOrigin: 'top center' }"
				 :initial="{ opacity: 0, y: -60, rotate: +24 }"
				 :whileInView="{ opacity: 1, y: 0, rotate: 0 }"
				 :transition="{ 
							  type: 'spring', 
							  stiffness: 70, 
							  damping: 12, 
							  mass: 1.2 
							  }"
				>
					<PhotoFrame class="max-w-50 md:max-w-500 mx-auto">
						<NuxtImg src="/att/photo.jpg" height="600px" width="450x" format="webp" />
					</PhotoFrame>
				</motion.div>
			</div>
			<div class="flex flex-col flex-2 gap-20">
				<motion.div
					:initial="{ opacity: 0 }"
					:whileInView="{ opacity: 1 }"
					class="text-center md:text-xl">{{ index.meta.about_me.description }}
				</motion.div>
				<div class="flex gap-4">
					<UCard v-for="stat in index.meta.about_me.stats" class="flex-1 flex flex-col bg-transparent backdrop-blur-md">
					<div class="text-3xl font-bold">{{ stat.value }}</div>
					<div>{{ stat.label }}</div>
					</UCard>
				</div>
			</div>
		</div>
	</UContainer>

	<UContainer class="my-50" id="experience">
		<motion.div
		 :initial="{ opacity: 0 }"
		 :whileInView="{ opacity: 1 }"
		 >
			 <h2 class="text-4xl text-center mb-50 font-black">Experience</h2>
		</motion.div>
		<Timeline :jobs="index.meta.experience.timeline" />
	</UContainer>

	<UContainer class="min-h-screen flex flex-col items-center overflow-x-hidden">
		<div class="w-full m-auto z-1">
			<motion.div
				:initial="{ opacity: 0 }"
				:whileInView="{ opacity: 1 }"
				>
				<h2 id="projects" class="text-4xl text-center mb-16 font-black">Projects</h2>
			</motion.div>
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
				<motion.div
					v-for="project in projects"
					:initial="{ opacity: 0, y: 30 }"
					:animate="{ opacity: 1, y: 0 }"
					:transition="{ duration: 0.5, delay: i * 0.15 }"
					class="flex-1"
				>
					<div class="overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out relative rounded-lg shadow-md">
						<NuxtImg
							format="webp"
							:src="project.meta.images?.[0]"
							class="w-full rounded-lg aspect-4/3 object-cover brightness-50 "
						/>
						<NuxtLink
							:to="project.path"
							class="text-white md:text-xl absolute inset-0 flex items-center text-center  justify-center"
						>{{ project.title }}</NuxtLink>
					</div>
				</motion.div>
			</div>
		</div>
	</UContainer>

	<div class="flex min-h-screen flex-col gap-8 items-center my-30">
		<motion.div
			:initial="{ opacity: 0 }"
			:whileInView="{ opacity: 1 }"
		>
			<h2 id="testimonials" class="font-black text-4xl text-center my-8">Testimonials</h2>
			<p class="text-center text-lg font-extralight leading-8">{{ index.meta.testimonials.introtext }}</p>
		</motion.div>

		<UMarquee
			class="max-w-full"
			pause-on-hover
			:overlay="true"
			:ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
		>
			<UCard
				v-for="item in index.meta.testimonials.list"
				class="bg-gray-100 dark:bg-slate-800 h-70 w-80 sm:text-md text-sm"
			>
				<UUser
						:name="item.name"
						:description="item.role"
						size="xl"
						:avatar="{
								 src: item.avatar,
								 loading: 'lazy',
								 icon: 'i-lucide-image'
								 }"
						/>
				<UInputRating
					class="my-3"
					disabled
					color="warning"
					:default-value="item.rate"
				/>
				<div>
					"{{ item.text }}"
				</div>
			</UCard>
		</UMarquee>

		<UMarquee
				pause-on-hover
				reverse
				:overlay="true"
				class="max-w-full"
				:ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
		>
			<UCard
				v-for="item in index.meta.testimonials.list"
				class="bg-gray-100 dark:bg-slate-800 h-70 w-80 sm:text-md text-sm"
			>
				<UUser
					:name="item.name"
					:description="item.role"
					size="xl"
					:avatar="{
							 src: item.avatar,
							 loading: 'lazy',
							 icon: 'i-lucide-image'
							 }"
				/>
				<UInputRating
					class="my-3"
					disabled
					color="warning"
					:default-value="item.rate"
				/>
				<div class="">
					"{{ item.text }}"
				</div>
			</UCard>
		</UMarquee>
	</div>

	<UContainer class="min-h-screen overflow-x-hidden">
		<div class="z-2">
			<h2 id="education" class="font-black text-4xl text-center mb-20 font-mono">Education</h2>
		</div>
		<div class="justify-center grid grid-cols-2 md:grid-cols-3 gap-4">
			 <UCard class="dark:bg-slate-800" v-for="item in index.meta.education">
			 <NuxtImg src="/att/photo.jpg" format="webp" class="mx-auto w-full" />
			 <template #footer>
				<div class="text-center text-sm mb-4">{{ item.year }}</div>
				<div class="font-bold text-center">{{ item.degree }}</div>
			 </template>
			 </UCard>
		</div>
	</UContainer>

	<UContainer class="min-h-screen overflow-x-hidden">
		<div class="z-2">
			<h2 id="awards" class="font-black text-4xl text-center mb-20 font-mono">Honors and Awards</h2>
		</div>
		<div class="justify-center grid grid-cols-2 md:grid-cols-3 gap-4">
			 <UCard class="dark:bg-slate-800" v-for="award in index.meta.awards">
				<div class="text-center">
					<UIcon name="i-lucide-trophy" class="size-6 text-yellow-500" />
				</div>
				<div class="font-bold text-center">{{ award.name }}</div>
				<div class="text-center text-sm mt-4">{{ award.year }}</div>
				<div class="text-center text-sm mb-4">{{ award.institution }}</div>
				<div class="text-center text-sm mb-4">{{ award.text }}</div>
			 </UCard>
		</div>
	</UContainer>


	<UContainer class="min-h-screen overflow-x-hidden">
		  <div class="flex min-h-screen">
			<div class="flex flex-col md:flex-row gap-8 m-auto w-full">
				<motion.div
					class="flex-1"
					:initial="{ opacity: 0 }"
					:whileInView="{ opacity: 1 }"
				>
					<h2 id="contact" class="font-black text-4xl text-center mb-8">Contact me</h2>
					<div class="text-center mx-auto md:max-w-100 pb-16 md:text-lg">{{ index.meta.contactme.message }}</div>
					<div class="flex gap-4 flex-wrap justify-center">
						<NuxtLink v-for="network in index.meta.contactme.network" :to="network.url">
							<UIcon
								:name="network.icon"
								class="size-6"
							/>
						</NuxtLink>
					</div>
				</motion.div>
				<motion.div
					class="flex-1"
					:initial="{ opacity: 0, y: 20 }"
					:whileInView="{ opacity: 1, y: 0 }"
				>
					<UForm class="space-y-4">
						<UFormField label="Your name" name="name" size="xl">
							<UInput class="w-full" />
						</UFormField>
						<UFormField label="Your email" name="email" size="xl">
							<UInput class="w-full" />
						</UFormField>
						<UFormField label="Write a Message" name="message" size="xl">
							<UTextarea class="w-full" />
						</UFormField>
						<UButton
							size="xl"
							icon="i-lucide-send"
							type="submit"
						>Submit</UButton>
					</UForm>
				</motion.div>
			</div>
		</div>
	</UContainer>
</template>
