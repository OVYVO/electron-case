<template>
  <div>
    <video ref="screenDom"></video>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const peer = require('./peer-control')

const screenDom = ref(null)
peer.on('add-stream', (stream)=>{
  play(stream)
})
const play = (stream)=>{
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = ()=>{
    screenDom.value.play()
  }
}

</script>

<style lang="less" scoped>

</style>