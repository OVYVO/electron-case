<template>
  <div>
    <video ref="screenDom" style="width: 100%;height: 100%;object-fit: contain;"></video>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const screenDom = ref(null)
const remoteCode = ref(undefined)
let pc = ref(null)

const route = useRoute()

onMounted(async () => {
  remoteCode.value = route.query.remote
  initP2PConnection()
  watchChange()
  pc.value.onaddstream = (e) => {
    console.log('监控傀儡端数据流', e)
    play(e)
  }
})

const watchChange = () => {
  electronAPI.ipcRenderer.on('answer', async (event, answer) => {
    try {
      const data = await pc.value.setRemoteDescription(JSON.parse(answer))
    } catch (error) {
      console.log(error)
    }
  })
}

const initP2PConnection = async () => {
  pc.value = new window.RTCPeerConnection()
  const offerVal = await createOffer()
  electronAPI.ipcRenderer.send('forward', 'offer', {
    remoteCode: remoteCode.value,
    res: JSON.stringify(offerVal)
  })
}

// 创建offer
const createOffer = async () => {
  let offer = await pc.value.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.value.setLocalDescription(offer)
  return pc.value.localDescription
}

const play = (stream) => {
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = () => {
    screenDom.value.play()
  }
}


</script>

<style lang="less" scoped></style>