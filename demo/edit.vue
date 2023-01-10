<docs>
---
order: 0
title: 可编辑
---

## description

使用 eTable.getRender() 提供的渲染器实现编辑效果

</docs>
<template>
    <vxe-grid ref="xGrid" v-bind="gridOptions" :data="mockDate" />
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { VxeGridInstance, VxeColumnPropTypes } from 'vxe-table'
import { eTable } from '@thrusterx/universe'

const { getGridProps } = eTable

const xGrid = ref({} as VxeGridInstance)

const gridOptions = getGridProps({
  id: 'demo2',
  height: 220,
  columns: [
    {
      field: 'name',
      title: '名称（输入框）',
      fixed: 'left' as VxeColumnPropTypes.Fixed,
      width: 200,
      editRender: {
        name: 'XInput',
      },
    },
    {
      field: 'price',
      title: '身价（价格输入框）',
      width: 200,
      editRender: {
        name: 'XPriceInput',
        props: {
          digits: 2,
          min: 0,
        },
      },
    },
    {
      field: 'nickname',
      title: '昵称（自动完成）',
      width: 200,
      editRender: {
        name: 'XAutoComplete',
        props: {
          options: [
            { value: '李白' },
            { value: '杜甫' },
            { value: '王维' },
            { value: '贺知章' },
          ],
        },
      },
    },
    {
      field: 'times',
      title: '上场次数（数字输入框）',
      width: 300,
      editRender: {
        name: 'XInputNumber',
        props: {
          min: 1,
        },
      },
    },
    {
      field: 'lastDate',
      title: '最近上场日期（日期选择）',
      width: 300,
      editRender: {
        name: 'XDatePicker',
      },
    },
    {
      field: 'workDate',
      title: '效力日期（日期范围）',
      width: 200,
      editRender: {
        name: 'XRangePicker',
      },
    },
    {
      field: 'startTime',
      title: '比赛开始时间（时间选择）',
      width: 300,
      editRender: {
        name: 'XTimePicker',
      },
    },
    {
      field: 'breakTimeRange',
      title: '休息时间区间（时间范围）',
      width: 300,
      editRender: {
        name: 'XTimeRangePicker',
      },
    },
    {
      field: 'year',
      title: '账期（财务账期）', // 使用 year-month 两字段结合
      width: 200,
      editRender: {
        name: 'XYearMonthPicker',
      },
    },
    {
      field: 'country',
      title: '国籍（选择器）',
      width: 200,
      editRender: {
        name: 'XSelect',
        props: {
          options: [
            { label: '中国', value: 1 },
            { label: '美国', value: 2 },
            { label: '日本', value: 3 },
          ],
        },
      },
    },
    {
      field: 'area',
      title: '地区（不同列的级联选择器）',
      width: 300,
      editRender: {
        name: 'XCascadeSelect',
        props: {
          parentField: 'country',
          options: [
            {
              label: '中国',
              value: 1,
              children: [
                {
                  label: '华北',
                  value: 1,
                },
                {
                  label: '华东',
                  value: 2,
                },
              ],
            },
            {
              label: '美国',
              value: 2,
              children: [
                {
                  label: '西部',
                  value: 1,
                },
                {
                  label: '东部',
                  value: 2,
                },
              ],
            },
            {
              label: '日本',
              value: 3,
              children: [
                {
                  label: '东京地区',
                  value: 1,
                },
                {
                  label: '大阪地区',
                  value: 2,
                },
              ],
            },
          ],
        },
      },
    },
    {
      field: 'birth',
      title: '出生地点（级联选择器）',
      width: 200,
      editRender: {
        name: 'XCascader',
        props: {
          options: [
            {
              label: '中国',
              value: 1,
              children: [
                {
                  label: '华北',
                  value: 11,
                },
                {
                  label: '华东',
                  value: 12,
                },
              ],
            },
            {
              label: '美国',
              value: 2,
              children: [
                {
                  label: '西部',
                  value: 21,
                },
                {
                  label: '东部',
                  value: 22,
                },
              ],
            },
            {
              label: '日本',
              value: 3,
              children: [
                {
                  label: '东京地区',
                  value: 31,
                },
                {
                  label: '大阪地区',
                  value: 32,
                },
              ],
            },
          ],
        },
      },
    },
    {
      field: 'evaluation',
      title: '评价',
      width: 200,
      editRender: {
        name: 'XRate',
      },
    },
    {
      field: 'injury',
      title: '伤病（开关）',
      width: 200,
      editRender: {
        name: 'XSwitch',
      },
    },
    {
      field: 'leave',
      title: '请假（勾选，勾选列时不要用这个）',
      width: 300,
      editRender: {
        name: 'XCheckbox',
      },
    },
  ],
})

const mockDate = [
  {
    id: 10001,
    name: '吴磊',
    price: 123456,
    nickname: '吴球王',
    times: 302,
    lastDate: '2022-08-08',
    workDate: ['2020-08-08', '2022-08-08'],
    startTime: '08:00:34',
    breakTimeRange: ['09:00:00', '10:00:00'],
    year: 2022,
    month: 11,
    country: 1,
    area: 2,
    birth: [1, 12],
    evaluation: 4,
    injury: false,
    leave: true,
  },
]
</script>
