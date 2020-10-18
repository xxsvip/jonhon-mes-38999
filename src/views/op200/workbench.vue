<template>
    <div class="app-container">


          <el-form :inline="true"  class="demo-form-linline">
             <el-form-item>
                <el-input v-model="box" placeholder="扫料盒收料" clearable />
             </el-form-item>
        </el-form>

        <div>
            <el-button v-show="btn_kaigong" @click="kaigongAction" type="primary">开工</el-button>
            <el-button v-show="btn_baogong" @click="baogongAction" type="success">报工</el-button>
            <el-button v-show="btn_liuzhuan" @click="liuzhuanAction"  type="info">流转 </el-button>
        </div>

        <br/>



        <el-table ref="table" :data="list" @row-click="handle" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column prop="so" label="车间订单号" />
           <el-table-column prop="status" label="状态" >
               <template slot-scope="{row}">
                    <el-tag v-if="row.status == 0 && row.allCount - row.currentCount > 0" type="warning">等待物料齐全</el-tag>
                    <el-tag v-if="row.status == 0 && row.allCount - row.currentCount ==0" type="info">待开工</el-tag>
                    <el-tag v-if="row.status == 1">努力生产中</el-tag>
                    <el-tag v-if="row.status == 2" type="success">已完工</el-tag>
                </template>
           </el-table-column>
          <el-table-column prop="allCount" label="总料盒数量"  />
          <el-table-column prop="currentCount" label="已收数量">
              <template slot-scope="{row}">
                <el-link v-if="row.currentCount>0" type="primary" @click="getReceivedBoxes(row.so)" :underline="false">{{ row.currentCount}}</el-link>
              </template>
          </el-table-column>
          <el-table-column label="待收数量" prop="currentCount">
                <template slot-scope="{row}">
                    <el-link v-if="row.allCount-row.currentCount>0" type="primary" @click="getUnreceivedBoxes(row.so)" :underline="false">{{ row.allCount-row.currentCount}}</el-link>
                </template>
        </el-table-column>
       
        </el-table>




        <el-dialog :visible.sync="detailDialogVisible" title="料盒情况">
            <el-table :data="boxList" border fit highlight-current-row style="width: 100%">
                 <el-table-column prop="box" label="料盒编号" />
                <el-table-column v-if="createTime" prop="createTime" label="收料时间" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailDialogVisible = false; createTime = true">确认</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>

import op100 from '@/api/op100/op100'
import op200 from '@/api/op200/op200'
import workbench from '@/api/workbench/workbench'


export default {
    data() {    
        return {

            list:null, //数据列表

            box:'',

            detailDialogVisible: false,

            createTime:true,

            boxList: [],


            btn_kaigong: false,
            btn_baogong: false,
            btn_liuzhuan: false,

            so:'',

        }
    },
    created(){ 
        this.getList()
    },

    watch:{
        box(val){
            if(val.length === 15){

                op200.receiveBox(this.box).then(response => {
                    this.$message({
                        type:'success',
                        message:'收料成功!' 
                    })
                   this.getList()
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    },
    methods:{

        //点击完按钮后
        afterClickBtn(){
            this.getList()
            this.btn_kaigong = false; this.btn_baogong = false; this.btn_liuzhuan = false;
        },

        //点击开工按钮
        kaigongAction(){
            op200.startWorking(this.so).then(response => {
                this.afterClickBtn()
            })
        },

        //点击报工按钮
        baogongAction(){
            op200.finishWork(this.so).then(response => {
                this.afterClickBtn()
            })
        },

        //点击流转按钮
        liuzhuanAction(){
           this.$router.push({path:'/op200/workbench/deliver',query:{so:this.so}})
        },

        //选中行触发
    handle(row, event, column){
        //先全部消失    
        this.btn_kaigong = false; this.btn_baogong = false; this.btn_liuzhuan = false;

        this.so = row.so


        if(row.status == 0 ){ //待开工
            var all = row.allCount
            var current = row.currentCount
            if(all-current == 0){
               this.btn_kaigong = true
           }
        }

        if(row.status ==1){ //生产中
            this.btn_baogong = true;
        }


        if(row.status == 2){  //已完工
            this.btn_liuzhuan = true
        }

           

        },





        getReceivedBoxes(so){
            workbench.getReceivedBoxes(so).then(response => {
                this.boxList = response.data.list
                this.detailDialogVisible = true;
            })
        },

        getUnreceivedBoxes(so){
            workbench.getUnreceivedBoxes(so).then(response => {
                this.createTime = false;
                this.boxList = response.data.list
                this.detailDialogVisible = true;
            })
        },

        missionDetails(missionId){
            op100.getListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },


        getList(){
               op200.workbench()
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