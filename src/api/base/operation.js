import request from '@/utils/request'


export default {
    //获取工序列表
    getOperationListPage(current,limit,operationQuery){
      return request({
          url: `/38999/main/operation/${current}/${limit}`,
          method: 'post',
          data: operationQuery
        })
  },

     //添加工序
     addOperation(operation){
      return request({
          url: `/38999/main/operation/addOperation`,
          method: 'post',
          data: operation
        })
    },

    //更新班组
    updateOperation(operation){
      return request({
          url: `/38999/main/operation/updateOperation`,
          method: 'post',
          data: operation
        })
  },

   //获取工序
   getOperation(operationId){
    return request({
        url: `/38999/main/operation/getOperationInfo/`+operationId,
        method: 'get'
      })
  },

  //新增时判断工序编码是否已经存在
  getCountByCodeInsert(code){
    return request({
      url: `/38999/main/operation/getCountByCodeInsert/`+code,
      method: 'get'
    })
  },

  //修改时判断工序编码是否已经存在
  getCountByCodeUpdate(operation){
    return request({
      url: `/38999/main/operation/getCountByCodeUpdate/`,
      method: 'post',
      data: operation
    })
  },


   //删除工序
   deleteOperation(operationId){
    return request({
        url: `/38999/main/operation/`+operationId,
        method: 'delete'
      })
}

    




}

