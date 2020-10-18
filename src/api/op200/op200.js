import request from '@/utils/request'

const api_name = '/38999/main/op200'

export default {
    
  //叫料
  callbox(so) {
    return request({
      url: `${api_name}/callbox?so=`+so,
      method: 'get'
    })
  },


  //获取当前用户配送中的物料信息
  getCalledbox() {
    return request({
      url: `${api_name}/calledbox`,
      method: 'get'
    })
  },


  //用户工位收料
  receiveBox(box){
    return request({
      url: `${api_name}/receivebox?box=`+box,
      method: 'get'
    })
  },

  //当前员工工位上订单信息总览
  workbench(){
    return request({
      url: `${api_name}/workbench`,
      method: 'get'
    })
  },

  //开工
  startWorking(so){
    return request({
      url: `${api_name}/startWorking?so=`+so,
      method: 'get'
    })
  },

  //报工
  finishWork(so){
    return request({
      url: `${api_name}/finishWork?so=`+so,
      method: 'get'
    })
  },


  //流转
  deliver(so,boxes){
    return request({
      url: `${api_name}/deliver?so=`+so+`&boxes=`+boxes,
      method: 'get'
    })
  },


  //获取shift表中数据
  getShiftPage(current,limit,query){
    return request({
        url: `/38999/main/op200/getShiftPage/${current}/${limit}`,
        method: 'post',
        data: query
      })
},

//获取流转详情
getDeliverList(id){
  return request({
    url: `${api_name}/getDeliverList?shiftId=`+id,
    method: 'get'
  })
}




  

}
