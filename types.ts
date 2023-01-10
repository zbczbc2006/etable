import type { Ref } from 'vue'
import { VxeGridPropTypes } from 'vxe-table'
export type PaginationProps = {
  pageSize: number
  pageSizeOptions: number[]
}
export type ToolbarButton = {
  code: 'add' | 'save' | 'delete' | 'export' | 'refresh' | 'log'
  type: string
}

// useTableSever
export type Row = Record<string, any>
export type ResponseData = {
  data?: any
  code: string
  message?: string
}
export type ResponseQueryData<T> = {
  data: {
    total: number
    list: T[]
  }
  code: string
  message?: string
}
export type Service<U, T> = (args: U) => Promise<T>
export type Pagination = {
  pageNo: number
  pageSize: number
}

export type OrderItem = {
  field: string
  order: 'asc' | 'desc' | null
}

export type QueryParams = {
  params?: Record<string, any>
  filters?: Record<string, any>
  orderItemList?: OrderItem[]
  pageNo?: number
  pageSize?: number
  [props: string]: any
}

export type UseTableSeverOption<T = Row> = {
  queryOnInit?: boolean
  autoQueryOnParameChange?: boolean
  queryService?: Service<QueryParams, ResponseQueryData<T>>
  saveService?: Service<any, ResponseData>
  deleteService?: Service<any, ResponseData>
  beforeQuery?: (params?: Record<string, any>) => boolean | Promise<boolean>
  afterQuery?: (res: ResponseData, params?: Record<string, any>) => void
  pagination?: Pagination
  params?: Record<string, any>
  filters?: Record<string, any>
  orderItemList?: OrderItem[]
  initData?: T[]
}
export enum QueryWay {
  LIKE = 'like',
  EQUAL = 'equal',
  DateBetween = 'dateBetween',
  AmountBetween = 'amountBetween',
}
export type RefObj = Ref<Record<string, any> | undefined>

export interface PagerConfig extends VxeGridPropTypes.PagerConfig {
  currentPage: number
  pageSize: number
}

// For Finance 财务用特殊类型
export type UseTableSeverOption4Fin<T = Row> = {
  queryOnInit?: boolean
  autoQueryOnParameChange?: boolean
  queryService?: Service<QueryParams, ResponseQueryData4Fin<T>>
  saveService?: Service<any, ResponseData4Fin>
  deleteService?: Service<any, ResponseData4Fin>
  beforeQuery?: (params?: Record<string, any>) => boolean | Promise<boolean>
  afterQuery?: (res: ResponseData4Fin, params?: Record<string, any>) => void
  pagination?: Pagination4Fin
  params?: Record<string, any>
  filters?: Record<string, any>
  sorter?: Record<string, any>
  initData?: T[]
  enabledQueryWay?: QueryWay
}
export type ResponseQueryData4Fin<T> = ResponseData4Fin & {
  rows: T[]
  total: number
}
export type ResponseData4Fin = {
  obj?: any
  success: boolean
  message?: string
}
export type Pagination4Fin = {
  current: number
  pageSize: number
}