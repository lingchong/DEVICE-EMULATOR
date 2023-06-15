<template>
  <div id="app_container">
    <div id="aside_wrapper">
      <!-- 侧边栏 设备列表 -->
      <Aside></Aside>
    </div>
    <div id="home_wrapper">
      <div id="setting_container">
        <!--设置栏  网关地址  坐标系 告警 轨迹 心跳 GPS-->
        <Header></Header>
        <Console></Console>
      </div>
      <div id="map_container">
        <!-- 地图 -->
        <Map @getPoint="updatePoint"></Map>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

const imeis = [
  "861204928310000",
  "861204928310003",
  "861204928310001",
  "861204928310002",
];

export default defineComponent({
  setup() {
    const updatePoint = () => {};

    return {
      updatePoint,
    };
  },
});
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
#app_container {
  display: flex;
  flex-direction: row;
  height: 100%;
}
#aside_wrapper {
  // flex-grow: 4;
  width: 16%;
  height: 100%;
}

#home_wrapper {
  // flex-grow: 8;
  width: 84%;
  height: 100%;
}
#setting_container {
  overflow: auto;
  display: flex;
  flex-direction: row;
  height: 24%;
  min-height: 180px !important;
}

#map_container {
  height: 76%;
}
</style>

