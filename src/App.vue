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
let controlStatus = ref()
let statusMap = {
  '0': '连接失败',
  '1': '连接中',
  '2': '连接成功',
}

onMounted(() => {
  electronVersion.value = versions.electron()
  chromeVersion.value = versions.chrome()
  nodeVersion.value = versions.node()
  login()
  electronAPI.ipcRenderer.on('control-status', (event, ...args) => {
    const [remoteCode,status] = args
    if(controlCode.value !== remoteCode) return alert('连接错误')
    controlStatus.value = status
  })
})

onUnmounted(()=>{
  electronAPI.ipcRenderer.removeListener('control-status')
})

const openControlScreen = ()=>{
  if(!controlCode.value) return alert('请输入控制码') 
  electronAPI.ipcRenderer.send('request-control-screen',controlCode.value)
}

const login = ()=>{
  electronAPI.ipcRenderer.invoke('user-login').then(res=>{
    myControlCode.value = res
  })
}

const createTimer = ()=>{
  if(newTimer.value) newTimer.value.pause()
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
  newTimer.value.start(5000)
}
const stopTimer = ()=>{
  if(newTimer.value) newTimer.value.stop()
}
</script>

<style scoped lang="less">
.main-container{

}
</style>
