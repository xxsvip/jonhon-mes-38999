<template>
    <div class="app-container">


        <el-form :inline="true"  class="demo-form-linline">
             <el-form-item>
                <el-input v-model="box" placeholder="扫料盒收料" clearable />
             </el-form-item>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
         <el-table-column prop="missionId" label="任务编号" >
            <template slot-scope="{row}">
                <el-link type="primary" @click="missionDetails(row.missionId)" :underline="false">{{ row.missionId }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="outStartTime" label="呼叫时间"  />
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

import outBox from '@/api/personal/out'
import inBox from '@/api/personal/in'

export default {
    data() {    
        return {

            list:null, //数据列表

            detailList:[],

            box:'',

            detailDialogVisible: false,
        }
    },
    created(){ 
        this.getList()
    },

    watch:{
        box(val){
            if(val.length === 15){
                outBox.receiveBox(this.box).then(response => {
                    this.$message({
                        type:'success',
                        message:'收料成功!' 
                    })
                   this.getList()
                   this.box = ''
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    },
    methods:{

        missionDetails(missionId){
          inBox.getInListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },


        getList(){
               outBox.getCalledbox()
                .then(response =>{
                    this.list = response.data.list
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