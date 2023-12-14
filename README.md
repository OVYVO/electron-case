#### 介绍
本项目实在学习完Electron主题框架后实现的一个简单的demo案例。主要功能有
- 番茄钟（Electron窗口创建及preload,原生弹窗等知识）
- 远程控制（Electron进程间通信,WebRTC,websocket信令服务等知识）
#### 资源
vite + vue3 + electron
学习参考：极客时间邓耀龙Electron项目实战
#### 未完成
- robotjs集成及对应的信令服务
- 项目打包流程及更新
- 集成原生c++
#### 注意
- 本地调试需要使用localhost地址，防止浏览器保护机制限制navigator对象访问不到全部属性
- 部分未完成任务需要配合本地开发环境安装Python之类的依赖，具体可自行百度