import { h } from 'vue'
import {
  Input,
  Select,
  InputNumber,
  DatePicker,
  RangePicker,
  TimePicker,
  TimeRangePicker,
  AutoComplete,
  Cascader,
  Checkbox,
  Switch,
  Rate,
} from 'ant-design-vue'
import { VXETableCore } from 'vxe-table'
import PriceInput from '../../price-input/price-input.vue'

import {
  createLazyEditRender,
  createEditRender,
  createFilterRender,
  getEditProps,
  getOns,
  getSelectedLableList,
  getCascadeOptions,
  getClearEvent,
} from './renderUtils'

/**
 * 用于生成渲染器插件
 * @property prefix antd样式头
 * @property adaptOptions 是否自适应选项。针对XSelect和XCascadeSelect，在编辑时自动去掉disabled选项，过滤时亦可选择disabled选项
 *
 */
export default function getRender(prefix = 'ant', adaptOptions = false) {
  // 下拉框、级联、时间选择等
  // 其他点击后不希望取消编辑状态的css都可以添加
  const classList = [
    `${prefix}-select-dropdown`,
    `${prefix}-select-clear`,
    `${prefix}-cascader-menus`,
    `${prefix}-picker-dropdown`,
  ]
  const handleClearEvent = getClearEvent(classList)
  return {
    install(vxetablecore: VXETableCore) {
      const { interceptor, renderer } = vxetablecore
      renderer.mixin({
        XInput: {
          autofocus: `input.${prefix}-input`,
          renderEdit: createLazyEditRender(Input),
          renderFilter: createFilterRender(Input),
          showFilterFooter: false,
        },
        XInputNumber: {
          autofocus: `input.${prefix}-input-number-input`,
          renderEdit: createLazyEditRender(InputNumber),
          renderFilter: createFilterRender(InputNumber),
          showFilterFooter: false,
        },
        // 可编辑价格输入框
        XPriceInput: {
          autofocus: `.${prefix}-input`,
          renderCell(renderOpts, params) {
            const { row, column } = params
            const { props = {} } = renderOpts
            const { alignRight = true, getDigits } = props
            // 通过getDigit方法获取动态小数位
            const digits = (typeof getDigits === 'function' ? getDigits(row) : props.digits) ?? 2
            return [
              <div style={{ 'text-align': alignRight ? 'right' : 'initial' }}>
                {row[column.field]?.toLocaleString(undefined, {
                  maximumFractionDigits: digits,
                  minimumFractionDigits: digits,
                })}
              </div>,
            ]
          },
          renderEdit: createLazyEditRender(PriceInput, {}, (renderOpts, params) => {
            const { row } = params
            const props = renderOpts.props ?? {}
            const { getDigits } = props
            // 通过getDigit方法获取动态小数位
            const digits = (typeof getDigits === 'function' ? getDigits(row) : props.digits) ?? 2
            return { digits, getDigits: undefined }
          }),
          renderFilter: createFilterRender(PriceInput, { digits: 4 }),
          showFilterFooter: false,
        },
        XAutoComplete: {
          autofocus: `input.${prefix}-select-selection-search-input`,
          renderEdit: createEditRender(AutoComplete),
          renderFilter: createFilterRender(AutoComplete),
          showFilterFooter: false,
        },
        XDatePicker: {
          autofocus: `.${prefix}-picker-input>input`,
          renderEdit: createEditRender(DatePicker, {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
          }),
          renderFilter: createFilterRender(DatePicker, {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
          }),
          showFilterFooter: false,
        },
        XRangePicker: {
          autofocus: `.${prefix}-picker-input>input`,
          renderCell(renderOpts, { row, column }) {
            const cellValue = row[column.field]
            return Array.isArray(cellValue) && cellValue.length === 2 ? `${cellValue[0]} ~ ${cellValue[1]}` : cellValue
          },
          renderEdit: createEditRender(RangePicker, {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
          }),
          renderFilter: createFilterRender(RangePicker, {
            format: 'YYYY-MM-DD',
            valueFormat: 'YYYY-MM-DD',
          }),
          showFilterFooter: false,
        },
        XTimePicker: {
          autofocus: `.${prefix}-picker-input>input`,
          renderEdit: createEditRender(TimePicker, {
            valueFormat: 'HH:mm:ss',
          }),
          renderFilter: createFilterRender(TimePicker, {
            valueFormat: 'HH:mm:ss',
          }),
          showFilterFooter: false,
        },
        XTimeRangePicker: {
          autofocus: `.${prefix}-picker-input>input`,
          renderCell(renderOpts, { row, column }) {
            const cellValue = row[column.field]
            return Array.isArray(cellValue) && cellValue.length === 2 ? `${cellValue[0]} ~ ${cellValue[1]}` : cellValue
          },
          renderEdit: createEditRender(TimeRangePicker, {
            valueFormat: 'HH:mm:ss',
          }),
          renderFilter: createFilterRender(TimeRangePicker, {
            valueFormat: 'HH:mm:ss',
          }),
          showFilterFooter: false,
        },
        XYearMonthPicker: {
          autofocus: `.${prefix}-picker-input>input`,
          renderCell(renderOpts, { row }) {
            return `${row.year}-${row.month}`
          },
          renderEdit(renderOpts, params) {
            const { row } = params
            const { attrs } = renderOpts
            const cellValue = `${row.year}-${row.month}`
            return [
              h(DatePicker, {
                ...attrs,
                ...getEditProps(renderOpts, cellValue, 'value', {
                  picker: 'month',
                  placeholder: '请选择月份',
                  format: 'YYYY-MM',
                  valueFormat: 'YYYY-MM',
                }),
                ...getOns(
                  renderOpts,
                  params,
                  'value',
                  (value: any) => {
                    const [year, month] = value.split('-')
                    row.year = year
                    row.month = month
                  },
                  (value: any) => {
                    // 处理 change
                    params.$table.updateStatus(params, value)
                  }
                ),
              }),
            ]
          },
        },
        XSelect: {
          autofocus: `.${prefix}-input`,
          renderCell(renderOpts, { row, column }) {
            const props = renderOpts.props ?? {}
            if (!row[column.field]) return row[column.field]
            const cellValue: any[] = props.mode === 'multiple' ? row[column.field] : [row[column.field]]
            const options = props.options ?? []
            const labelList = getSelectedLableList(cellValue, options)
            return labelList.join(' \n')
          },
          renderEdit: createEditRender(
            Select,
            {
              optionFilterProp: 'label',
              showSearch: true,
            },
            (renderOpts) => {
              const props = renderOpts.props ?? {}
              if (!props?.options) return
              // 如果未设置了adaptOptions，则保持原选项
              if (!(adaptOptions || props.adaptOptions)) return
              // 过滤置灰选项并缓存
              if (!props._options) {
                props._options = props.options.filter((item) => !item.disabled)
              }
              return { options: props._options, _options: undefined, adaptOptions: undefined }
            }
          ),
          renderFilter: createFilterRender(
            Select,
            {
              optionFilterProp: 'label',
              showSearch: true,
              mode: 'multiple',
            },
            (renderOpts) => {
              const props = renderOpts.props ?? {}
              if (!props?.options) return
              // 如果未设置了adaptOptions，则保持原选项
              if (!(adaptOptions || props.adaptOptions)) return
              if (!props._options) {
                // 否则激活置灰选项
                props._options = props.options.map((item) => ({ ...item, disabled: false }))
              }
              return { options: props._options, _options: undefined, adaptOptions: undefined }
            }
          ),
          showFilterFooter: false,
        },
        XCascadeSelect: {
          autofocus: `.${prefix}-input`,
          renderCell(renderOpts, { row, column }) {
            const props = renderOpts.props ?? {}
            if (!row[column.field]) return row[column.field]
            const cellValue: any[] = props.mode === 'multiple' ? row[column.field] : [row[column.field]]
            const parentValue = row[props.parentField]
            const options = getCascadeOptions(props, parentValue)
            const labelList = getSelectedLableList(cellValue, options)
            return labelList.join(' \n')
          },
          renderEdit: createEditRender(
            Select,
            {
              optionFilterProp: 'label',
              showSearch: true,
            },
            (renderOpts, params) => {
              const props = renderOpts.props ?? {}
              const { row } = params
              const parentValue = row[props.parentField]
              const options = getCascadeOptions(props, parentValue)
              // 如果未设置了adaptOptions，则保持原选项
              if (!(adaptOptions || props.adaptOptions)) {
                return { options, parentField: undefined, optionsMap: undefined }
              }
              // 否则过滤置灰选项。这里不太好做缓存
              return {
                options: options.filter((item) => !item.disabled),
                parentField: undefined,
                optionsMap: undefined,
                adaptOptions: undefined,
              }
            }
          ),
        },
        XCascader: {
          renderCell(renderOpts, { row, column }) {
            const props = renderOpts.props ?? {}
            const cellValue: any[] = row[column.field]
            const multiple = props.multiple
            if (!Array.isArray(cellValue)) return cellValue
            let cellList: any[][] = []
            if (multiple) {
              cellList = cellValue
            } else {
              cellList = [cellValue]
            }
            return cellList
              .map((cell) => {
                const labelValue: any[] = []
                cell.reduce((prev, curr) => {
                  if (!prev || !prev.length) {
                    labelValue.push(curr)
                    return []
                  }
                  const option = prev.find((item) => item.value === curr)
                  if (option) {
                    labelValue.push(option.label)
                    return option.children
                  } else {
                    labelValue.push(curr)
                    return []
                  }
                }, props.options)
                return labelValue.join(' / ')
              })
              .join(' \n')
          },
          renderEdit: createEditRender(Cascader, { showSearch: true }),
          renderFilter: createFilterRender(Cascader, { showSearch: true }),
          showFilterFooter: false,
        },
        XRate: {
          renderCell: createEditRender(Rate, { disabled: true }),
          renderEdit: createEditRender(Rate),
          renderFilter: createFilterRender(Rate),
          showFilterFooter: false,
        },
        XSwitch: {
          renderCell: createEditRender(Switch, { readonly: true }, {}, 'checked'),
          renderEdit: createEditRender(Switch, {}, {}, 'checked'),
          renderFilter: createFilterRender(Switch, {}, {}, 'checked'),
          showFilterFooter: false,
        },
        XCheckbox: {
          renderCell: createEditRender(Checkbox, { readonly: true }, {}, 'checked'),
          renderEdit: createEditRender(Checkbox, {}, {}, 'checked'),
          renderFilter: createFilterRender(Checkbox, {}, {}, 'checked'),
          showFilterFooter: false,
        },
      })
      interceptor.add('event.clearFilter', handleClearEvent)
      interceptor.add('event.clearActived', handleClearEvent)
      interceptor.add('event.clearAreas', handleClearEvent)
    },
  }
}
