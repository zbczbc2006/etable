<docs>
---
order: 0
title: 全功能
---

## description

使用 useTableSever完成接口调用和基础数据绑定，createRule添加数据校验。接口效果查看控制台打印

</docs>
<template>
  <Spin :spinning="loading">
    <x-table-button-group
      :disabled-copy="!selections.length"
      :disabled-del="!selections.length"
      @add="onAdd"
      @del="onDel"
      @copy="onCopy"
    />
    <vxe-grid
      ref="gridRef"
      v-bind="gridOptions"
      :data="data"
      :pager-config="pagerConfig"
      v-on="events"
    />
    <x-bottom-operate>
      <Button type="primary" @click="onSave">保存</Button>
    </x-bottom-operate>
  </Spin>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { Spin, Button, message } from 'ant-design-vue'
import { VxeGridInstance, VxeColumnPropTypes } from 'vxe-table'
import { eTable } from '@thrusterx/universe'
import api from './mock'
const {
  getGridProps,
  useTableSever,
  createRule,
} = eTable

const gridRef = ref({} as VxeGridInstance)

const gridOptions = getGridProps({
  id: 'demo1',
  height: 300,
  columns: [
    { type: 'checkbox' as VxeColumnPropTypes.Type, width: 60 },
    {
      field: 'name',
      title: '名称',
      sortable: true,
      editRender: {
        name: 'XInput',
      },
      filterRender: {
        name: 'XInput',
      },
    },
    {
      field: 'nickname',
      title: '昵称',
      editRender: {
        name: 'XInput',
      },
    },
    {
      field: 'phone',
      title: '手机号',
      editRender: {
        name: 'XInput',
      },
    },
    {
      field: 'sex',
      title: '性别',
      sortable: true,
      editRender: {
        name: 'XSelect',
        props: {
          options: [
            {
              label: '男',
              value: 1,
            },
            {
              label: '女',
              value: 0,
            },
          ],
        },
      },
    },
  ],
  editRules: {
    name: [createRule.required('名称', { trigger: 'manual' })],
    nickname: [createRule.required('昵称', { trigger: 'manual' })],
    phone: [
      createRule.required('手机号', { trigger: 'manual' }),
      createRule.phone({ trigger: 'manual' }),
    ],
    sex: [createRule.requiredSelect('性别', { trigger: 'manual' })],
  },
  sortConfig: {
    multiple: true, // 开启多字段组合排序，先点击的优先排序
  },
})
const {
  loading,
  pagerConfig,
  server,
  data,
  selections,
  events,
} = useTableSever({
  queryService: api.query,
  saveService: api.save,
  deleteService: api.del,
})

server.queryData()

const onAdd = async () => {
  const { row } = await gridRef.value.insert({})
  gridRef.value.setEditRow(row)
}
const onCopy = async () => {
  selections.value.forEach(async ({ name, nickname, phone, sex }) => {
    const { row } = await gridRef.value.insert({
      name,
      nickname,
      phone,
      sex,
    })
    gridRef.value.setEditRow(row)
  })
}
const onDel = async () => {
  const delRows = selections.value.filter((row) => row.id).map((row) => row.id)
  // 删除的全是当前新增的
  if (!delRows.length) {
    gridRef.value.removeCheckboxRow()
  } else {
    await server.deleteData(selections.value.map((row) => row.id))
  }
  message.success('删除成功！')
}
const onSave = async () => {
  const err = await gridRef.value.validate()
  if (err) {
    const errorDom = document.querySelector('.col--valid-error')
    if (errorDom) {
      errorDom.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
    return
  }
  const records = gridRef.value.getRecordset()
  const rows = [...records.insertRecords, ...records.updateRecords]
  if (rows.length > 0) {
    await server.saveData(rows)
    message.success('保存成功！')
  } else {
    message.warning('没有数据修改')
  }
}
</script>
