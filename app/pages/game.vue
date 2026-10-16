<script setup lang="ts">
const jugando = ref(false)
</script>


<template>
	<div class="w-full px-8">
		<div class="h-24"></div>
		<h1 class="text-4xl font-bold text-center my-8">A random space game</h1>
		<div class="lg:flex flex-col lg:flex-row gap-8">
			<div class="flex-1 text-center pb-8">
				<div class="text-xl  my-8 font-bold">Instructions</div>
				AD/Left Right Arrows: Move <br />
				W/Space/Up Arrow: Jump, Wall Jump  and Double Jump<br />
				O/Z: Shoot <br />
				I/X: Action
			</div>
			<div class="game-wrapper lg:flex-[2]">
				<iframe
				v-if="jugando"
				src="/juego/index.html"
				title="Mi juego"
				allow="cross-origin-isolated; autoplay; fullscreen"
				allowfullscreen
				/>
				<div v-else class="h-full flex items-center justify-center rounded-lg bg-black/40">
					<UButton size="xl" icon="i-lucide-play" @click="jugando = true">Jugar</UButton>
				</div>
			</div>
			<div class="flex-1 text-center">
				<div class="text-xl  my-8 font-bold">Technologies</div>
				<div>
					<div class="flex gap-4 flex-wrap justify-center">
						<UIcon name="i-simple-icons-godotengine" class="size-10" />
						<UIcon name="i-simple-icons-aseprite" class="size-10" />
						<UIcon name="i-simple-icons-android" class="size-10" />
						<UIcon name="i-simple-icons-gnubash" class="size-10" />
						<UIcon name="i-simple-icons-lmms" class="size-10" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.game-wrapper {
  width: 100%; min-width: 0;
  max-width: 960px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
}
.game-wrapper iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>