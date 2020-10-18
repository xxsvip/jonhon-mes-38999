import request from '@/utils/request'

const api_name = '/38999/main/personal'

export default {

      //入库
      addBoxes(details){
        return request({
            url: `${api_name}/addBoxes`,
            method: 'post',
            data: details
          })
    },

    getListPage(current,limit,query){
      return request({
          url: `${api_name}/getInListPage/${current}/${limit}`,
          method: 'post',
          data: query
        })
  },

  getInListByMissionId(missionId){
    return request({
      url: `${api_name}/getInListByMissionId?missionId=`+missionId,
      method: 'get'
    })
  },

  getList(){
    return request({
      url: `${api_name}/getList`,
      method: 'get'
    })
  }

  

}
