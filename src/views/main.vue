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

// TODO监控鼠标键盘事件同步webrtc数据流给控制端

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

const watchChange = () => {
  electronAPI.ipcRenderer.on('control-status', (event, ...args) => {
    const [remoteCode, status] = args
    if (controlCode.value !== remoteCode) return alert('连接错误')
    controlStatus.value = status
  })
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
