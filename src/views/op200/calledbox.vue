<template>
    <div class="app-container">


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
         <el-table-column prop="missionId" label="任务编号" >
            <template slot-scope="{row}">
                <el-link type="primary" @click="missionDetails(row.missionId)" :underline="false">{{ row.missionId }}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="呼叫时间"  />

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
                 <el-table-column prop="teamId" label="班组" />
                <el-table-column prop="grade" label="质量等级" />
                <el-table-column label="齐套情况" prop="materialComplement">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.materialComplement == 0" effect="dark" type="danger">未齐套</el-tag>
                        <el-tag v-if="row.materialComplement == 1" effect="dark" type="success">已齐套</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否急单" prop="urgent">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.urgent == 0" effect="dark" >普通订单</el-tag>
                        <el-tag v-if="row.urgent == 1" effect="dark" type="danger">紧急订单</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailDialogVisible = false">确认</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>

import op100 from '@/api/op100/op100'
import op200 from '@/api/op200/op200'

export default {
    data() {    
        return {

            list:null, //数据列表

            detailList:[],

            detailDialogVisible: false,
        }
    },
    created(){ 
        this.getList()
    },
    methods:{

        missionDetails(missionId){
            op100.getListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },


        getList(){
               op200.getCalledbox()
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