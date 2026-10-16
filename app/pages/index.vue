<script setup lang="ts">
import { motion, AnimatePresence } from "motion-v"
const { data: projects } = await useAsyncData(() => queryCollection('projects').all())
const { data: index } = await useAsyncData('index', () => queryCollection('index').first())
import ProfileCard from "~/components/ProfileCard.vue"

useSeoMeta({
  title: "Salvador Quiroz",
  description: "Salvador Quiroz personal webpage."
})

// --- Paginación de proyectos ---
const PER_PAGE = 6
const page = ref(1)
const direction = ref(1) // 1 = siguiente, -1 = anterior

const totalPages = computed(() => Math.ceil((projects.value?.length ?? 0) / PER_PAGE))

const currentProjects = computed(() => {
	const start = (page.value - 1) * PER_PAGE
	return (projects.value ?? []).slice(start, start + PER_PAGE)
})

function goTo(n: number) {
	if (n < 1 || n > totalPages.value || n === page.value) return
	direction.value = n > page.value ? 1 : -1
	page.value = n
}

const showTop = ref(false)

function onScroll() {
	const el = document.getElementById('about-me')
	if (!el) return
	// true cuando la sección About Me ya llegó (o pasó) la parte superior
	showTop.value = el.getBoundingClientRect().top <= 100
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
	window.addEventListener('scroll', onScroll, { passive: true })
	onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>

	<UContainer class="flex gap-10 lg:gap-30 min-h-screen items-center flex-col lg:flex-row overflow-x-hidden py-16 lg:py-0">
		<motion.div
			class="flex flex-col flex-1 justify-center min-h-[60vh] lg:min-h-screen"
			:initial="{ opacity: 0 }"
			:whileInView="{ opacity: 1 }"
			:transition="{ duration: 1.0, ease: 'easeOut' }"
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
			class="flex-1 lg:min-h-screen flex flex-col items-center justify-center gap-6 w-full sm:w-3/4 lg:w-full z-2"
			:initial="{ opacity: 0, y: 40 }"
			:whileInView="{ opacity: 1, y: 0 }"
			:transition="{ duration: 1.0, ease: 'easeOut' }"
		>
			<WindowFrame class="w-full h-full">
				<div class="overflow-hidden relative">
					<NuxtImg src="/att/gif.gif" class="w-full aspect-4/3 object-cover" />
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
			<UButton
				icon="i-lucide-folder-code"
				variant="outline"
				class="backdrop-blur-md rounded-full"
				to="#projects"
			>More Projects</UButton>
		</motion.div>
	</UContainer>

	<UContainer class="min-h-screen items-center overflow-x-hidden" id="about-me">
		<motion.div
		 :initial="{ opacity: 0 }"
		 :whileInView="{ opacity: 1 }"
		>
			<h2 class="text-4xl text-center mb-8 font-black">About Me</h2>
		</motion.div>
		<div class="flex gap-10 md:gap-20 flex-col md:flex-row items-center md:items-start">
			<div class="flex-1 w-full flex justify-center">
				<motion.div
					class="flex justify-center w-full"
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
					<PhotoFrame class="w-64 sm:w-72 md:w-80 mx-auto !bg-transparent !shadow-none">
						<div class="flex justify-center w-full">
							<ProfileCard
								name="Salvador"
								title="Developer | Scientist"
								handle=""
								status=""
								contact-text=""
								avatar-url="/att/yosinfondo.png"
								:show-user-info="false"
								:enable-tilt="true"
								:enable-mobile-tilt="true"
								:behind-glow-enabled="true"
							/>
						</div>
					</PhotoFrame>
				</motion.div>
			</div>
			<div class="flex flex-col flex-2 gap-6">
				<motion.div
					:initial="{ opacity: 0 }"
					:whileInView="{ opacity: 1 }"
					class="text-center md:text-xl whitespace-pre-line">{{ index.meta.about_me.description }}
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
			 <h2 class="text-4xl text-center font-black">Experience</h2>
		</motion.div>
		<Timeline :jobs="index.meta.experience.timeline" class="whitespace-pre-line"/>
	</UContainer>

	<UContainer class="min-h-screen flex flex-col items-center overflow-x-hidden">
		<div class="w-full m-auto z-1">
			<motion.div
				:initial="{ opacity: 0 }"
				:whileInView="{ opacity: 1 }"
				>
				<h2 id="projects" class="text-4xl text-center mb-16 font-black">Projects</h2>
			</motion.div>

			<!-- overflow-hidden para que el slide no se salga -->
			<div class="overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.div
						:key="page"
						:initial="{ opacity: 0, x: direction * 60 }"
						:animate="{ opacity: 1, x: 0 }"
						:exit="{ opacity: 0, x: direction * -60 }"
						:transition="{ duration: 0.3 }"
						class="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono max-w-4xl mx-auto"
					>
						<motion.div
							v-for="(project, i) in currentProjects"
							:key="project.path"
							:initial="{ opacity: 0, y: 30 }"
							:animate="{ opacity: 1, y: 0 }"
							:transition="{ duration: 0.4, delay: i * 0.08 }"
							class="flex-1"
						>
							<div class="overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out relative rounded-lg shadow-md">
								<div class="relative rounded-lg overflow-hidden aspect-4/3 bg-blue-900 ring-1 ring-blue-400/20">
									<NuxtImg
										format="webp"
										:src="project.meta.images?.[0]"
										class="absolute inset-0 w-full h-full object-cover mix-blend-luminosity brightness-75 contrast-125"
									/>
									<!-- Oscurece un poco más -->
									<div class="absolute inset-0 bg-blue-950/50"></div>
									
								</div>
								<NuxtLink
									:to="project.path"
									class="text-white md:text-xl absolute inset-0 flex items-center text-center justify-center"
								>{{ project.title }}</NuxtLink>
							</div>
						</motion.div>
						<div
							v-for="n in PER_PAGE - currentProjects.length"
							:key="`placeholder-${n}`"
							class="invisible aspect-4/3"
							aria-hidden="true"
						/>
					</motion.div>
				</AnimatePresence>
			</div>

			<!-- Controles: solo si hay más de una página -->
			<div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8 font-mono">
				<UButton
					icon="i-lucide-chevron-left"
					color="neutral"
					variant="ghost"
					:disabled="page === 1"
					aria-label="Página anterior"
					@click="goTo(page - 1)"
				/>

				<UButton
					v-for="n in totalPages"
					:key="n"
					:label="String(n)"
					size="sm"
					:color="n === page ? 'info' : 'neutral'"
					:variant="n === page ? 'solid' : 'ghost'"
					@click="goTo(n)"
				/>

				<UButton
					icon="i-lucide-chevron-right"
					color="neutral"
					variant="ghost"
					:disabled="page === totalPages"
					aria-label="Página siguiente"
					@click="goTo(page + 1)"
				/>
			</div>

			<p v-if="totalPages > 1" class="text-center text-sm text-muted mt-2 font-mono">
				{{ page }} / {{ totalPages }}
			</p>
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

	<UContainer class="py-16 md:py-24 overflow-x-hidden">
		<div class="z-2">
			<h2 id="education" class="font-black text-4xl text-center mb-12 md:mb-20 font-mono scroll-mt-24">Education</h2>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
			<UCard
				v-for="(item, i) in index.meta.education"
				:key="i"
				class="dark:bg-slate-800"
				:ui="{ body: 'p-2 sm:p-2', footer: 'px-3 py-2 sm:px-3 sm:py-2' }"
			>
				<NuxtImg
					:src="item.image"
					format="webp"
					class="mx-auto w-full max-h-80 object-contain rounded-md"
				/>
				<template #footer>
					<div class="text-center text-sm text-muted mb-1">{{ item.year }}</div>
					<div class="font-bold text-center text-base leading-tight">{{ item.degree }}</div>
					<div class="font-bold text-center text-base leading-tight">{{ item.institution }}</div>
				</template>
			</UCard>
		</div>
	</UContainer>
	<UContainer class="py-16 md:py-24 overflow-x-hidden">
		<div class="z-2">
			<h2 id="awards" class="font-black text-4xl text-center mb-12 md:mb-20 font-mono scroll-mt-24">Honors and Awards</h2>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
			<UCard
				v-for="(award, i) in index.meta.awards"
				:key="i"
				class="dark:bg-slate-800"
				:ui="{ body: 'p-3 sm:p-3' }"
			>
				<div class="text-center">
					<UIcon name="i-lucide-trophy" class="size-5 text-yellow-500" />
				</div>
				<div class="font-bold text-center text-sm leading-tight mt-1">{{ award.name }}</div>
				<div class="text-center text-xs mt-2 text-muted">{{ award.year }}</div>
				<div class="text-center text-xs mb-2 text-muted">{{ award.institution }}</div>
				<div class="text-center text-xs leading-snug">{{ award.text }}</div>
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
	<Transition
		enter-active-class="transition duration-300"
		enter-from-class="opacity-0 translate-y-4"
		leave-active-class="transition duration-300"
		leave-to-class="opacity-0 translate-y-4"
	>
		<UButton
			v-if="showTop"
			icon="i-lucide-arrow-up"
			size="xl"
			class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 rounded-full shadow-lg"
			aria-label="Volver arriba"
			@click="scrollToTop"
		/>
	</Transition>
</template>