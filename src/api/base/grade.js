import request from '@/utils/request'


export default {

    getAll(){
        return request({
            url: `/38999/main/grade`,
            method: 'get'
          })
    }


    




}

