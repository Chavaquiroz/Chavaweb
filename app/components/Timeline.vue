<script setup lang="ts">
import { motion } from "motion-v"
import type { TimelineItem } from '@nuxt/ui'
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
	jobs: {
		required: true
	}
})

const containerRef = ref(null)
const scrollProgress = ref(1)

const handleScroll = () => {
  const e = containerRef.value
  if (!e) return
  const startY = e.offsetTop
  const scrollableDistance = (e.offsetHeight - window.innerHeight) * 1.2
  if (scrollableDistance <= 0) return
  const scrolled = window.scrollY - startY
  const ratio = Math.min(Math.max(scrolled / scrollableDistance, 0), 1)
  scrollProgress.value = Math.round(ratio * 7) // Numero de trabajos
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
	<div class="flex gap-10">
		<div class="flex-1 relative hidden lg:block">
			
			<!-- Reduce el 20hv si la linea del tiempo es muy larga
				 o aumenta su valor si es corta -->
			<div class="sticky top-1 mx-auto w-64 text-center">
				<div class="flex h-[100vh] items-center">
					<UTimeline
						:items="jobs.map(j => ({
							title: j.company,
							date: j.start,
							icon: 'i-lucide-briefcase-business'
							}))"
						:default-value="scrollProgress"
						color="info"
						:ui="{ item: 'flex-row-reverse text-end' }"

					/>
				</div>
			</div>
		</div>
		<div class="flex-2 flex flex-col gap-40 md:gap-100" ref="containerRef">
			<div></div>
			<motion.div
				:initial="{ opacity: 0, x: 0 }"
				:whileInView="{ opacity: 1, x: 0 }"
				:transition="{ duration: 1.0, easing: 'ease-out' }"
				class="flex gap-10 flex-col lg:flex-row flex-col-reverse" v-for="job in jobs"
			>
				<div class="flex-2 flex flex-col gap-4 ">
					<span class="text-sm text-center lg:text-left">{{ job.years }}</span>
					<span class="text-xl font-bold  text-center lg:text-left dark:text-blue-300">{{ job.job_title }} - {{ job.company }}</span>
					<div class="text-center lg:text-left">
						<ul class="list-disc space-y-2">
							<li v-for="bullet in job.bullets">{{ bullet }}</li>
						</ul>
					</div>
					<div class="flex gap-4 flex-wrap lg:justify-start justify-center">
						<UIcon v-for="icon in job.technologies"
							:name="icon"
							class="size-6"
						/>
					</div>
				</div>
				<div class="flex-1 justify-center text-center flex">
					<div>
						<NuxtImg :src="job.picture" format="webp" width="400" height="400" class="aspect-square object-cover md:w-full w-full" />
					</div>
				</div>
			</motion.div>
			<div class=""></div>
		</div>
	</div>
</template>
