<template>
  <div class="header-wrapper">
    <div id="gate_container">
      <div style="display: flex">
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
import { initTcpServer } from "../lib/protocol.js";
import { defineComponent, reactive, ref } from "vue";
import { getGateUrlArray, setGateUrl, getGateUrl } from "../lib/cache.js";

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
      //更新imei
      mybus.emit("setImeis", true);
    };

    const nameArray = new Array();
    getGateUrlArray().forEach((domain) => {
      nameArray.push({ value: domain.alias });
    });

    //缓存中获取设置的值
    const gateNames = ref(nameArray);

    //更新网关列表
    const updateGate = (array) => {
      gateNames.value = array;
      selectGate.value = "";
      setGateUrl("");
    };
    let sock;
    const sendGpsMsg = () => {
      if (!localStorage.getItem(getGateUrl())) {
        sock = initTcpServer(getGateUrl());
      }
      if (sock) {
        sock.write(JSON.stringify(gpsInfo));
        mybus.emit("sendLog", JSON.stringify(gpsInfo));
      } else {
        mybus.emit("sendLog", getGateUrl() + "connect fail.");
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
