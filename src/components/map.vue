<template>
  <div class="map" id="gd_map_d"></div>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from "vue";
import mybus from "../lib/bus.js";
import AMapLoader from "@amap/amap-jsapi-loader";
import "ant-design-vue/es/message/style/css"; //use ant-design-vue/es instead of ant-design-vue/lib
export default defineComponent({
  setup(props, { emit }) {
    onMounted(() => {
      nextTick(() => {
        initMap();
      });
    });

    let map;
    const isDraw = ref("");

    // const  point = reactive({lat:"",lng:""})
    const initMap = () => {
      AMapLoader.load({
        key: "f06729af7d5970405b0cc9c156c475bb", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.HawkEye", "AMap.Geocoder", "AMap.MouseTool"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: "1.1", // AMapUI 版本
          plugins: ["overlay/SimpleMarker"], // 需要加载的 AMapUI ui插件
        },
      })
        .then((AMap) => {
          map = new AMap.Map("gd_map_d", {
            zoom: 11, //级别,
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });

          AMap.plugin(["AMap.HawkEye"], function () {
            map.addControl(new AMap.HawkEye({ isOpen: true }));
          });

          let geocoder;
          AMap.plugin("AMap.Geocoder", function () {
            geocoder = new AMap.Geocoder({
              city: "010", // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            });
          });

          //设置位置标记
          const marker = new AMap.Marker({
            position: new AMap.LngLat(116.397428, 39.90923), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            map: map, //创建时直接赋予map属性
          });

          if (map) {
            map //获取坐标点
              .on("click", function (ev) {
                if (ev.type == "click") {
                  let lnglat = [ev.lnglat.lng, ev.lnglat.lat];
                  geocoder.getAddress(lnglat, function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                      // result为对应的地理位置详细信息
                      mybus.emit("getPoint", {
                        lat: ev.lnglat.lat,
                        lng: ev.lnglat.lng,
                        adress: result.regeocode.formattedAddress,
                        isDraw: isDraw.value,
                      });
                      marker.setPosition([ev.lnglat.lng, ev.lnglat.lat]);
                    }
                  });
                }
              });
          }

          /**
           * 设置坐标点
           */
          mybus.on("setCenter", (point) => {
            map.setCenter(new AMap.LngLat(point.lng, point.lat));
          });

          /**
           * 监听轨迹模拟
           */
          let mouseTool;
          mybus.on("sendGpsAuto", (data) => {
            isDraw.value = data;
            if (data) {
              mouseTool = new AMap.MouseTool(map);
              //使用鼠标工具，在地图上画标记点
              mouseTool.polyline({
                strokeColor: "#3366FF",
                strokeOpacity: 1,
                strokeWeight: 6,
                // 线样式还支持 'dashed'
                strokeStyle: "solid",
                // strokeStyle是dashed时有效
                // strokeDasharray: [10, 5],
              });
            } else {
              if (mouseTool) {
                mouseTool.close(true);
              }
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      isDraw,
    };
  },
});
</script>
 
<style lang='less'>
#gd_map_d {
  width: 100%;
  height: 100%;
}
</style>

