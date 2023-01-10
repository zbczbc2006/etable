import { Ref, ref, watch } from 'vue'
import { VxeGridDefines } from 'vxe-table'
import { UseTableSeverOption, Row, PagerConfig } from '../types'

const defaultOption = {
  queryOnInit: false,
  autoQueryOnParameChange: false,
  initData: [],
  pagination: { pageNo: 1, pageSize: 50 },
}

/**
 * 转换过滤选项
 * @param eventParams
 * @param enabledQueryWay
 * @returns
 */
const conversionFilterData = (eventParams: VxeGridDefines.FilterChangeEventParams) => {
  const res = {}
  eventParams.filterList.forEach((item) => {
    res[item.field] = Array.isArray(item.datas[0]) ? item.datas[0] : item.datas
  })
  return res
}

export default function <T = Row>(userOptions: UseTableSeverOption<T>) {
  const options = Object.assign({}, defaultOption, userOptions) as UseTableSeverOption<T>
  const params = ref(options.params)
  const filters = ref(options.filters)
  const orderItemList = ref(options.orderItemList)
  const loading = ref(false)
  // 这里这样定义类型是有必要的
  const data = ref(options.initData) as Ref<T[]>
  const selections = ref([]) as Ref<T[]>
  const pagerConfig = ref<PagerConfig>({
    currentPage: options.pagination!.pageNo,
    pageSize: options.pagination!.pageSize,
    total: 0,
    border: true,
    layouts: ['PrevPage', 'Number', 'NextPage', 'Sizes', 'FullJump'],
    pageSizes: [50, 100, 200, 500, 1000],
  })
  pagerConfig.value.slots = {
    left() {
      return `第 ${(Number(pagerConfig.value.currentPage) - 1) * Number(pagerConfig.value.pageSize) + 1}~${Math.min(
        Number(pagerConfig.value.currentPage) * Number(pagerConfig.value.pageSize),
        Number(pagerConfig.value.total)
      )} 条 / 共 ${pagerConfig.value.total} 条`
    },
  }

  const ignoreNextWatch = ref(false) // 忽略下一次的监听刷新
  let otherParamsBak

  /**
   * 查询数据，页面会重置到第一页
   */
  const queryData = async function (otherParams?: Record<string, any>) {
    if (pagerConfig.value.currentPage !== 1) {
      // 改变页码会触发查询，这里忽略下次查询
      pagerConfig.value.currentPage = 1
      ignoreNextWatch.value = true
    }
    return refreshData(otherParams)
  }

  /**
   * 刷新当前页数据
   */
  const refreshData = async function (otherParams?: Record<string, any>) {
    if (!options.queryService) throw new Error('未定义参数queryService')
    const queryData = {
      params: params.value,
      filters: filters.value,
      orderItemList: orderItemList.value,
      pageNo: pagerConfig.value.currentPage,
      pageSize: pagerConfig.value.pageSize,
      ...otherParams,
    }
    if (options.beforeQuery && !(await options.beforeQuery(queryData))) return
    otherParamsBak = otherParams
    loading.value = true
    try {
      const res = await options.queryService(queryData)
      loading.value = false
      const list = res.data?.list
      if (res.code !== '0' || !Array.isArray(list)) {
        return Promise.reject(res)
      }
      // 非第一页数据为空，则跳转到前一页
      if (list.length === 0 && pagerConfig.value.currentPage > 1) {
        ignoreNextWatch.value = true
        pagerConfig.value.currentPage--
        return refreshData(otherParams)
      }
      data.value = list
      pagerConfig.value.total = res.data.total
      selections.value = []
      if (options.afterQuery) {
        options.afterQuery(res, queryData)
      }
      return res
    } catch (error) {
      loading.value = false
      return Promise.reject(error)
    }
  }

  /**
   * 保存数据
   * @param data 会传入保存接口的数据
   * @param autoQuery 接口请求成功后自动调用一次查询，默认true
   */
  const saveData = async function (data: any, autoQuery = true) {
    if (!options.saveService) throw new Error('未定义参数saveService')
    loading.value = true
    try {
      const res = await options.saveService(data)
      loading.value = false
      if (res.code !== '0') {
        return Promise.reject(res)
      }
      if (autoQuery) refreshData(otherParamsBak)
      return res
    } catch (error) {
      loading.value = false
      return Promise.reject(error)
    }
  }

  /**
   * 删除数据
   * @param data 会传入删除接口的数据
   * @param autoQuery 接口请求成功后自动调用一次查询，默认true
   */
  const deleteData = async function (data: T | T[] | string | string[] | number | number[], autoQuery = true) {
    if (!options.deleteService) throw new Error('未定义参数deleteService')
    loading.value = true
    try {
      const res = await options.deleteService(data)
      loading.value = false
      if (res.code !== '0') {
        return Promise.reject(res)
      }
      if (autoQuery) refreshData(otherParamsBak)
      return res
    } catch (error) {
      loading.value = false
      return Promise.reject(error)
    }
  }

  // 查询条件
  if (options.autoQueryOnParameChange) {
    watch(
      params,
      () => {
        if (ignoreNextWatch.value) {
          ignoreNextWatch.value = false
          return
        }
        queryData(otherParamsBak)
      },
      { deep: true }
    )
  }
  // filters, orderItemList, pagination改变，自动触发查询
  // filters、pageSize 改变时重置到第一页
  watch([filters, () => pagerConfig.value.pageSize], () => {
    if (ignoreNextWatch.value) {
      ignoreNextWatch.value = false
      return
    }
    queryData(otherParamsBak)
  })
  // sorter、currentPage 改变时保持当前页
  watch([orderItemList, () => pagerConfig.value.currentPage], () => {
    if (ignoreNextWatch.value) {
      ignoreNextWatch.value = false
      return
    }
    refreshData(otherParamsBak)
  })
  if (options.queryOnInit) {
    queryData()
  }
  const server = {
    queryData,
    refreshData,
    saveData,
    deleteData,
  }
  const events = {
    filterChange(eventParams: VxeGridDefines.FilterChangeEventParams) {
      filters.value = conversionFilterData(eventParams)
    },
    sortChange(eventParams: VxeGridDefines.SortChangeEventParams) {
      orderItemList.value = eventParams.sortList.map(({ field, order }) => ({
        field,
        order,
      }))
    },
    pageChange(eventParams: VxeGridDefines.PageChangeEventParams) {
      pagerConfig.value.currentPage = eventParams.currentPage
      pagerConfig.value.pageSize = eventParams.pageSize
    },
    checkboxChange({ records }) {
      selections.value = records
    },
    checkboxAll({ records }) {
      selections.value = records
    },
  }
  return {
    loading,
    pagerConfig,
    filters,
    orderItemList,
    server,
    data,
    selections,
    ignoreNextWatch,
    events,
  }
}
