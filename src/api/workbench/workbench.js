import request from '@/utils/request'

export default {

      //获取员工工位上对应订单的已到料箱情况
      getReceivedBoxes(so){
        return request({
            url: `38999/main/workbench/details/getReceivedBoxes?so=`+so,
            method: 'get'
          })
    },

  //获取员工工位上对应订单的未收到的料箱情况
    getUnreceivedBoxes(so){
      return request({
          url: `38999/main/workbench/details/getUnreceivedBoxes?so=`+so,
          method: 'get'
        })
  }

  

}
