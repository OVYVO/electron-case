<template>
  <div class="main-container">
    <!-- <p>electron版本：{{electronVersion}}</p>
    <p>chrome版本{{chromeVersion}}</p>
    <p>node版本：{{nodeVersion}}</p> -->
    {{time}}
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Timer from 'timer.js'

let electronVersion = ref('')
let chromeVersion = ref('')
let nodeVersion = ref('')
let newTimer = ref(null)
let time = ref('')

onMounted(() => {
  // electronVersion.value = versions.electron()
  // chromeVersion.value = versions.chrome()
  // nodeVersion.value = versions.node()
  createTimer()
})

const createTimer = ()=>{
  if(newTimer.value) newTimer.value.off()
  newTimer.value = new Timer({
    ontick: (ms)=>{
      let s = (ms / 1000).toFixed(0)
      let ss = s % 60
      let mm = (s/60).toFixed(0)
      time.value = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    },
    onend: ()=>{
      time.value = '00:00'
      electronAPI.ipcRenderer.invoke('timer-end','end').then(res=>{
        console.log(res)
      })
    }
  })
  newTimer.value.start(5)
}
</script>

<style scoped lang="less">
.main-container{

}
</style>
