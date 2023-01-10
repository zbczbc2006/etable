<docs>
---
order: 0
title: 基本用法
---

## description

使用 getGridProps 获取预设参数和类型提示  

</docs>
<template>
  <vxe-grid ref="xGrid" v-bind="gridOptions" :data="mockDate" />
</template>

<script lang="tsx" setup>
import { h, ref } from 'vue'
import { VxeGridInstance, VxeColumnPropTypes } from 'vxe-table'
import { Button } from 'ant-design-vue'
import { eTable } from '@thrusterx/universe'
const { getGridProps } = eTable

const xGrid = ref({} as VxeGridInstance)

const gridOptions = getGridProps({
  id: 'demo1',
  height: 300,
  columns: [
    { type: 'seq' as VxeColumnPropTypes.Type, width: 50 },
    {
      field: 'name',
      title: '名称',
    },
    {
      field: 'nickname',
      title: '昵称',
    },
    {
      field: 'role',
      title: '角色',
    },
    {
      field: 'sex',
      title: '性别',
      formatter({ cellValue }) {
        switch (cellValue) {
          case 0:
            return '男'
          case 1:
            return '女'
          default:
            return '未知'
        }
      },
    },
    {
      title: '操作',
      slots: {
        default: () => h(Button, { type: 'link' }, '查看详情'), // 文档不支持jsx，使用渲染函数代替。实际建议使用jsx
      },
    },
  ],
})

const mockDate = [
  {
    id: 10001,
    name: 'Test1',
    nickname: 'T1',
    role: 'Develop',
    sex: 0,
    age: 28,
    address: 'Shenzhen',
    email: 't1@t.com',
  },
  {
    id: 10002,
    name: 'Test2',
    nickname: 'T2',
    role: 'Test',
    sex: 1,
    age: 22,
    address: 'Guangzhou',
    email: 't2@t.com',
  },
  {
    id: 10003,
    name: 'Test3',
    nickname: 'T3',
    role: 'PM',
    sex: 0,
    age: 32,
    address: 'Shanghai',
    email: 't3@t.com',
  },
]
</script>
