<!-- 过滤渲染器按钮, 目前仅为render服务 -->
<template>
  <div class="filter-btn-group">
    <Button type="primary" size="small" class="filter-btn" @click="onConfirm"
      >确认</Button
    >
    <Button size="small" class="filter-btn" @click="onReset">重置</Button>
  </div>
</template>
<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import { VxeGlobalRendererHandles } from 'vxe-table'

const props = defineProps<{
  params: VxeGlobalRendererHandles.RenderFilterParams
}>()
const onConfirm = () => props.params?.$panel.confirmFilter()
const onReset = () => props.params?.$panel.resetFilter()
</script>
<style scoped>
.filter-btn-group {
  display: flex;
  margin-bottom: 8px;
}

.filter-btn {
  flex: 1;
}

.filter-btn + .filter-btn {
  margin-left: 12px;
}
</style>
