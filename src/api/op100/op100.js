import request from '@/utils/request'

const api_name = '/38999/main/op100'

export default {
      save(details) {
        return request({
          url: `${api_name}/main/addBoxes`,
          method: 'post',
          data: details
        })
      },

      //获取主表列表
      getListPage(current,limit,query){
        return request({
            url: `/38999/main/op100/main/${current}/${limit}`,
            method: 'post',
            data: query
          })
    },

    //根据任务ID获取该任务详情
    getListByMissionId(missionId){
      return request({
        url: `/38999/main/op100/main/getDetails?missionId=`+missionId,
        method: 'get'
      })
    }


}
