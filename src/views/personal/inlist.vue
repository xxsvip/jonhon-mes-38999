<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
            <el-form-item>
                    <el-date-picker v-model="query.date" type="date" value-format="yyyy-MM-dd" placeholder="入库日期"></el-date-picker>
             </el-form-item>
             <el-form-item>
                   <el-select v-model="query.status" placeholder="状态" clearable style="width: 130px">
                        <el-option v-for="status in statusList" :key="status.id" :label="status.name" :value="status.id" />
                   </el-select>
             </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
          <el-button type="default"  @click="resetData()">清空</el-button>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                  {{ (page-1)* limit + scope.$index + 1}}
              </template>
          </el-table-column>
    
          <el-table-column prop="missionId" label="任务编号" >
            <template slot-scope="{row}">
                <el-link type="primary" @click="missionDetails(row.missionId)" :underline="false">{{ row.missionId }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="box" label="料盒编号"  />
          <el-table-column prop="inStartTime" label="请求入库时间"  />
          <el-table-column prop="inEndTime" label="入库报完成时间"  />
           <el-table-column label="状态" prop="status">
            <template slot-scope="{row}">
                <el-tag v-if="row.inEndTime.length == 0" effect="dark" type="danger">入库中</el-tag>
                <el-tag v-if="row.inEndTime.length > 0"  effect="dark" type="success">已入库</el-tag>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination :total="total" :current-page="page" :page-size="limit" 
        style="padding: 30px 0;text-align: center"
        layout="total,prev,pager,next,jumper"
        @current-change="getList" />


         <el-dialog :visible.sync="detailDialogVisible" title="任务详情">
            <el-table :data="detailList" border fit highlight-current-row style="width: 100%">
                <el-table-column label="所在层" prop="layer">
                        <template slot-scope="{row}">
                            第{{row.layer}}层
                        </template>
                </el-table-column>
                 <el-table-column prop="box" label="料盒编号" />
                <el-table-column prop="so" label="车间订单号" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailDialogVisible = false">确认</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

import inBox from '@/api/personal/in'

export default {
    data() {    
        return {

            statusList: [{id:1,name:"已入库"},{id:0,name:"入库中"}],

            detailList: [],

            list:null, //数据列表
            page:1,//当前页
            limit:10,//每页记录数
            total:0, //总记录数
            query:{}, //条件封装对象

            detailDialogVisible: false,
        }
    },
    created(){ 
    },
    methods:{

        missionDetails(missionId){
            inBox.getInListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },


        getList(page = 1){
            this.page = page
            inBox.getListPage(this.page,this.limit,this.query)
                .then(response =>{
                    this.list = response.data.rows
                    this.total = response.data.total
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.query = {}
            this.getList()
        }





    }
}
</script>