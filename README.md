
### DEVICE-EMULATOR
设备模拟器

# 使用ant-design-vue  / vue3.0  / vite  , 采用Electron 打包
# Vue 3 + Vite
This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)


electron 打包： 参考 https://blog.csdn.net/weixin_47551643/article/details/128000357

1. 启动web
> npm run dev

启动可执行文件：
1. npm run build
2. npm run dev

高德应用控制台：https://console.amap.com/dev/key/app

# electron 打包参考
https://juejin.cn/post/7078543710434099237


#轨迹回放
https://lbs.amap.com/demo/jsapi-v2/example/marker/replaying-historical-running-data



```
"build": {
    "appId": "com.xxx.app",
    "mac": {
      "target": ["dmg","zip"]
    },
    "win": {
      "target": ["nsis","zip"]
    }
},
"scripts": {
    "dist": "electron-builder --win --x64"
},

```
```
 "build":"vite build"
 ```