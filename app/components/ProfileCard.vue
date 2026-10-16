<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

// Paleta tomada del hero: azul noche -> azul acero, acento celeste.
const DEFAULT_INNER_GRADIENT =
  'linear-gradient(145deg,#0f1729 0%,#16213d 45%,#2a4378 85%,#33548f 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
} as const;

interface Props {
  avatarUrl?: string;
  iconUrl?: string;
  grainUrl?: string;
  innerGradient?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: '<Placeholder for avatar URL>',
  iconUrl: '<Placeholder for icon URL>',
  grainUrl: '<Placeholder for grain URL>',
  className: '',
  enableTilt: true,
  enableMobileTilt: false,
  mobileTiltSensitivity: 5,
  name: 'Javi A. Torres',
  title: 'Software Engineer',
  handle: 'javicodes',
  status: 'Online',
  contactText: 'Contact',
  showUserInfo: true
});

const emit = defineEmits<{ contactClick: [] }>();

const wrapRef = ref<HTMLDivElement | null>(null);
const shellRef = ref<HTMLDivElement | null>(null);
const enterTimerRef = ref<number | null>(null);
const leaveRafRef = ref<number | null>(null);

let tiltEngine: ReturnType<typeof createTiltEngine> | null = null;

function createTiltEngine() {
  let rafId: number | null = null;
  let running = false;
  let lastTs = 0;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;

  const DEFAULT_TAU = 0.14;
  const INITIAL_TAU = 0.6;
  let initialUntil = 0;

  const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
  const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));

  const setVarsFromXY = (x: number, y: number) => {
    const shell = shellRef.value;
    const wrap = wrapRef.value;
    if (!shell || !wrap) return;

    const width = shell.clientWidth || 1;
    const height = shell.clientHeight || 1;

    const percentX = clamp((100 / width) * x);
    const percentY = clamp((100 / height) * y);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties: Record<string, string> = {
      '--glare-x': `${percentX}%`,
      '--glare-y': `${percentY}%`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 5))}deg`,
      '--rotate-y': `${round(centerY / 4)}deg`
    };

    for (const [k, v] of Object.entries(properties)) {
      wrap.style.setProperty(k, v);
    }
  };

  const step = (ts: number) => {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;

    const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    const k = 1 - Math.exp(-dt / tau);

    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;

    setVarsFromXY(currentX, currentY);

    const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

    if (stillFar || document.hasFocus()) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  const start = () => {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  return {
    setImmediate(x: number, y: number) {
      currentX = x;
      currentY = y;
      setVarsFromXY(currentX, currentY);
    },
    setTarget(x: number, y: number) {
      targetX = x;
      targetY = y;
      start();
    },
    toCenter() {
      const shell = shellRef.value;
      if (!shell) return;
      this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
    },
    beginInitial(durationMs: number) {
      initialUntil = performance.now() + durationMs;
      start();
    },
    getCurrent() {
      return { x: currentX, y: currentY, tx: targetX, ty: targetY };
    },
    cancel() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      lastTs = 0;
    }
  };
}

const getOffsets = (evt: PointerEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
};

const handlePointerMove = (event: PointerEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine || !props.enableTilt) return;
  const { x, y } = getOffsets(event, shell);
  tiltEngine.setTarget(x, y);
};

const handlePointerEnter = (event: PointerEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine || !props.enableTilt) return;

  shell.classList.add('active');
  shell.classList.add('entering');
  if (enterTimerRef.value) window.clearTimeout(enterTimerRef.value);
  enterTimerRef.value = window.setTimeout(() => {
    shell.classList.remove('entering');
  }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

  const { x, y } = getOffsets(event, shell);
  tiltEngine.setTarget(x, y);
};

const handlePointerLeave = () => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine || !props.enableTilt) return;

  tiltEngine.toCenter();

  const checkSettle = () => {
    const { x, y, tx, ty } = tiltEngine!.getCurrent();
    const settled = Math.hypot(tx - x, ty - y) < 0.6;
    if (settled) {
      shell.classList.remove('active');
      leaveRafRef.value = null;
    } else {
      leaveRafRef.value = requestAnimationFrame(checkSettle);
    }
  };
  if (leaveRafRef.value) cancelAnimationFrame(leaveRafRef.value);
  leaveRafRef.value = requestAnimationFrame(checkSettle);
};

const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  const shell = shellRef.value;
  if (!shell || !tiltEngine || !props.enableTilt) return;

  const { beta, gamma } = event;
  if (beta == null || gamma == null) return;

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const centerX = shell.clientWidth / 2;
  const centerY = shell.clientHeight / 2;
  const x = clamp(centerX + gamma * props.mobileTiltSensitivity, 0, shell.clientWidth);
  const y = clamp(
    centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * props.mobileTiltSensitivity,
    0,
    shell.clientHeight
  );

  tiltEngine.setTarget(x, y);
};

const cardStyle = computed(() => ({
  '--icon': props.iconUrl ? `url(${props.iconUrl})` : 'none',
  '--grain': props.grainUrl ? `url(${props.grainUrl})` : 'none',
  '--inner-gradient': props.innerGradient ?? DEFAULT_INNER_GRADIENT
}));

const handleContactClick = () => emit('contactClick');

const handleAvatarError = (event: Event) => {
  (event.target as HTMLImageElement).style.display = 'none';
};

const handleMiniAvatarError = (event: Event) => {
  const t = event.target as HTMLImageElement;
  t.style.opacity = '0.5';
  t.src = props.avatarUrl;
};

let clickHandler: (() => void) | null = null;
let deviceOrientationBound = false;

onMounted(() => {
  if (!props.enableTilt) return;

  tiltEngine = createTiltEngine();

  const shell = shellRef.value;
  if (!shell) return;

  shell.addEventListener('pointerenter', handlePointerEnter);
  shell.addEventListener('pointermove', handlePointerMove);
  shell.addEventListener('pointerleave', handlePointerLeave);

  clickHandler = () => {
    if (!props.enableMobileTilt || location.protocol !== 'https:') return;
    const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<string>;
    };
    if (anyMotion && typeof anyMotion.requestPermission === 'function') {
      anyMotion
        .requestPermission()
        .then((state: string) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            deviceOrientationBound = true;
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      deviceOrientationBound = true;
    }
  };
  shell.addEventListener('click', clickHandler);

  const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
  const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
  tiltEngine.setImmediate(initialX, initialY);
  tiltEngine.toCenter();
  tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
});

onUnmounted(() => {
  const shell = shellRef.value;
  if (shell) {
    shell.removeEventListener('pointerenter', handlePointerEnter);
    shell.removeEventListener('pointermove', handlePointerMove);
    shell.removeEventListener('pointerleave', handlePointerLeave);
    if (clickHandler) shell.removeEventListener('click', clickHandler);
    shell.classList.remove('entering');
  }
  if (deviceOrientationBound) {
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }
  if (enterTimerRef.value) window.clearTimeout(enterTimerRef.value);
  if (leaveRafRef.value) cancelAnimationFrame(leaveRafRef.value);
  tiltEngine?.cancel();
});
</script>

<template>
  <div ref="wrapRef" :class="`pc-card-wrapper ${className}`.trim()" :style="cardStyle">
    <div ref="shellRef" class="pc-card-shell">
      <section class="pc-card">
        <div class="pc-inside">
          <div class="pc-shine" />
          <div class="pc-glare" />

          <div class="pc-content pc-avatar-content">
            <img
              class="avatar"
              :src="avatarUrl"
              :alt="`${name || 'User'} avatar`"
              loading="lazy"
              @error="handleAvatarError"
            />

            <div v-if="showUserInfo" class="pc-user-info">
              <div class="pc-user-details">
                <div class="pc-mini-avatar">
                  <img
                    :src="miniAvatarUrl || avatarUrl"
                    :alt="`${name || 'User'} mini avatar`"
                    loading="lazy"
                    @error="handleMiniAvatarError"
                  />
                </div>
                <div class="pc-user-text">
                  <div class="pc-handle">@{{ handle }}</div>
                  <div class="pc-status">{{ status }}</div>
                </div>
              </div>
              <button
                class="pc-contact-btn"
                @click="handleContactClick"
                style="pointer-events: auto"
                type="button"
                :aria-label="`Contact ${name || 'user'}`"
              >
                {{ contactText }}
              </button>
            </div>
          </div>

          <div class="pc-content">
            <div class="pc-details">
              <h3>{{ name }}</h3>
              <p>{{ title }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pc-card-wrapper {
  --pointer-x: 50%;
  --pointer-y: 50%;
  --glare-x: 50%;
  --glare-y: 50%;
  --pointer-from-top: 0.5;
  --pointer-from-left: 0.5;
  --rotate-x: 0deg;
  --rotate-y: 0deg;
  --background-x: 50%;
  --background-y: 50%;
  --grain: none;
  --icon: none;
  --inner-gradient: none;

  /* Paleta */
  --c-bg-deep: #0f1729;
  --c-text: #e2e8f0;
  --c-accent: #4da3ff;
  --c-accent-border: rgba(77, 163, 255, 0.35);

  /* Brillo en tonos azules para combinar con la paleta */
  --sunpillar-1: hsl(205, 100%, 73%);
  --sunpillar-2: hsl(215, 100%, 70%);
  --sunpillar-3: hsl(195, 100%, 72%);
  --sunpillar-4: hsl(225, 100%, 74%);
  --sunpillar-5: hsl(200, 100%, 76%);
  --sunpillar-6: hsl(235, 90%, 74%);
  --sunpillar-clr-1: var(--sunpillar-1);
  --sunpillar-clr-2: var(--sunpillar-2);
  --sunpillar-clr-3: var(--sunpillar-3);
  --sunpillar-clr-4: var(--sunpillar-4);
  --sunpillar-clr-5: var(--sunpillar-5);
  --sunpillar-clr-6: var(--sunpillar-6);
  --card-radius: 30px;

  perspective: 500px;
  transform: translate3d(0, 0, 0.1px);
  position: relative;
  touch-action: none;
}

.pc-card-shell {
  position: relative;
  z-index: 1;
}

.pc-card {
  height: 60svh;
  max-height: 540px;
  display: grid;
  aspect-ratio: 0.718;
  border-radius: var(--card-radius);
  position: relative;
  box-shadow:
    rgba(5, 10, 25, 0.8) calc((var(--pointer-from-left) * 10px) - 3px)
      calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px,
    inset 0 0 0 1px var(--c-accent-border);
  transition: transform 1s ease;
  transform: translateZ(0) rotateX(0deg) rotateY(0deg);
  background: var(--c-bg-deep);
  backface-visibility: hidden;
  overflow: hidden;
}

/* Hover: movimiento + borde y reflejo suaves para ver por dónde se levanta */
.pc-card:hover,
.pc-card.active {
  box-shadow:
    rgba(5, 10, 25, 0.8) calc((var(--pointer-from-left) * 10px) - 3px)
      calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px,
    inset 0 0 0 1px rgba(77, 163, 255, 0.6);
  transition: none;
  transform: translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x));
}

.pc-card-shell.entering .pc-card {
  transition: transform 180ms ease-out;
}

.pc-card * {
  display: grid;
  grid-area: 1/-1;
  border-radius: var(--card-radius);
  pointer-events: none;
}

.pc-inside {
  inset: 0;
  position: absolute;
  background-image: var(--inner-gradient);
  background-color: var(--c-bg-deep);
  transform: none;
}

/* Brillo continuo: se anima solo, no reacciona al cursor */
.pc-shine {
  mask-image: var(--icon);
  mask-mode: luminosity;
  mask-repeat: repeat;
  mask-size: 150%;
  mask-position: top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x));
  filter: brightness(0.66) contrast(1.33) saturate(0.33) opacity(0.5);
  animation: holo-bg 18s linear infinite;
  animation-play-state: running;
  mix-blend-mode: color-dodge;

  --space: 5%;
  --angle: -45deg;
  transform: translate3d(0, 0, 1px);
  overflow: hidden;
  z-index: 3;
  background-color: transparent;
  background-image:
    repeating-linear-gradient(
      0deg,
      var(--sunpillar-clr-1) calc(var(--space) * 1),
      var(--sunpillar-clr-2) calc(var(--space) * 2),
      var(--sunpillar-clr-3) calc(var(--space) * 3),
      var(--sunpillar-clr-4) calc(var(--space) * 4),
      var(--sunpillar-clr-5) calc(var(--space) * 5),
      var(--sunpillar-clr-6) calc(var(--space) * 6),
      var(--sunpillar-clr-1) calc(var(--space) * 7)
    ),
    repeating-linear-gradient(
      var(--angle),
      #0e152e 0%,
      hsl(210, 20%, 60%) 3.8%,
      hsl(210, 35%, 68%) 4.5%,
      hsl(210, 20%, 60%) 5.2%,
      #0e152e 10%,
      #0e152e 12%
    ),
    radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 0%, 0.1) 12%,
      hsla(0, 0%, 0%, 0.15) 20%,
      hsla(0, 0%, 0%, 0.25) 120%
    );
  background-position:
    0 var(--background-y),
    var(--background-x) var(--background-y),
    center;
  background-blend-mode: color, hard-light;
  background-size:
    500% 500%,
    300% 300%,
    200% 200%;
  background-repeat: repeat;
}

.pc-avatar-content {
  mix-blend-mode: luminosity;
  overflow: visible;
  transform: translateZ(2);
  backface-visibility: hidden;
}

.pc-avatar-content .avatar {
  width: 100%;
  position: absolute;
  left: 50%;
  transform-origin: 50% 100%;
  transform: translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0)
    scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02))
    scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01));
  bottom: -1px;
  backface-visibility: hidden;
  will-change: transform;
  transition: transform 120ms ease-out;
}

.pc-avatar-content::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.pc-user-info {
  position: absolute;
  --ui-inset: 20px;
  --ui-radius-bias: 6px;
  bottom: var(--ui-inset);
  left: var(--ui-inset);
  right: var(--ui-inset);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 41, 0.55);
  backdrop-filter: blur(30px);
  border: 1px solid var(--c-accent-border);
  border-radius: calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)));
  padding: 12px 14px;
  pointer-events: auto;
}

.pc-user-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pc-mini-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--c-accent-border);
  flex-shrink: 0;
}

.pc-mini-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.pc-user-text {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
}

.pc-handle {
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text);
  line-height: 1;
}

.pc-status {
  font-size: 14px;
  color: var(--c-accent);
  line-height: 1;
}

.pc-contact-btn {
  border: 1px solid var(--c-accent);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #0f1729;
  background: var(--c-accent);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.pc-contact-btn:hover {
  transform: translateY(-1px);
}

.pc-content:not(.pc-avatar-content) {
  max-height: 100%;
  overflow: hidden;
  text-align: center;
  position: relative;
  transform: translate3d(
    calc(var(--pointer-from-left) * -6px + 3px),
    calc(var(--pointer-from-top) * -6px + 3px),
    0.1px
  );
  z-index: 5;
}

.pc-details {
  width: 100%;
  position: absolute;
  top: 3em;
  display: flex;
  flex-direction: column;
}

.pc-details h3 {
  font-weight: 600;
  margin: 0;
  font-size: min(5svh, 3em);
  color: var(--c-text);
}

.pc-details p {
  font-weight: 600;
  position: relative;
  top: -12px;
  white-space: nowrap;
  font-size: 16px;
  margin: 0 auto;
  width: min-content;
  color: var(--c-accent);
}

/* Reflejo suave que sigue al cursor; solo aparece en hover */
.pc-glare {
  transform: translate3d(0, 0, 1.1px);
  z-index: 4;
  background-image: radial-gradient(
    circle at var(--glare-x) var(--glare-y),
    rgba(150, 205, 255, 0.28) 0%,
    rgba(77, 163, 255, 0.1) 35%,
    transparent 70%
  );
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.pc-card:hover .pc-glare,
.pc-card.active .pc-glare {
  opacity: 1;
}

@keyframes holo-bg {
  0% {
    background-position:
      0 var(--background-y),
      0 0,
      center;
  }
  100% {
    background-position:
      0 var(--background-y),
      90% 90%,
      center;
  }
}

@media (max-width: 768px) {
  .pc-card {
    height: 70svh;
    max-height: 450px;
  }
  .pc-details {
    top: 2em;
  }
  .pc-details h3 {
    font-size: min(4svh, 2.5em);
  }
  .pc-details p {
    font-size: 14px;
  }
  .pc-user-info {
    --ui-inset: 15px;
    padding: 10px 12px;
  }
  .pc-mini-avatar {
    width: 28px;
    height: 28px;
  }
  .pc-user-details {
    gap: 10px;
  }
  .pc-handle {
    font-size: 13px;
  }
  .pc-status {
    font-size: 10px;
  }
  .pc-contact-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .pc-card {
    height: 60svh;
    max-height: 380px;
  }
  .pc-details {
    top: 1.5em;
  }
  .pc-details h3 {
    font-size: min(3.5svh, 2em);
  }
  .pc-details p {
    font-size: 12px;
    top: -8px;
  }
  .pc-user-info {
    --ui-inset: 12px;
    padding: 8px 10px;
  }
  .pc-mini-avatar {
    width: 24px;
    height: 24px;
  }
  .pc-user-details {
    gap: 8px;
  }
  .pc-handle {
    font-size: 12px;
  }
  .pc-status {
    font-size: 9px;
  }
  .pc-contact-btn {
    padding: 5px 10px;
    font-size: 10px;
    border-radius: 50px;
  }
}

@media (max-width: 320px) {
  .pc-card {
    height: 55svh;
    max-height: 320px;
  }
  .pc-details h3 {
    font-size: min(3svh, 1.5em);
  }
  .pc-details p {
    font-size: 11px;
  }
  .pc-user-info {
    padding: 6px 8px;
  }
  .pc-mini-avatar {
    width: 20px;
    height: 20px;
  }
  .pc-user-details {
    gap: 6px;
  }
  .pc-handle {
    font-size: 11px;
  }
  .pc-status {
    font-size: 8px;
  }
  .pc-contact-btn {
    padding: 4px 8px;
    font-size: 9px;
    border-radius: 50px;
  }
}
</style>