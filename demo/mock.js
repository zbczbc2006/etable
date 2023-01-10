// 模拟后端接口
const severData = [
  {
    id: 10001,
    name: 'Test1',
    nickname: 'T1',
    phone: '18888888888',
    sex: 0,
  },
  {
    id: 10002,
    name: 'Test2',
    nickname: 'T2',
    phone: '156236363464',
    sex: 1,
  },
  {
    id: 10003,
    name: 'Test3',
    nickname: 'T3',
    phone: '193333334455',
    sex: 0,
  },
]
let idCount = 10004
export default {
  query(params) {
    console.log('query', params, severData)
    return Promise.resolve({
      code: '0',
      msg: '',
      data: {
        total: 200,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        list: severData.map(({ _X_ROW_KEY, ...props }) => ({ ...props })),
      },
    })
  },
  save(rows) {
    console.log('save', rows)
    rows.forEach((row) => {
      if (row.id) {
        const index = severData.findIndex((el) => el.id === row.id)
        if (index > -1) {
          severData[index] = row
        }
      } else {
        row.id = idCount++
        severData.unshift(row)
      }
    })
    return Promise.resolve({
      code: '0',
    })
  },
  del(ids) {
    console.log('del', ids)
    ids.forEach((id) => {
      const index = severData.findIndex((row) => row.id === id)
      if (index > -1) {
        severData.splice(index, 1)
      }
    })
    return Promise.resolve({
      code: '0',
    })
  },
}
