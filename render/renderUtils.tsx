/* eslint-disable @typescript-eslint/ban-ts-comment */
import { h, resolveComponent, ConcreteComponent, Component } from 'vue'
import { VxeColumnPropTypes, VxeGlobalInterceptorHandles, VxeGlobalRendererHandles } from 'vxe-table'
import FilterBtn from './filter-btn.vue'
import LazyInputShell from './lazy-input-shell.vue'

/**
 * 懒输入编辑渲染器
 * @param compName 组件名称或组件
 * @param defaultProps 默认属性
 * @param coverProps 强制覆盖属性或回调
 * @param modelName model双向绑定属性
 * @returns
 */
export function createLazyEditRender(
  componentName: string | ConcreteComponent | Component,
  defaultProps?: { [key: string]: any },
  coverProps?:
    | { [key: string]: any }
    | ((
        renderOpts: VxeColumnPropTypes.EditRender,
        params: VxeGlobalRendererHandles.RenderEditParams
      ) => { [key: string]: any }),
  modelName = 'value'
) {
  return function (renderOpts: VxeColumnPropTypes.EditRender, params: VxeGlobalRendererHandles.RenderEditParams) {
    const { row, column } = params
    const { attrs } = renderOpts
    const cellValue = row[column.field]
    return [
      h(
        // @ts-ignore
        LazyInputShell,
        {
          ...attrs,
          ...getEditProps(
            renderOpts,
            cellValue,
            modelName,
            defaultProps,
            typeof coverProps === 'function' ? coverProps(renderOpts, params) : coverProps
          ),
          ...getEditOns(renderOpts, params, modelName),
        },
        {
          default: (slotProps) =>
            h(
              // @ts-ignore
              typeof componentName === 'string' ? resolveComponent(componentName) : componentName,
              slotProps
            ),
        }
      ),
    ]
  }
}
/**
 * 普通编辑渲染器
 * @param compName 组件名称
 * @param defaultProps 默认属性
 * @param coverProps 强制覆盖属性或回调
 * @param modelName model双向绑定属性
 * @returns
 */
export function createEditRender(
  componentName: string | ConcreteComponent | Component,
  defaultProps?: { [key: string]: any },
  coverProps?:
    | { [key: string]: any }
    | ((
        renderOpts: VxeColumnPropTypes.EditRender,
        params: VxeGlobalRendererHandles.RenderEditParams
      ) => { [key: string]: any }),
  modelName = 'value'
) {
  return function (renderOpts: VxeColumnPropTypes.EditRender, params: VxeGlobalRendererHandles.RenderEditParams) {
    const { row, column } = params
    const { attrs } = renderOpts
    const cellValue = row[column.field]
    return [
      h(
        // @ts-ignore
        typeof componentName === 'string' ? resolveComponent(componentName) : componentName,
        {
          ...attrs,
          ...getEditProps(
            renderOpts,
            cellValue,
            modelName,
            defaultProps,
            typeof coverProps === 'function' ? coverProps(renderOpts, params) : coverProps
          ),
          ...getEditOns(renderOpts, params, modelName),
        }
      ),
    ]
  }
}

/**
 * 过滤渲染器
 * @param compName 组件名称
 * @param defaultProps 默认属性
 * @param modelName model双向绑定属性
 * @param coverProps 强制覆盖属性或回调
 * @returns
 */
export function createFilterRender(
  componentName: string | ConcreteComponent | Component,
  defaultProps?: { [key: string]: any },
  coverProps?:
    | { [key: string]: any }
    | ((
        renderOpts: VxeColumnPropTypes.FilterRender,
        params: VxeGlobalRendererHandles.RenderFilterParams
      ) => { [key: string]: any }),
  modelName = 'value'
) {
  return function (renderOpts: VxeColumnPropTypes.FilterRender, params: VxeGlobalRendererHandles.RenderFilterParams) {
    const { column } = params
    const { attrs } = renderOpts
    const filterItem = column.filters[0]
    const filterValue = filterItem.data
    if (filterValue) {
      filterItem._checked = true
    }
    return [
      h(
        'div',
        {
          class: 'vxe-table--filter-antd-wrapper',
        },
        [
          h(FilterBtn, { params }),
          h(
            // @ts-ignore
            typeof componentName === 'string' ? resolveComponent(componentName) : componentName,
            {
              ...attrs,
              ...getEditProps(
                renderOpts,
                filterValue,
                modelName,
                defaultProps,
                typeof coverProps === 'function' ? coverProps(renderOpts, params) : coverProps
              ),
              ...getOns(
                renderOpts,
                params,
                modelName,
                (value: any) => {
                  // 处理 model 值双向绑定
                  filterItem.data = value
                },
                () => params.$panel.changeOption(null, Boolean(filterItem.data), filterItem)
              ),
            }
          ),
        ]
      ),
    ]
  }
}
/**
 * 获取编辑渲染组件属性，过滤undefined字段
 * @param renderOpts
 * @param value 单元格值
 * @param modelName 单元格字段
 * @param defaultProps 默认属性
 * @returns
 */
