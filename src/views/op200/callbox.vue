<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
             <el-form-item>
                <el-input v-model="so" placeholder="车间订单号" clearable />
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
          <el-table-column prop="soNo" label="车间订单号"  />
          <el-table-column prop="boxNum" label="箱子个数"  />
           <el-table-column label="是否急单" prop="urgent">
            <template slot-scope="{row}">
                <el-tag v-if="row.urgent == 0"  type="">普通订单</el-tag>
                <el-tag v-if="row.urgent == 1"  type="danger">紧急订单</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200"  align="center">
              <template slot-scope="scope">
                    <el-button type="primary" :loading="loading" size="mini" @click="callbox(scope.row.soNo)">叫料</el-button>
              </template>
          </el-table-column>

        </el-table>

        <el-pagination :total="total" :current-page="page" :page-size="limit" 
        style="padding: 30px 0;text-align: center"
        layout="total,prev,pager,next,jumper"
        @current-change="getList" />

    </div>
</template>

<script>

import so from '@/api/so/so'
import op200 from '@/api/op200/op200'

export default {
    data() {    
        return {

            list:null, //数据列表
            page:1,//当前页
            limit:10,//每页记录数
            total:0, //总记录数
            so:'',

            loading: false,
        }
    },
    created(){ 
        this.getList()
    },
    methods:{


        callbox(so){

            this.loading = true;

            op200.callbox(so).then(response => {
                  this.$router.push({ path: '/op200/calledbox' })
              }).catch( e => {
                  this.loading = false;
              })
        },

        getList(page = 1){
            this.page = page
            so.kgjCallBoxPage(this.page,this.limit,this.so)
                .then(response =>{
                    this.list = response.data.rows
                    this.total = response.data.total
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.so = ''
            this.getList()
        }





    }
}
</script>