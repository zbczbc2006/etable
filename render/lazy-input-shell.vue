<!-- 延迟更新输入外壳， 目前仅为render服务 -->
<!-- 
注意，如果插槽组件已绑定update:value或blur事件，都需要在组件内省声明对应事件并透传触发，可参考当前文件
已声明的事件不会被$attrs透传
比如某组件上已@blur，则需要defineEmits(['blur'])，并在合适的时机emit('blur')
属性和事件都定义在此组件上，用法示例
<lazyInputShell v-slot="slotProps" v-model:value="a" v-bind="otherProps" v-on="otherEvents">
    <OtherComponent v-bind="slotProps" />
</lazyInputShell>
或者
h(
  lazyInputShell,
  {
    ...otherProps,
    ...otherEvents,
  },
  {
    default: (slotProps) =>
      h(OtherComponent, slotProps),
  }
 -->
<template>
  <slot
    v-bind="$attrs"
    :value="innerValue"
    @blur="onBlur"
    @update:value="onUpdate"
  ></slot>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  value: any
}>()
const emit = defineEmits<{
  (e: 'update:value', data: any): void
  (e: 'blur', data: any): void
}>()
const innerValue = ref(props.value)
const onUpdate = (val) => {
  innerValue.value = val
}
const onBlur = (e) => {
  emit('update:value', innerValue.value)
  emit('blur', e)
}
</script>
