<template>
  <div class="main-container">
    <div>
      <p>倒计时：{{time}}</p>
      <button @click="createTimer">开始番茄钟</button>
      <button @click="stopTimer">停止番茄钟</button>
    </div>
    <p>连接状态：{{statusMap[controlStatus]}}</p>
    <p v-if="controlStatus ==2 ">被{{rtCode}}控制</p>
    <p>我的控制码：{{myControlCode}}</p>
    <input placeholder="控制码" type="number" v-model="rtCode">
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
let rtCode = ref(undefined) // 远程code
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
  if (!rtCode.value) return alert('请输入控制码')
  electronAPI.ipcRenderer.send('control', rtCode.value)
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
    if (status == 2) {
      // 如果傀儡端被控制，则将远程控制端code码保存,并初始化连接
      rtCode.value = remoteCode
      initP2PConnection()
    }
  })
  electronAPI.ipcRenderer.on('offer', async (event, offer) => {
    try {
      const answer = await createAnswer(offer)
      electronAPI.ipcRenderer.send('forward', 'answer', {
        remoteCode: rtCode.value,
        res: JSON.stringify(answer)
      })
    } catch (error) {
      console.log(error)
    }
  })
}

// 控制端创建P2P初始链接操作 获取offere
const initP2PConnection = async () => {
  pc.value = new window.RTCPeerConnection()
}

const createAnswer = async (offer) => {
  const sourceId = await electronAPI.ipcRenderer.invoke('get-screen-sources')
  let stream = await getScreenStream(sourceId)
  pc.value.addStream(stream)
  await pc.value.setRemoteDescription(JSON.parse(offer))
  await pc.value.setLocalDescription(await pc.value.createAnswer())
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
