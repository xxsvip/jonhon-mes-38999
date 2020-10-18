<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
            <el-form-item>
                <el-select v-model="query.team" placeholder="班组" clearable style="width: 130px">
                    <el-option v-for="team in teamList" :key="team.id" :label="team.teamName" :value="team.id" />
                </el-select>
             </el-form-item>
             <el-form-item>
                <el-input v-model="query.box" placeholder="最下层料盒" clearable />
             </el-form-item>
            <el-form-item>
                    <el-date-picker v-model="query.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
             </el-form-item>
             <el-form-item>
                   <el-select v-model="query.status" placeholder="状态" clearable style="width: 130px">
                        <el-option v-for="status in statusList" :key="status.id" :label="status.name" :value="status.id" />
                   </el-select>
             </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
          <el-button type="default"  @click="resetData()">清空</el-button>
          <el-button type="primary"  @click="toRuku()">配套入库</el-button>
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
          <el-table-column prop="startTime" label="请求入库时间"  />
          <el-table-column prop="endTime" label="入库报完成时间"  />
          <el-table-column label="入库人" prop="username">
            <template slot-scope="{row}">
               {{row.usercode}}  {{row.username}}
            </template>
          </el-table-column>
           <el-table-column label="状态" prop="status">
            <template slot-scope="{row}">
                <el-tag v-if="row.status == 0" effect="dark" type="danger">入库中</el-tag>
                <el-tag v-if="row.status == 1" effect="dark" type="success">已入库</el-tag>
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

import team from '@/api/base/team'
import op100 from '@/api/op100/op100'

export default {
    data() {    
        return {

            teamList: [],
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
         this.getTeamList()

        this.getList()
    },
    methods:{

        toRuku(){
            this.$router.push({ path: '/op100/add' })
        },

        missionDetails(missionId){
            op100.getListByMissionId(missionId).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },

         //获取班组列表
         getTeamList(){
            team.getTeamList('')
                .then(response =>{
                    this.teamList = response.data.list
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },

        getList(page = 1){
            this.page = page
            op100.getListPage(this.page,this.limit,this.query)
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