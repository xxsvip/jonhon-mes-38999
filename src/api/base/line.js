import request from '@/utils/request'


export default {
    //current 当前页 limit每页记录数 lineQuery条件对象
    getLineListPage(current,limit,lineQuery){
        return request({
            url: `/38999/main/line/${current}/${limit}`,
            method: 'post',
            data: lineQuery
          })
    },


      //添加产线
      addLine(line){
        return request({
            url: `/38999/main/line/addLine`,
            method: 'post',
            data: line
          })
    },

    //获取产线
    getLine(lineId){
        return request({
            url: `/38999/main/line/getLineInfo/`+lineId,
            method: 'get'
          })
    },

    //更新产线
    updateLine(line){
        return request({
            url: `/38999/main/line/updateLine`,
            method: 'post',
            data: line
          })
    },

    //删除产线
    deleteLine(lineId){
        return request({
            url: `/38999/main/line/`+lineId,
            method: 'delete'
          })
    },

    //新增时根据产线号查询count
    getCountByLineNoInsert(lineNo){
        return request({
            url: `/38999/main/line/getCountByLineNoInsert/`+lineNo,
            method: 'get'
          })
    },

    //修改时根据产线号查询count
    getCountByLineNoUpdate(line){
        return request({
            url: `/38999/main/line/getCountByLineNoUpdate`,
            method: 'post',
            data: line
          })
    },


    //查询产线编号列表
    getAllWithTree(){
      return  request({
        url: `/38999/main/line/getAllWithTree`,
        method: 'get'
      })
    }







    




}

