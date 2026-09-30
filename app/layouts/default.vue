<template>
	<div class="font-mono">
		<Aurora
			horizonColor="#64748b"
			waveColor="#3b82f6"
			crestColor="#3b82f6"
			:speed="0.4"
			:amplitude="2.5"
			:waveScale="0.6"
			:waveRatio="0.9"
			:swell="35"
			:turbulence="20"
			:tilt="1.11"
			:zoom="1.0"
			:height="5.5"
			:fogDepth="15"
			detail="medium"
			:brightness="1.0"
			:opacity="1.0"
			:mouseInteraction="true"
			:parallaxStrength="0.5"
			:grain="true"
			:grainIntensity="0.05"
			class="fixed"
		/>

		<AppHeader />
		<div>
			<slot />
		</div>
		<AppFooter />
	</div>
</template>
