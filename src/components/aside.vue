<template>
  <!-- imei侧边栏 -->
  <div id="aside_container_1">
    <div class="aside_container_1_header">
      <h2>设备列表</h2>
      <!-- <a-button type="primary">设置</a-button> -->
      <Imei :imeisArray="deviceImeis" @setImeis="updateImeis"></Imei>
    </div>
    <check-circle-outlined />
    <a-radio-group v-model:value="selectedImei">
      <a-list size="large" bordered :data-source="deviceImeis">
        <template #renderItem="{ item }">
          <a-radio :style="radioStyle" :value="item">{{ item }}</a-radio>
          <a-divider />
        </template>
      </a-list>
    </a-radio-group>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { e } from "../../dist/assets/vendor.f6ffff32";
import {
  setImeiArray,
  getImeiArray,
  setSelectedImei,
  getSelectedImei,
} from "../lib/cache.js";
//命名应该首字母大写
import Imei from "./imei.vue";
import mybus from "../lib/bus.js";

export default defineComponent({
  setup() {
    const deviceImeis = ref(getImeiArray());
    const selectedImei = ref<string>(getSelectedImei());
    const radioStyle = reactive({
      display: "flex",
      height: "30px",
      lineHeight: "30px",
    });

    watch(selectedImei, (newVal, oldVal) => {
      setSelectedImei(newVal);
    });

    //网关环境变化，切换imei列表
    mybus.on("setImeis", (ex) => {
      deviceImeis.value = getImeiArray();
      if (deviceImeis.value.length > 0) {
        selectedImei.value = deviceImeis.value[0];
      } else {
        selectedImei.value = "";
      }
    });

    const updateImeis = (val) => {
      deviceImeis.value = val.value.split("\n").filter((item) => item);
      setImeiArray(deviceImeis.value);
      setSelectedImei("");
    };

    return {
      selectedImei,
      radioStyle,
      deviceImeis,
      updateImeis,
    };
  },
});
</script>
<style lang="less">
#aside_container_1 {
  .aside_container_1_header {
    display: flex;
    padding: 20px 0;
    margin: 0 20px;
    justify-content: space-between;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-radio-group {
    width: 100%;
    .ant-list-bordered {
      padding: 10px 0;
      .ant-spin-container {
        .ant-radio-wrapper {
          margin: 5px 0px;
          justify-content: center;
          align-items: center;
          align-content: center;
        }
      }
    }
  }

  max-height: 100%;
  overflow-y: auto;
}
</style>
