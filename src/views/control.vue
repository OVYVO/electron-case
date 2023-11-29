<template>
  <div>
    <video ref="screenDom"></video>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const screenDom = ref(null)

const play = (stream)=>{
  screenDom.value.srcObject = stream
  screenDom.value.onloadedmetadata = ()=>{
    screenDom.value.play()
  }
}

</script>

<style lang="less" scoped>

</style>