export function getEditProps(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  value: any,
  modelName: string,
  defaultProps?: { [prop: string]: any },
  coverProps?: { [prop: string]: any }
) {
  return Object.entries(
    Object.assign({}, defaultProps, renderOpts.props, coverProps, {
      [modelName]: value,
    })
  )
    .filter((item) => item[1] !== undefined)
    .reduce((acc, item) => {
      acc[item[0]] = item[1]
      return acc
    }, {})
}

/**
 * 获取编辑渲染组件事件
 * @param renderOpts
 * @param params
 * @param modelName
 * @returns
 */
export function getEditOns(
  renderOpts: VxeColumnPropTypes.EditRender,
  params: VxeGlobalRendererHandles.RenderEditParams,
  modelName: string
) {
  const { $table, row, column } = params
  return getOns(
    renderOpts,
    params,
    modelName,
    (value: any) => {
      // 处理 model 值双向绑定
      row[column.field] = value
    },
    (value: any) => {
      // 处理 change
      $table.updateStatus(params, value)
    }
  )
}

/**
 * 获取渲染组件事件
 * @param renderOpts
 * @param params
 * @param modelName
 * @param modelFunc 双向绑定回调
 * @param changeFunc 数据更新回调
 * @returns
 */
export function getOns(
  renderOpts: VxeGlobalRendererHandles.RenderOptions,
  params: VxeGlobalRendererHandles.RenderParams,
  modelName: string,
  modelFunc?: (val: any) => void,
  changeFunc?: (val: any) => void
) {
  const events = renderOpts.events ?? {}
  const modelEvent = `update:${modelName}`
  const changeEvent = 'change'
  const ons: { [key: string]: (...args: any[]) => any } = {}
  Object.keys(events).forEach((key) => {
    const func = events[key]
    ons[getOnName(key)] = function (...args: any[]) {
      func(params, ...args)
    }
  })
  if (modelFunc) {
    ons[getOnName(modelEvent)] = function (value: any) {
      modelFunc(value)
      if (events && events[modelEvent]) {
        events[modelEvent](params, value)
      }
    }
  }
  if (changeFunc) {
    ons[getOnName(changeEvent)] = function (targetEvent: any) {
      const value = targetEvent instanceof Event ? (targetEvent.target as HTMLInputElement)?.value : targetEvent
      changeFunc(value)
      if (events && events[changeEvent]) {
        events[changeEvent](params, value)
      }
    }
  }
  return ons
}

/**
 * 获取事件名称
 * @param type
 * @returns
 */
function getOnName(type: string) {
  return `on${type.substring(0, 1).toLocaleUpperCase()}${type.substring(1)}`
}

export function getSelectedLableList(valueList: any[], options: any[]) {
  return valueList.reduce((pre, curr) => {
    const select = options.find((item) => item.value === curr)
    const label = select ? select.label : curr
    pre.push(label)
    return pre
  }, [])
}

export function getCascadeOptions(props, parentValue: any) {
  if (!(props.optionsMap instanceof Map)) {
    props.optionsMap = new Map()
    props.options.forEach((item) => {
      props.optionsMap.set(item.value, item.children)
    })
  }
  return props.optionsMap.get(parentValue) ?? []
}

/**
 * 获取拦截点击类名事件
 * @param 要拦截点击的类名
 */
export function getClearEvent(classList: string[]) {
  return function handleClearEvent(
    params:
      | VxeGlobalInterceptorHandles.InterceptorClearFilterParams
      | VxeGlobalInterceptorHandles.InterceptorClearActivedParams
      | VxeGlobalInterceptorHandles.InterceptorClearAreasParams
  ) {
    const { $event } = params
    if (
      // 不希望取消编辑状态的css
      classList.some((className) => getEventTargetNode($event, className))
    ) {
      return false
    }
  }
}

/**
 * 检查触发源是否属于目标节点
 */
function getEventTargetNode(evnt: any, className: string) {
  return evnt.composedPath().some((ele) => ele.classList?.contains(className))
}
