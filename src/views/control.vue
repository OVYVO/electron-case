<template>
  <div>
    <video ref="screenDom" style="width: 100%;height: 100%;object-fit: contain;"></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const screenDom = ref(null)

onMounted(async () => {
  //getScreenStream()
  const sourceId = await electronAPI.ipcRenderer.invoke('get-screen-sources')
  getScreenStream(sourceId)
})

const play = (stream) => {
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = () => {
    screenDom.value.play()
  }
}

const getScreenStream = async (sourceId) => {
  console.log('==============')
  console.log(navigator)
  console.log('==============')
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          width: window.screen.width,
          height: window.screen.height
        }
      }
    })
    play(stream)
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="less" scoped></style>