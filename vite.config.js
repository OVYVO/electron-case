import { defineConfig, optimizeDeps } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [
    vue(),
    // electron([
    //   //主进程配置
    //   {
    //     entry: 'electron/main/index.js',
    //     onstart(options) {
    //       options.startup()
    //     },
    //     vite: {
    //       build: {
    //         outDir: 'dist-electron/main',
    //       },
    //     },
    //   },
    //   // 渲染进程配置
    //   {
    //     entry: 'electron/preload/index.js',
    //     onstart(options) {
    //       options.reload()
    //     },
    //     vite: {
    //       build: {
    //         outDir: 'dist-electron/preload',
    //       },
    //     },
    //   }
    // ]),
    // renderer({
    //   nodeIntegration: true,
    // })
  ],
  build: {
    assertsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['electron'],
    },
    optimizeDeps: {
      exclude: ['electron'],
    },
  }
})
