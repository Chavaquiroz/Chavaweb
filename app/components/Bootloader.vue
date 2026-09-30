<script setup>
import { ref, onMounted } from 'vue'
const emit = defineEmits(['finished'])
const isLoading = ref(true)
const logs = ref([])
const bootText =  `
                Welcome to SALVADOR QUIROZ.COM
Starting udev:                                             [  OK  ]
Setting hostname salvadorquiroz.com                        [  OK  ]
Setting up Logical Volume Management:   No volume groups found
                                                           [  OK  ]
Checking filesystems
/dev/sda2: clean, 89739/30457856 files, 2561411/121822976 blocks
/dev/sda1: clean, 39/76912 files, 43648/307200 blocks
                                                           [  OK  ]
Remounting root filesystem in read-write mode:             [  OK  ]
Mounting local filesystems:                                [  OK  ]
Enabling local filesystem quotas:                          [  OK  ]
Enabling /etc/fstab swaps:                                 [  OK  ]
Entering non-interactive startup

ERROR: Wanpipe configuration file not found:
               /etc/wanpipe/wanpipe1.conf

Bringing up loopback interface:                            [  OK  ]
Bringing up interface eth0:  
Determining IP information for eth0... done.
                                                           [  OK  ]
Starting auditd:                                           [  OK  ]
Starting system logger:                                    [  OK  ]
Loading DAHDI hardware modules:
  wct4xxp:                                                 [  OK  ]
  wcte43x:                                                 [  OK  ]
  wcte12xp:                                                [  OK  ]
  wcte13xp:                                                [  OK  ]
  wct1xxp:                                                 [  OK  ]
  wcte11xp:                                                [  OK  ]
  r1t1:                                                    [  OK  ]
  rxt1:                                                    [  OK  ]
  wctdm24xxp:                                              [  OK  ]
  wcaxx:                                                   [  OK  ]
  wcfxo:                                                   [  OK  ]
  wctdm:                                                   [  OK  ]
  rcbfx:                                                   [  OK  ]
  wcb4xxp:                                                 [  OK  ]
  wctc4xxp:                                                [  OK  ]
  xpp_usb:                                                 [  OK  ]
`
const bootLines = bootText.split('\n')

onMounted(async () => {
	for (const line of bootLines) {
		logs.value.push(line)
		await new Promise(r => setTimeout(r, Math.floor(Math.random() * 15) + 5))
	}

	setTimeout(() => {
		isLoading.value = false
			emit('finished')
		}, 100)
	})
</script>

<template>
	<div v-if="isLoading" class="bg-black z-50 fixed inset-0 text-sm font-mono whitespace-pre">
		<p v-for="(line, i) in logs" :key="i" class="leading-relaxed">{{ line}}</p>
		<p class="animate-pulse text-cyan-500">_</p>
	</div>
</template>

