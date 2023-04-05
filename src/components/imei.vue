<template>
  <div>
    <a-button type="primary" @click="showImei">设置</a-button>
    <a-modal v-model:visible="visible" title="设备列表" @ok="handleOk">
      <a-textarea
        v-model:value="imeisText"
        placeholder="请输入imei列表,回车分隔"
        :rows="10"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { getGateUrl } from "../lib/cache";
import { message } from "ant-design-vue";

export default defineComponent({
  props: {
    imeisArray: Array,
  },
  setup(props, { emit }) {
    const visible = ref<boolean>(false);
    const imeisText = ref(props.imeisArray.toString().replaceAll(",", "\n"));

    //modal
    const showImei = () => {
      if (getGateUrl()) {
        visible.value = true;
      } else {
        message.error("请先选择网关地址");
      }
    };

    watch(props, (newVal,OldVal) => {
      imeisText.value = newVal.imeisArray.toString().replaceAll(",", "\n");
    })


    /**
     * 设置imei
     */
    const handleOk = (e: MouseEvent) => {
      //修改imei
      emit("setImeis", imeisText);
      visible.value = false;
    };
    return {
      imeisText,
      visible,
      showImei,
      handleOk,
    };
  },
});
</script>