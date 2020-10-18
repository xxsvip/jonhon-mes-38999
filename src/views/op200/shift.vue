<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
             <el-form-item>
                <el-input v-model="query.so" placeholder="车间订单号" clearable />
             </el-form-item>
            <el-form-item>
                    <el-date-picker v-model="query.date" type="date" value-format="yyyy-MM-dd" placeholder="完工日期"></el-date-picker>
             </el-form-item>
          <el-button type="primary" @click="getList()">查询</el-button>
          <el-button type="default"  @click="resetData()">清空</el-button>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                  {{ (page-1)* limit + scope.$index + 1}}
              </template>
          </el-table-column>
    
          <el-table-column prop="so" label="车间订单号"  />
          <el-table-column prop="startTime" label="开工时间"  />
          <el-table-column prop="endTime" label="完工时间"  />
            <el-table-column prop="deliverTime" label="流转时间" >
            <template slot-scope="{row}">
                <el-link type="primary" @click="deliverDetails(row.id)" :underline="false">{{ row.deliverTime }}</el-link>
            </template>
          </el-table-column>
           <el-table-column label="类型" prop="type">
            <template slot-scope="{row}">
                <el-tag v-if="row.type != 1"  type="danger">异常暂停</el-tag>
                <el-tag v-if="row.type == 1" type="success">正常完工</el-tag>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination :total="total" :current-page="page" :page-size="limit" 
        style="padding: 30px 0;text-align: center"
        layout="total,prev,pager,next,jumper"
        @current-change="getList" />


         <el-dialog :visible.sync="detailDialogVisible" title="箱子详情">
            <el-table :data="detailList" border fit highlight-current-row style="width: 100%">
                <el-table-column label="所在层" prop="layer">
                        <template slot-scope="{row}">
                            第{{row.layer}}层
                        </template>
                </el-table-column>
                 <el-table-column prop="box" label="料盒编号" />
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailDialogVisible = false">确认</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import op200 from '@/api/op200/op200'

export default {
    data() {    
        return {

    
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
        this.getList()
    },
    methods:{


        deliverDetails(id){
            op200.getDeliverList(id).then(response => {
                this.detailList = response.data.list
                this.detailDialogVisible = true;
            })
        },

        getList(page = 1){
            this.page = page
            op200.getShiftPage(this.page,this.limit,this.query)
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