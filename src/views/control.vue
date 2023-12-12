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
})

const watchChange = () => {
  electronAPI.ipcRenderer.on('candidate', async (event, candidate) => {
    addIceCandidate(JSON.parse(candidate))
  })
  electronAPI.ipcRenderer.on('answer', async (event, answer) => {
    try {
      await pc.value.setRemoteDescription(JSON.parse(answer))
    } catch (error) {
      console.log(error)
    }
  })
  pc.value.onaddstream = (e) => {
    play(e.stream)
  }
}

const initP2PConnection = async () => {
  pc.value = new window.RTCPeerConnection()
  const offerVal = await createOffer()
  // 设置candidate
  pc.value.onicecandidate = (e) => {
    electronAPI.ipcRenderer.send('forward', 'control-candidate', {
      remoteCode: remoteCode.value,
      res: JSON.stringify(e.candidate)
    })
  }
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

let candidates = ref([])
const addIceCandidate = async (candidate) => {
  if (!candidate) return
  candidates.value.push(candidate)
  if (pc.value.remoteDescription && pc.value.remoteDescription.type) {
    candidates.value.forEach(async (item) => {
      await pc.value.addIceCandidate(new RTCIceCandidate(item))
    })
    candidates.value = []
  }
}

const play = (stream) => {
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = () => {
    screenDom.value.play()
  }
}


</script>

<style lang="less" scoped></style>