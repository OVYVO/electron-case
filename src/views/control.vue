<template>
  <div>
    <video ref="screenDom" style="width: 100%;height: 100%;object-fit: contain;"></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const screenDom = ref(null)
const pc = ref(null)

onMounted(async () => {
  //getScreenStream()
  // const sourceId = await electronAPI.ipcRenderer.invoke('get-screen-sources')
  // getScreenStream(sourceId)
  pc.value = new window.RTCPeerConnection({})
  watchChange()
})

const watchChange = () => {
}

const play = (stream) => {
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = () => {
    screenDom.value.play()
  }
}


</script>

<style lang="less" scoped></style>