<template>
  <div class="header-wrapper">
    <div id="gate_container">
      <div style="display: flex">
        <span style="margin: auto">设备网关：</span>
        <a-select
          style="width: 180px"
          v-model:value="selectGate"
          mode="combobox"
          placeholder="请选择网关别名"
          :options="gateNames"
          @change="handleChange"
        ></a-select>
        <Gate @setGateName="updateGate"></Gate>
      </div>
      <div class="gps_param_mode">
        <a-tooltip>
          <template #title>
            1. 地球坐标系(WGS84)：常见于 GPS
            设备,Google地图等国际标准的坐标体系。
            2.火星坐标系(GCJ-02)：中国国内使用的被强制加密后的坐标体系，高德坐标就属于该种坐标体系。
            3.百度坐标系(BD-09)：百度地图所使用的坐标体系，是在火星坐标系的基础上又进行了一次加密处理。
          </template>
          坐标系：
        </a-tooltip>
        <a-select v-model:value="coordinateSystem" style="width: 120px">
          <a-select-option value="GCJ-02">火星坐标系</a-select-option>
          <a-select-option value="BD-09">百度坐标系</a-select-option>
          <a-select-option value="WGS84">地球坐标系</a-select-option>
        </a-select>
      </div>
    </div>
    <div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="gps" tab="GPS">
          <div id="gps_param_container">
            <div>
              经度:&nbsp;&nbsp;
              <a-input
                type="number"
                :max="180"
                :min="-180"
                v-model:value="gpsInfo.lng"
                style="width: 80px"
                @pressEnter="setCenter"
              />
              纬度：
              <a-input
                type="number"
                :max="90"
                :min="-90"
                v-model:value="gpsInfo.lat"
                @pressEnter="setCenter"
                style="width: 80px"
              />
              电压：
              <a-input v-model:value="gpsInfo.voltage" type="number" /> 速度：
              <a-input v-model:value="gpsInfo.speed" type="number" />

              <a-button type="primary" @click="sendGpsMsg()">发送</a-button>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="tracker" tab="轨迹" force-render>
          <div id="track_container">
            <a-button type="primary">自动</a-button>
            <a-button type="primary">手动</a-button>
            <div>
              起点&nbsp;:&nbsp;&nbsp;
              <a-tooltip title="GCJ-02坐标系">
                <a-input
                  style="width: 120px"
                  v-model:value="firstPoint"
                  placeholder="经度,纬度"
                />
              </a-tooltip>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="alarm" tab="告警">
          <div id="alarm_container">
            <a-button type="primary">SOS</a-button>
            <a-button type="primary">震动</a-button>
            <a-button type="primary">超速</a-button>
            <a-button type="primary">位移</a-button>
            <a-button type="primary">进入围栏</a-button>
            <a-button type="primary">离开围栏</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import mybus from "../lib/bus.js";
import { message } from "ant-design-vue";
import { initTcpServer } from "../lib/protocol.js";
import { defineComponent, reactive, ref } from "vue";
import {
  getGateUrlArray,
  setGateUrl,
  getGateUrl,
  getSelectedImei,
} from "../lib/cache.js";

export default defineComponent({
  setup() {
    /**
     * 缓存中获取设置的网关别名
     */
    let gateAlias = "";
    let currentGateUrl = getGateUrl();
    let matchedGateArray = getGateUrlArray().filter(
      (ex, index) => ex.value == currentGateUrl
    );
    if (matchedGateArray.length > 0) {
      gateAlias = matchedGateArray[0].alias;
    } else if (currentGateUrl) {
      setGateUrl("");
    }
    const selectGate = ref<string>(gateAlias);

    const activeKey = ref<string>("gps");
    //坐标系
    const coordinateSystem = ref("GCJ-02");

    //设置定位点
    const setCenter = () => {
      if (gpsInfo.lat && gpsInfo.lng) {
        mybus.emit("setCenter", { lat: gpsInfo.lat, lng: gpsInfo.lng });
      }
    };

    //gp坐标信息
    const gpsInfo = reactive({ lng: "", lat: "", speed: "", voltage: "" });
    mybus.on("getPoint", (point) => {
      gpsInfo.lng = point.lng;
      gpsInfo.lat = point.lat;
    });

    //切换网关地址
    const handleChange = (value: string) => {
      selectGate.value = value;
      let gateUrl = getGateUrlArray().filter((ex, index) => ex.alias == value);
      if (gateUrl.length > 0) {
        setGateUrl(gateUrl[0].value);
      }
      //更新imei列表
      mybus.emit("setImeis", true);
    };

    const nameArray = new Array();
    getGateUrlArray().forEach((domain) => {
      nameArray.push({ value: domain.alias });
    });

    //缓存中获取设置的值
    const gateNames = ref(nameArray);

    //更新网关别名列表
    const updateGate = (array) => {
      gateNames.value= array;
      if (
        selectGate.value &&
        array.some((item) => item.value == selectGate.value)
      ) {

        let gateUrl = getGateUrlArray().filter(
          (ex, index) => ex.alias == selectGate.value
        );
        if (gateUrl.length > 0) {
          setGateUrl(gateUrl[0].value);
        }
      } else {
        selectGate.value = "";
        setGateUrl("");
      }
    };
    let clientSocket;
    const sendGpsMsg = () => {
      let selectedImei = getSelectedImei();
      let gateUrl = getGateUrl();
      if (!gateUrl) {
        message.error("请先选择网关地址");
        return;
      }
      //检查imei
      if (!selectedImei) {
        message.error("请指定设备IMEI");
        return;
      }
      try {
        if (!localStorage.getItem(gateUrl) || !clientSocket) {
          clientSocket = initTcpServer(getGateUrl());
        }
        if (clientSocket && localStorage.getItem(gateUrl)) {
          clientSocket.write(JSON.stringify(gpsInfo));
          mybus.emit("sendLog", selectedImei + "> " + JSON.stringify(gpsInfo));
        }
      } catch (error) {
        mybus.emit(
          "sendLog",
          selectedImei + ">发送消息出现未知异常,异常信息：" + error
        );
      }
    };

    return {
      sendGpsMsg,
      coordinateSystem,
      firstPoint: "",
      gpsInfo,
      gatewayUrl: "",
      selectGate,
      setCenter,
      handleChange,
      updateGate,
      activeKey,
      gateNames,
    };
  },
});
</script>
<style lang="less">
.header-wrapper {
  width: 60%;
  height: 100%;
  background: rgb(190, 200, 200);
  padding: 22px 5px 5px;
}

#track_container {
  display: flex;
  justify-content: space-around;
}
#gps_param_container {
  display: flex;
  justify-content: space-around;

  .gps_param_mode {
    width: 18%;
    display: flex;
    justify-content: space-between;
  }
  input {
    width: 80px;
    margin-right: 20px;
  }
}

#gate_container {
  display: flex;
  justify-content: space-around;
  padding-bottom: 10px;
}

#alarm_container {
  margin: auto 10px;
  display: flex;
  justify-content: space-between;
}
</style>
