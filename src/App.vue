<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <p>electron版本：{{electronVersion}}</p>
  <p>chrome版本{{chromeVersion}}</p>
  <p>node版本：{{nodeVersion}}</p>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'

let electronVersion = ref('')
let chromeVersion = ref('')
let nodeVersion = ref('')

onMounted(() => {
  electronVersion.value = versions.electron()
  chromeVersion.value = versions.chrome()
  nodeVersion.value = versions.node()
  console.log(electronAPI.ipcRenderer)
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
