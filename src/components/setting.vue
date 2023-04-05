<template>
  <div class="map" id="gd_map_d">
  </div>
</template>
<script>
import { defineComponent, nextTick, onMounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
//   import { message } from 'ant-design-vue';
import "ant-design-vue/es/message/style/css"; //use ant-design-vue/es instead of ant-design-vue/lib
export default defineComponent({
  setup() {
    onMounted(() => {
      nextTick(() => {
        initMap();
      });
    });
    const initMap = () => {
      AMapLoader.load({
        key: "f06729af7d5970405b0cc9c156c475bb", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: "1.1", // AMapUI 版本
          plugins: ["overlay/SimpleMarker"], // 需要加载的 AMapUI ui插件
        },
      })
        .then((AMap) => {
          var map = new AMap.Map("gd_map_d", {
            zoom: 11, //级别,
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    return {};
  },
});
</script>
 
<style lang='less'>
#gd_map_d {
  width: 100%;
  height: 100%;
}
</style>

