<template>
  <div id="console_container">
    <terminal
      name="my-terminal"
      :show-header="false"
      init-log=""
      context=""
    ></terminal>
  </div>
</template>
  
  <script>
import { defineComponent, onMounted } from "vue";
import Terminal from "vue-web-terminal";
import { api as TerminalApi } from "vue-web-terminal";
import mybus from "../lib/bus.js";

export default defineComponent({
  components: {
    Terminal,
  },
  setup() {
    onMounted(() => {
      mybus.on("sendLog", (log) => {
        printfLog(log);
      });
      mybus.on("sendTcpLog", (log) => {
        printfLog(log);
      });
    });
    //打印日志
    const printfLog = (log) => {
      let message = { content: new String(log) };
      TerminalApi.pushMessage("my-terminal", message);
    };
    return { printfLog };
  },
});
</script>

<style lang="less">
#console_container {
  width: 40%;
  .t-container {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 100 !important;
    border-radius: 0 !important;
    div {
      text-align: left;
    }
  }
}
</style>