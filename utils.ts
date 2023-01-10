import { reactive } from 'vue'
import { VxeGridProps } from 'vxe-table'
import merge from 'lodash-es/merge'

/**
 * 获取默认Grid属性配置
 * @param props
 * @returns
 */
export const getGridProps = (props: VxeGridProps) => {
  const gridProps = merge(
    {
      border: false,
      showOverflow: 'tooltip',
      keepSource: true,
      height: 'auto',
      columns: [],
      editConfig: {
        trigger: 'click',
        mode: 'row',
        showStatus: true,
      },
      filterConfig: {
        remote: true,
      },
      sortConfig: {
        remote: true,
        chronological: true, // 按点击先后顺序排序
      },
      rowConfig: {
        isHover: true,
      },
      scrollY: {
        scrollToTopOnChange: true,
      }
    },
    props
  ) as VxeGridProps
  gridProps.columns?.forEach(column => {
    if (column.filterRender) {
      column.filters = [{ data: undefined }]
    }
  })
  return reactive(gridProps)
}

export const pattern = {
  // http://emailregex.com/
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  // https://urlregex.com/
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/,
  // https://ipregex.com/
  IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  tel: /^\d+[\d-]{3,}\d+$/,
  phone: /^1\d{10}$/,
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,
  price: /^-?(0|([1-9]\d*))(\.\d{1,2})?$/,
  integer: /^-?\d+$/,
  positiveInt: /^-?\d+$/,
  // 三级组织
  dept: /^[^-]+-[^-]+-[^-]+$/,
}
export const createRule = {
  required: (msg: string, props?: Record<string, any>) => ({
    required: true,
    message: `请输入${msg}`,
    ...props,
  }),
  requiredSelect: (msg: string, props?: Record<string, any>) => ({
    required: true,
    message: `请选择${msg}`,
    ...props,
  }),
  tel: (props?: Record<string, any>) => ({
    pattern: pattern.tel,
    message: '请输入正确的电话号码',
    ...props,
  }),
  phone: (props?: Record<string, any>) => ({
    pattern: pattern.phone,
    message: '请输入正确的手机号码',
    ...props,
  }),
  dept: (props?: Record<string, any>) => ({
    pattern: pattern.dept,
    message: '请输入正确格式例如：“一级-二级-三级”',
    ...props,
  }),
  positiveInt: (props?: Record<string, any>) => ({
    pattern: pattern.positiveInt,
    message: '请输入正整数',
    ...props,
  }),
  price: (props?: Record<string, any>) => ({
    pattern: pattern.price,
    message: '请输入正确的价格格式',
    ...props,
  }),
  email: (props?: Record<string, any>) => ({
    pattern: pattern.email,
    message: '请输入正确的邮箱格式',
    ...props,
  }),
  number: (props?: Record<string, any>) => ({
    type: 'number',
    message: '请输入正确的数字',
    ...props,
  }),
  integer: (props?: Record<string, any>) => ({
    pattern: pattern.integer,
    message: '请输入整数',
    ...props,
  }),
  url: (props?: Record<string, any>) => ({
    pattern: pattern.url,
    message: '请输入正确的链接地址',
    ...props,
  }),
  ip: (props?: Record<string, any>) => ({
    pattern: pattern.IP,
    message: '请输入正确的IP地址',
    ...props,
  }),
}
