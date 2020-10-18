<template>
    <div class="app-container">


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          <el-table-column prop="missionId" label="任务编号" >
            <template slot-scope="{row}">
                <el-link type="primary" @click="missionDetails(row.missionId)" :underline="false">{{ row.missionId }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="box" label="最下层料盒"  />
          <el-table-column prop="inStartTime" label="请求入库时间"  />
          <el-table-column prop="inEndTime" label="入库报完成时间"  />
           <el-table-column label="操作" width="200"  align="center">
              <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="callout(scope.row.missionId)">叫料出库</el-button>
              </template>
          </el-table-column>
        </el-table>


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
import outBox from '@/api/personal/out'
export default {
    data() {    
        return {

            detailList: [],

            list:null, //数据列表

            detailDialogVisible: false,
        }
    },
    created(){ 
    },
    methods:{
        callout(missionId){
            outBox.callout(missionId).then(response => {
                this.$router.push({ path: '/personal/outing' })
            })
        },

        missionDetails(missionId){
            inBox.getInListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },


        getList(){
            inBox.getList()
                .then(response =>{
                    this.list = response.data.rows
                    this.total = response.data.total
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.getList()
        }





    }
}
</script>