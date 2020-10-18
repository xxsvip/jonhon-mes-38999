import request from '@/utils/request'

const api_name = '/38999/main/so'

export default {

      //开工检叫料界面
      kgjCallBoxPage(current,limit,so){
        return request({
            url: `${api_name}/kgj/callbox/${current}/${limit}?so=`+so,
            method: 'get'
          })
    },

  

}
