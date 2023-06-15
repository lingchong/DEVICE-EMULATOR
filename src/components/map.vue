<template>
  <div class="map" id="gd_map_d"></div>
</template>

<script>
import { defineComponent, nextTick, onMounted } from "vue";
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

    // const  point = reactive({lat:"",lng:""})
    const initMap = () => {
      AMapLoader.load({
        key: "f06729af7d5970405b0cc9c156c475bb", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.HawkEye", "AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
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

            // var lnglat = [116.396574, 39.992706];

            // geocoder.getAddress(lnglat, function (status, result) {
            //   if (status === "complete" && result.info === "OK") {
            //     // result为对应的地理位置详细信息
            //   }
            // });
          });

          //获取坐标点
          map.on("click", function (ev) {
            if (ev.type == "click") {
              // mybus.emit("getPoint", {
              //   lat: ev.lnglat.lat,
              //   lng: ev.lnglat.lng,
              // });
              let lnglat = [ev.lnglat.lng, ev.lnglat.lat];
              geocoder.getAddress(lnglat, function (status, result) {
                if (status === "complete" && result.info === "OK") {
                  // result为对应的地理位置详细信息
                  // console.log("当前位置" + result.regeocode.formattedAddress);
                  mybus.emit("getPoint", {
                    lat: ev.lnglat.lat,
                    lng: ev.lnglat.lng,
                    adress: result.regeocode.formattedAddress,
                  });
                }
              });
            }
          });

          /**
           * 设置坐标点
           */
          mybus.on("setCenter", (point) => {
            map.setCenter(new AMap.LngLat(point.lng, point.lat));
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

