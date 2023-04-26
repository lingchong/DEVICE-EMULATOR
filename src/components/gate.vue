<template>
  <div>
    <a-button type="primary" @click="showModal">设置</a-button>
    <a-modal v-model:visible="visible" title="网关列表" @ok="handleOk">
      <!-- 动态网关地址表单 -->
      <a-form
        ref="formRef"
        name="dynamic_form_item"
        :model="dynamicValidateForm"
      >
        <a-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :name="['domains', index, 'value']"
          :rules="{
            required: true,
            message: '网关地址不能为空',
            trigger: 'change',
          }"
        >
          <a-input
            v-model:value="domain.alias"
            placeholder="网关别名"
            style="width: 20%; margin-right: 8px"
          ></a-input>
          <a-input
            v-model:value="domain.value"
            placeholder="网关地址,请使用 IP:PORT 形式指定"
            style="width: 60%; margin-right: 8px"
          />
          <MinusCircleOutlined
            v-if="dynamicValidateForm.domains.length > 1"
            class="dynamic-delete-button"
            :disabled="dynamicValidateForm.domains.length === 1"
            @click="removeDomain(domain)"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="addDomain">
            <PlusOutlined />
            添加设备网关
          </a-button>
        </a-form-item>
      </a-form>
      <p style="color: red" v-show="tips_show">{{ tips }}</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import { setGateUrlArray, getGateUrlArray } from "../lib/cache.js";

interface Domain {
  //地址
  value: string;
  //别名
  alias: string;
  //索引
  key: number;
}

export default defineComponent({
  components: {
    MinusCircleOutlined,
    PlusOutlined,
  },
  setup(props, { emit }) {
    //弹窗展示
    const visible = ref<boolean>(false);

    const tips = ref();
    const tips_show = ref<boolean>(false);

    //modal
    const showModal = () => {
      visible.value = true;
    };

    /**
     * 确认
     */
    const handleOk = (e: MouseEvent) => {
      let gateNameArray = new Array();

      console.log(dynamicValidateForm.domains);
      if (
        dynamicValidateForm.domains.filter(
          (ex) => !ex.alias || !ex.value || !ex.alias.trim() || !ex.value.trim()
        ).length > 0
      ) {
        //表单存在空值
        tips.value = "表单键值对不能为空";
        tips_show.value = true;
        return;
      } else {
        tips_show.value = false;
      }
      dynamicValidateForm.domains.forEach((ex) => {
        gateNameArray.push({ value: ex.alias });
      });
      // 更新网关缓存
      setGateUrlArray(dynamicValidateForm.domains);
      //  更新网关别名列表
      emit("setGateName", gateNameArray);
      visible.value = false;
    };

    const formRef = ref<FormInstance>();

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const dynamicValidateForm = reactive<{ domains: Domain[] }>({
      domains: getGateUrlArray(),
    });

    const removeDomain = (item: Domain) => {
      let index = dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        dynamicValidateForm.domains.splice(index, 1);
      }
    };
    const addDomain = () => {
      dynamicValidateForm.domains.push({
        value: "",
        key: Date.now(),
        alias: "",
      });
    };

    return {
      visible,
      showModal,
      handleOk,
      formRef,
      formItemLayout,
      formItemLayoutWithOutLabel,
      dynamicValidateForm,
      removeDomain,
      addDomain,
      tips,
      tips_show,
    };
  },
});
</script>

