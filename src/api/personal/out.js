import request from '@/utils/request'

const api_name = '/38999/main/personal'

export default {

      //出库请求
    callout(missionId){
      return request({
          url: `${api_name}/callbox?missionId=`+missionId,
          method: 'get'
        })
    },


    //
    getCalledbox(){
      return request({
        url: `${api_name}/getCalledbox`,
        method: 'get'
      })
    },


    receiveBox(box){
      return request({
        url: `${api_name}/receiveBox?box=`+box,
        method: 'get'
      })
    }

   

}
