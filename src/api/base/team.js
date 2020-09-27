import request from '@/utils/request'


export default {
    //获取班组列表
    getTeamList(teamName){
        return request({
            url: `/38999/main/team?teamName=`+teamName,
            method: 'get'
          })
    },

     //添加班组
     addTeam(team){
      return request({
          url: `/38999/main/team/addTeam`,
          method: 'post',
          data: team
        })
    },

    //更新班组
    updateTeam(team){
      return request({
          url: `/38999/main/team/updateTeam`,
          method: 'post',
          data: team
        })
  },

   //获取班组
   getTeam(teamId){
    return request({
        url: `/38999/main/team/getTeamInfo/`+teamId,
        method: 'get'
      })
  },


    

    //删除班组
    deleteTeam(teamId){
        return request({
            url: `/38999/main/team/`+teamId,
            method: 'delete'
          })
    }

    




}

