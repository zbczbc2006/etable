---
order: 10
category: Components
subtitle: 可编辑表格
type: 数据录入
title: ETable
---

可编辑表格

## 何时使用

- 用于业务中需要大数据量下较好性或可编辑表格的场景。本工具是在[vxetable](https://vxetable.cn/#/table/start/install)基础上的拓展和约束。
- 工具都集成在 `import { eTabl } from '@thrusterx/universe'` 中。

由于vxetable本身包含的功能较多，用法多样，为了统一代码风格，易于代码迁移和问题排查，这里作出如下约定
1. 仅使用`vxe-grid`这一个表格组件，其他方面依然使用antd-v组件
2. 模板中仅使用`vxe-grid`一个组件标签，其他功能都使用属性实现。并且除了`data`、`pager-config`等个别有特殊处理必要的属性，其他都定义在`v-bind`中，事件则定义在`v-on`中

## 使用准备
1. 安装vxetable组件库和sass
``` bash
npm install xe-utils vxe-table sass
```

2. 在入口文件，如man.ts中
``` javascript
import { createApp } from 'vue'
import VXETable from 'vxe-table'
import { eTable } from '@thrusterx/universe'
import '@thrusterx/universe/dist/etable/index.scss'
import App from './App.vue'
VXETable.use(eTable.getRender())
const app = createApp(App)
app.use(VXETable)
```
> vxe-table自身的样式已包含在上述 index.scss，无需再次引入  
> 如果项目中的 antd-v 组件修改过[类名前缀](https://www.antdv.com/docs/vue/customize-theme-variable-cn#%E4%BB%A3%E7%A0%81%E8%B0%83%E6%95%B4)，需要使用新的前缀名称覆盖变量 $antprefix，并且 eTable.getRender()方法中作为入参传入

比如项目中将前缀 ant 改为 antv3，则需

1. 新建 style.scss文件，此处也可修改其他vxe-table[变量](https://github.com/x-extends/vxe-table/blob/master/styles/variable.scss)
``` scss
$antprefix: antv3;
// 此处可输入其他需要修改的样式变量
@import '@thrusterx/universe/dist/etable/index.scss'

```
2. 调整man.ts
``` javascript
import { createApp } from 'vue'
import VXETable from 'vxe-table'
import { eTable } from '@thrusterx/universe'
// import '@thrusterx/universe/dist/etable/index.scss'
import './style.scss'
import App from './App.vue'
// VXETable.use(eTable.getRender())
VXETable.use(eTable.getRender('antv3'))
const app = createApp(App)
app.use(VXETable)
```

## API
### VxeGrid 常用API
#### 属性

| 参数            | 二级参数     | 说明                                   | 类型/可选值                                                 | 默认值 |
| --------------- | ------------ | -------------------------------------- | ----------------------------------------------------------- | ------ |
| columns         | type         | 列的类型                               | 'seq' , 'radio' , 'checkbox' , 'expand' , 'html'            |        |
|                 | field        | 列字段名                               | string                                                      |        |
|                 | title        | 列标题                                 | string                                                      |        |
|                 | width        | 列宽度                                 | number,%                                                    |        |
|                 | minWidth     | 列最小宽度                             | number,%                                                    |        |
|                 | resizable    | 列是否允许拖动列宽调整大小             | boolean                                                     |        |
|                 | visible      | 默认是否显示                           | boolean                                                     |        |
|                 | fixed        | 将列固定在左侧或者右侧                 | left（固定左侧）, right（固定右侧）                         |        |
|                 | align        | 列对齐方式                             | left（左对齐）, center（居中对齐）, right（右对齐）         |        |
|                 | headerAlign  | 表头列的对齐方式                       | left（左对齐）, center（居中对齐）, right（右对齐）         |        |
|                 | formatter    | 格式化显示内容                         | (({ cellValue, row, column }) => string) \| any[] \| string |        |
|                 | sortable     | 是否允许列排序                         | boolean                                                     | false  |
|                 | filterRender | 筛选渲染器配置项                       | any                                                         |        |
|                 | cellRender   | 默认的渲染器配置项                     | any                                                         |        |
|                 | editRender   | 可编辑渲染器配置项                     | any                                                         |        |
|                 | slots        | 插槽                                   | default header title checkbox content filter edit           |        |
| data            |              | 表格数据                               | any[]                                                       |        |
| height          |              | 表格的高度                             | auto, %, number                                             |        |
| max-height      |              | 表格的最大高度                         | %, number                                                   |        |
| align           |              | 所有的列对齐方式                       | left（左对齐）, center（居中对齐）, right（右对齐）         |        |
| header-align    |              | 所有的表头列的对齐方式                 | left（左对齐）, center（居中对齐）, right（右对齐）         |        |
| keep-source     |              | 保持原始值的状态，有性能要求的可以关闭 | boolean                                                     | true   |
| column-config   | resizable    | 每一列是否启用列宽调整                 | boolean                                                     | false  |
|                 | width        | 每一列的宽度                           | auto, %, number                                             |        |
|                 | minWidth     | 每一列的最小宽度                       | auto, %, number                                             |        |
| row-config      | isHover      | 当鼠标移到行时，是否要高亮当前行       | boolean                                                     | true   |
| checkbox-config | highlight    | 高亮勾选行                             | boolean                                                     | true   |
| edit-rules      |              | 校验规则配置项                         | { [field: string]: VxeTableDefines.ValidatorRule[] }        |        |
| scroll-x        |              | 横向虚拟滚动配置                       |                                                             |        |
| scroll-y        |              | 纵向虚拟滚动配置                       |                                                             |        |

### 方法
| 方法名称                      | 说明                                                                        | 类型                                           | 默认值 |
| ----------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------- | ------ |
| loadData                      | 加载数据                                                                    | Promise\<any>                                  |        |
| reloadData                    | 加载数据并清除所有状态                                                      | Promise\<any>                                  |        |
| loadColumn                    | 加载列配置                                                                  | Promise\<any>                                  |        |
| reloadColumn                  | 加载列配置并恢复到初始状态                                                  | Promise\<any>                                  |        |
| refreshColumn                 | 刷新列配置                                                                  | Promise\<any>                                  |        |
| insert(records)               | 往表格插入临时数据，从第一行插入一行或多行新数据                            | Promise<{row, rows}>                           |        |
| remove(rows)                  | 删除指定行数据，指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据 | Promise<{row, rows}>                           |        |
| removeCheckboxRow             | 删除复选框选中的行数据                                                      | Promise<{row, rows}>                           |        |
| getTableData()                | 获取当前表格的数据（建议使用fullData）                                      | {fullData, visibleData, tableData, footerData} |        |
| getRecordset()                | 获取表格数据集（获取插入、删除、更改的数据，对于增删改查表格非常方便）      | {insertRecords, removeRecords, updateRecords}  |        |
| getCheckboxRecords(isFull)    | 用于 type=checkbox，获取当前已选中的行数据                                  | Array\<Row>                                    |        |
| setEditRow(row)               | 用于 edit-config，激活行编辑并激活第一个单元格                              | Promise\<any>                                  |        |
| setCheckboxRow(rows, checked) | 用于 type=checkbox 复选框，设置行为选中状态，第二个参数为选中与否           | Promise\<any>                                  |        |
| setAllCheckboxRow(checked)    | 用于 type=checkbox，设置所有行的选中状态                                    | Promise\<any>                                  |        |
| clearCheckboxRow()            | 用于 type=checkbox，手动清空用户的选择                                      | Promise\<any>                                  |        |
| clearEdit()                   | 手动清除单元格激活状态                                                      | Promise\<any>                                  |        |
| clearEdit()                   | 手动清除单元格激活状态                                                      | Promise\<any>                                  |        |
| clearValidate()               | 手动清除校验                                                                | Promise\<any>                                  |        |
| validate()                    | 快速校验                                                                    | Promise\<any>                                  |        |

完整的API文档请查看[vxe-grid](https://vxetable.cn/#/grid/api)

### `getGridProps`
getGridProps调整了一些默认参数，并添加了数据校验，可以覆盖
```javascript
export const getGridProps = (props: VxeGridProps) => {
  const gridProps = merge(
    {
      border: false, // 不显示边框
      showOverflow: 'tooltip', // 超出显示...和tooltip
      keepSource: true, 
      editConfig: {  // 点击按行切换编辑状态
        trigger: 'click',
        mode: 'row',
        showStatus: true,
      },
      filterConfig: {
        remote: true, // 启动远程过滤
      },
      sortConfig: {
        remote: true, // 启动远程排期
        chronological: true, // 按点击先后顺序排序
      },
      rowConfig: {
        isHover: true, // 显示行悬浮效果
      },
    },
    props
  ) as VxeGridProps
  gridProps.columns?.forEach(column => { // 对于有过滤需求的，添加filters配置
    if (column.filterRender) {
      column.filters = [{ data: undefined }]
    }
  })
  return reactive(gridProps)
}
```

### `createRule`
用于快速生成校验规则。该校验也可以用于antd Form校验，目前包含
| 方法名称                    | 说明                |
| --------------------------- | ------------------- |
| createRule.required()       | 必填校验            |
| createRule.requiredSelect() | 必选校验            |
| createRule.tel()            | 电话号码            |
| createRule.phone()          | 手机号码            |
| createRule.dept()           | 一级-二级-三级 部门 |
| createRule.positiveInt()    | 正整数              |
| createRule.price()          | 价格                |
| createRule.email()          | 邮箱格式            |
| createRule.number()         | 数字                |
| createRule.integer()        | 整数                |
| createRule.url()            | 链接地址            |
| createRule.ip()             | IP地址              |

> table校验使用时，强烈建议传入`{ trigger: 'manual' }`，手动触发以提高表格性能

### 渲染器

渲染器相当于已集成到table的组件。主要使用可编辑渲染editRender，筛选渲染filterRender，单元格渲染cellRender等。详见[官方文档](https://vxetable.cn/#/table/renderer/api)
#### 添加渲染器
使用vextable插件的形式添加渲染器。工具方法getRender用于获取对应插件
```javascript
VXETable.use(eTable.getRender(prefix, adaptOptions))
```
| 参数名称     | 说明                                                                                                          | 默认值 |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ------ |
| prefix       | 项目中的 antd-v 组件类名前缀                                                                                  | ant    |
| adaptOptions | 是否自适应选项。针对XSelect和XCascadeSelect，启用后，在编辑时自动去掉disabled选项，过滤时亦可选择disabled选项 | false  |

#### 使用渲染器
editRender、filterRender、cellRender均定义在列信息columns。editRender、cellRender不可同时启用。用法为
```javascript
{
  editRender: {
    name: 'XPriceInput', // 渲染器名称
    props: {  // 属性
      ...
    },
    events: {  // 事件
      ...
    },
  },
}
```

#### 已额外添加的基于antd组件的渲染器列表
下面的渲染器都可以在例子中找到用法。如无特殊说明，参数和原antd组件一致
| 名称             | 场景                     | 说明                                               |     |
| ---------------- | ------------------------ | -------------------------------------------------- | --- |
| XInput           | editRender、filterRender | 输入框                                             |     |
| XInputNumber     | editRender、filterRender | 数字输入框                                         |     |
| XPriceInput      | editRender               | 价格输入框                                         |     |
| XAutoComplete    | editRender               | 自动完成输入框。目前在大数据量下还有性能问题待解决 |     |
| XDatePicker      | editRender               | 日期选择器                                         |     |
| XRangePicker     | editRender               | 日期区间选择器                                     |     |
| XTimePicker      | editRender               | 时间选择器                                         |     |
| XTimeRangePicker | editRender               | 时间区间选择器                                     |     |
| XYearMonthPicker | editRender               | 年月选择器（财务系统用）                           |     |
| XSelect          | editRender、filterRender | 选择器                                             |     |
| XCascadeSelect   | editRender               | 两列级联选择器，定义在子选择列                     |     |
| XCascader        | editRender               | 级联选择器                                         |     |
| XRate            | editRender               | 评分                                               |     |
| XSwitch          | editRender               | 开关                                               |     |
| XCheckbox        | editRender               | 勾选                                               |     |

特殊渲染器api说明
| 名称             | 说明                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| XPriceInput      | 在本组件库PriceInput基础上，添加属性 `getDigits(row)` 用于动态获取小数位数                                                                                  |
| XYearMonthPicker | 绑定了列字段名 `year` 和 `month`，一般用于财务系统用账期选择                                                                                                |
| XSelect          | 默认开启按label本地筛选 `adaptOptions`是否自适应选项                                                                                                        |
| XCascadeSelect   | `parentField`:指定父及字段名，`optionsMap`:Map类型指定父子层级， `options`:children字段定义的级联数据，优先级比`optionsMap`低, `adaptOptions`:是否自适应选项 |

#### 自建渲染器
如果上述渲染器无法满足业务需求，可以自建渲染器。这里提供一些工具用来快速将已有组件转化为渲染器。这块有些复杂，可以查看工具源码
```javascript
const { createLazyEditRender, createEditRender, createFilterRender, getEditProps, getEditOns, getClearEvent } = eTable;
```

| 名称                 | 说明                                               |     |
| -------------------- | -------------------------------------------------- | --- |
| createLazyEditRender | 创建懒输入编辑渲染器，只有编辑框失焦后才会更新数据 |     |
| createEditRender     | 创建普通编辑渲染器                                 |     |
| createFilterRender   | 创建过滤渲染器                                     |     |
| getEditProps         | 获取编辑渲染组件属性                               |     |
| getEditOns           | 获取编辑渲染组件事件                               |     |
| getClearEvent        | 获取拦截点击类名回调事件                           |     |

getClearEvent使用场景  
点击了某个组件的弹出层面板之后，此时被激活单元格不应该被自动关闭，可将弹出面板类名传入而阻止编辑状态关闭
```javascript
import VXETable from 'vxe-table'
VXETable.interceptor.add('event.clearEdit', getClearEvent(['className']))
```
参见[文档](https://vxetable.cn/#/table/interceptor/api)

### HOOKS
利用hooks连接事件，发送请求
```javascript
// useTableSever 用于标准接口数据结构规范， useTableSever4Fin用于财务现有接口数据结构
const { useTableSever, useTableSever4Fin } = eTable;
```

#### `useTableSever<T>`
泛型T可传入行数据类型，入参为一个对象，对象属性 API 如下
| 名称                    | 类型/默认值                 | 说明                                       |
| ----------------------- | --------------------------- | ------------------------------------------ |
| queryOnInit             | false                       | 初始化时自动调用一次queryService           |
| autoQueryOnParameChange | false                       | 查询条件改变后自动调用queryService         |
| queryService            |                             | 请求接口，入参调用接口参数                 |
| saveService             |                             | 保存时调用，成功后自动调用一次queryService |
| deleteService           |                             | 删除时调用，成功后自动调用一次queryService |
| beforeQuery             |                             | 请求接口前调用，入参是所有查询条件         |
| afterQuery              |                             | 请求接口成功后调用，入参接口返回数据       |
| pagination              | { pageNo: 1, pageSize: 50 } | 分页信息                                   |
| params                  |                             | 查询条件                                   |
| filters                 |                             | 筛选条件                                   |
| orderItemList           |                             | 排序条件                                   |
| initData                |                             | 初始化数据                                 |

返回参为一个对象，对象属性 API 如下。数据除了event 全是Ref类型
| 名称            | 说明                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| loading         | 接口调用中为true                                                                                                             |
| pagerConfig     | 表格分页配置，用于vxe-grid属性配置，也可以手动修改实现翻页                                                                   |
| filters         | 筛选条件                                                                                                                     |
| orderItemList   | 排序条件，财务返回名称为sorter                                                                                               |
| server          | 请求调用，包含queryData,refreshData,saveData,deleteData四种主动请求，入参会传入对应service                                   |
| data            | 表格数据                                                                                                                     |
| selections      | 表格勾选数据                                                                                                                 |
| ignoreNextWatch | 忽略下一次自动调用一次queryService，在有些场景会用到                                                                         |
| events          | 预设事件，可直接用于vxe-grid的v-on绑定事件，亦可展开添加其他事件。如果要添加同名事件监听，不要忘了在新写事件中调用返回的事件 |

events包含
| 事件名称       | 说明         |
| -------------- | ------------ |
| filterChange   | 筛选事件     |
| sortChange     | 排序事件     |
| pageChange     | 分页信息事件 |
| checkboxChange | 勾选事件     |
| checkboxAll    | 全选事件     |

> 注意：useTableSever内部处理的数据要符合[接口开发规范](https://docs.popo.netease.com/lingxi/3a6b0438610d4f26af5978c550d6e4ca#DuOC-1660543654003)，如果不满足，需要前端做一次转换。可以在定义各个service的时候做，也可以在统一的响应拦截器中做，建议后者。

定义service时举例
```javascript
// 请求接口转化后满足以下结构即可
// {
//   code: '0',
//   data: {
//     list: [],
//     total: 0,
//   }
// }
// 保存、删除接口转化后满足以下结构即可
// {
//   code: '0',
// }
useTableSever({
  async queryService (params) {
    const res = api.query(params)
    return convertData(res)
  },
  async saveService (params) {
    const res = api.save(params)
    return convertData(res)
  },
  ... // 其他入参
})
```

## Contribute

贡献者

<img src="/github12.webp" style="width: 66px; border-radius: 33px;" title="zhubincong@corp.netease.com"  />
