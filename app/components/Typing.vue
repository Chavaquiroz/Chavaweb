<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  texts: {
    type: Array,
    required: true
  },
  speed: {
    type: Number,
    default: 50
  },
  deleteSpeed: {
    type: Number,
    default: 30
  },
  pauseDuration: {
    type: Number,
    default: 1500
  }
})

const writtenText = ref('')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
	let i = 0
  while (true) {
  	const text = props.texts[i]
    for (let i = 0; i < text.length; i++) {
      writtenText.value += text[i]
      await sleep(props.speed + Math.floor(Math.random() * 20))
    }

    await sleep(props.pauseDuration)

    while (writtenText.value.length > 0) {
      writtenText.value = writtenText.value.slice(0, -1)
      await sleep(props.deleteSpeed)
    }
	i = (i + 1) % props.texts.length
  }
})
</script>

<template>
  <span class="font-mono">{{ writtenText }}█</span>
</template>
