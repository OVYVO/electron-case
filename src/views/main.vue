<template>
  <div class="main-container">
    <div>
      <p>倒计时：{{time}}</p>
      <button @click="createTimer">开始番茄钟</button>
      <button @click="stopTimer">停止番茄钟</button>
    </div>
    <p>连接状态：{{statusMap[controlStatus]}}</p>
    <p>我的控制码：{{myControlCode}}</p>
    <input placeholder="控制码" type="number" v-model="controlCode">
    <button @click="openControlScreen">发送控制请求</button>

    <p>electron版本：{{electronVersion}}</p>
    <p>chrome版本{{chromeVersion}}</p>
    <p>node版本：{{nodeVersion}}</p>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import Timer from 'timer.js'

let electronVersion = ref('')
let chromeVersion = ref('')
let nodeVersion = ref('')
let newTimer = ref(null)
let time = ref('00:00')
let myControlCode = ref('')
let controlCode = ref(undefined)
let controlStatus = ref('')
let statusMap = {
  '': '未连接',
  '0': '连接失败',
  '1': '已控制',
  '2': '被控制',
}
let pc = ref(null)

onMounted(() => {
  electronVersion.value = versions.electron()
  chromeVersion.value = versions.chrome()
  nodeVersion.value = versions.node()
  login()
  watchChange()
})
onUnmounted(() => {
  electronAPI.ipcRenderer.removeListener('control-status')
})

const openControlScreen = () => {
  if (!controlCode.value) return alert('请输入控制码')
  electronAPI.ipcRenderer.send('control', controlCode.value)
}
const login = () => {
  electronAPI.ipcRenderer.invoke('login').then(res => {
    myControlCode.value = res
  })
}
const createTimer = () => {
  if (newTimer.value) newTimer.value.pause()
  newTimer.value = new Timer({
    ontick: (ms) => {
      let s = (ms / 1000).toFixed(0)
      let ss = s % 60
      let mm = (s / 60).toFixed(0)
      time.value = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    },
    onend: () => {
      time.value = '00:00'
      electronAPI.ipcRenderer.invoke('timer-end', 'end').then(res => {
        console.log(res)
      })
    }
  })

  newTimer.value.start(5)
}
const stopTimer = () => {
  if (newTimer.value) newTimer.value.stop()
}

const watchChange = () => {
  electronAPI.ipcRenderer.on('control-status', (event, ...args) => {
    const [remoteCode, status] = args
    controlStatus.value = status
    initP2PConnection()
  })
  electronAPI.ipcRenderer.on('offer', (event, offer) => {
    console.log(offer)
    //TODO拿到offer之后怎么处理视频流数据，并且设置candidate
    pc.value.onicecandidate = (e) => {
      console.log(e.candidate)
      // electronAPI.ipcRenderer.send('forward', 'puppet-candidate', e.candidate)
    }
  })
}

const initP2PConnection = async () => {
  pc.value = new window.RTCPeerConnection()
  if (myControlCode.value == controlCode.value) return
  const offerVal = await createOffer()
  electronAPI.ipcRenderer.send('forward', 'offer', {
    remoteCode: controlCode.value,
    offer: JSON.stringify(offerVal)
  })
}

const createOffer = async () => {
  let offer = await pc.value.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.value.setLocalDescription(offer)
  return pc.value.localDescription
}
const createAnswer = async (offer) => {
  let stream = await getScreenStream()
  pc.value.addStream(stream)
  await pc.value.valuesetRemoteDescription(offer);
  await pc.value.valuesetLocalDescription(await pc.value.createAnswer());
  console.log('create answer\n', JSON.stringify(pc.value.localDescription))
  return pc.value.localDescription
}
const getScreenStream = (sourceId) => {
  return new Promise(async (resolve, reject) => {
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
      resolve(stream)
    } catch (e) {
      console.log(e)
      reject()
    }
  })
}

</script>

<style scoped lang="less">
.main-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
