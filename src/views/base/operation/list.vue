<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
          <el-form-item>
              <el-input v-model="operationQuery.name" placeholder="工序名称" clearable />
          </el-form-item>
         <el-form-item>
             <el-input-number v-model="operationQuery.code" :step="100" placeholder="工序编码" clearable />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
           <el-button type="primary" @click="openOperationDialog()">添加工序</el-button>
           <el-button type="default"  @click="resetData()">清空</el-button>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                  {{ (page-1)* limit + scope.$index + 1}}
              </template>
          </el-table-column>
    
          <el-table-column prop="name" label="工序名称"  />

          <el-table-column prop="code" label="工序编号"  />

          <el-table-column prop="remark" label="备注"  />
          <el-table-column label="操作" width="200"  align="center">
              <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditOperation(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeLine(scope.row.id,scope.row.name)">删除</el-button>
              </template>
          </el-table-column>

        </el-table>

        <el-pagination :total="total" :current-page="page" :page-size="limit" 
        style="padding: 30px 0;text-align: center"
        layout="total,prev,pager,next,jumper"
        @current-change="getList" />


         <!-- 添加和修改工序表单 -->
         <el-dialog :title="dialogTitle" :visible.sync="dialogOperationFormVisible">
            <el-form :model="operation" label-width="120px" ref="operationForm" :rules="rules" >
                <el-form-item label="工序名称" prop="name">
                    <el-input v-model="operation.name"></el-input>
                </el-form-item>
               <el-form-item label="工序编码" prop="code">
                    <el-input v-model="operation.code"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="operation.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOperationFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>

import operation from '@/api/base/operation'

export default {
    data() {    
        return {
            list:null, //数据列表
            page:1,//当前页
            limit:10,//每页记录数
            total:0, //总记录数
            operationQuery:{}, //条件封装对象

            operation:{},
            dialogOperationFormVisible:false,  //是否展示新增对话框
            dialogTitle:'',

            rules:{
                name :[{required: true, message: '请输入工序名称', trigger: 'blur'}],
                code :[{required: true, message: '请输入工序编码', trigger: 'blur'}]
            }


        }
    },
    created(){ 
        this.getList()
    },
    methods:{
        getList(page = 1){
            this.page = page
            operation.getOperationListPage(this.page,this.limit,this.operationQuery)
                .then(response =>{
                    this.list = response.data.rows
                    this.total = response.data.total
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.operationQuery = {}
            this.getList()
        },

         //点击新增弹出对话框
        openOperationDialog(){
            this.dialogOperationFormVisible = true;
            this.dialogTitle = '新增工序'
            if (this.$refs["operationForm"] !== undefined) {this.$refs["operationForm"].resetFields();}  //mouted加载数据以后，隐藏的弹出框并没有编译渲染进dom里面。click弹出的时候$refs并没有获取到dom元素导致 'resetFields' of undefined
            this.operation = {}
        },

         //点击修改弹出对话框
        openEditOperation(operationId){
            this.dialogOperationFormVisible = true;
            this.dialogTitle = '修改工序'
            if (this.$refs["operationForm"] !== undefined) {this.$refs["operationForm"].resetFields();}
            operation.getOperation(operationId)
                .then(response => {
                    this.operation = response.data.operation
                })
            
        },


        saveOrUpdate(){
            if(!this.operation.id){
               this.addOperation()
            }else{
                this.updateOperation()
            }
        },

        //添加工序
        addOperation(){
            this.$refs["operationForm"].validate((valid) => {
                if (valid) {
                        operation.getCountByCodeInsert(this.operation.code)
                            .then(response => {
                                if(response.data.count>0){this.$message({message: '您输入的工序编码在系统已经存在',type: 'warning'}); }
                                else{
                                    operation.addOperation(this.operation)
                                        .then(response => {
                                        //关闭弹窗
                                        this.dialogOperationFormVisible = false
                                        //提示
                                        this.$message({
                                            type:'success',
                                            message:'添加工序成功！' 
                                        })
                                        //刷新页面
                                        this.getList()
                                    })
                                }
                            })

                        
                } else {
                    return false;
                }
                });
            },
        
        //修改工序
        updateOperation(){
            operation.getCountByCodeUpdate(this.operation)
                .then(response => {
                     if(response.data.count>0){this.$message({message: '您输入的工序编码在系统已经存在',type: 'warning'}); }
                     else{
                              operation.updateOperation(this.operation)
                                .then(response => {
                                    //关闭弹窗
                                    this.dialogOperationFormVisible = false
                                    this.operation={}
                                    //提示
                                    this.$message({
                                        type:'success',
                                        message:'修改工序成功！'
                                    })
                                    //刷新页面
                                    this.getList()
                                })
                     }
               })
          
        },



              //删除工序
     removeLine(id,name){
        this.$confirm('此操作将删除工序: '+name+'，是否继续？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        }).then(() => {
            operation.deleteOperation(id)
                .then(response => {
                    this.$message({
                        type:'success',
                        message:'删除成功！'
                    })
                    this.getList()
                })
        })
    }





    }
}
</script>