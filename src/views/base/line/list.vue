<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
          <el-form-item>
              <el-input v-model="lineQuery.lineName" placeholder="产线名称" clearable />
          </el-form-item>
         <el-form-item>
              <el-input v-model="lineQuery.lineNo" placeholder="产线编码" clearable />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
           <el-button type="primary" @click="openLineDialog()">添加产线</el-button>
           <el-button type="default"  @click="resetData()">清空</el-button>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                  {{ (page-1)* limit + scope.$index + 1}}
              </template>
          </el-table-column>
    
          <el-table-column prop="lineName" label="产线名称"  />

          <el-table-column prop="lineNo" label="产线编号"  />

          <el-table-column prop="lineRows" label="产线行数"  />

          <el-table-column prop="remark" label="备注"  />
          <el-table-column label="操作" width="200"  align="center">
              <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditLine(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeLine(scope.row.id,scope.row.lineName)">删除</el-button>
              </template>
          </el-table-column>

        </el-table>

        <el-pagination :total="total" :current-page="page" :page-size="limit" 
        style="padding: 30px 0;text-align: center"
        layout="total,prev,pager,next,jumper"
        @current-change="getList" />


         <!-- 添加和修改产线表单 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogLineFormVisible">
            <el-form :model="line" label-width="120px" ref="lineForm" :rules="rules" >
                <el-form-item label="产线名称" prop="lineName">
                    <el-input v-model="line.lineName"></el-input>
                </el-form-item>
               <el-form-item label="产线编码" prop="lineNo">
                    <el-input v-model="line.lineNo"></el-input>
                </el-form-item>
                 <el-form-item label="产线行数" prop="lineRows">
                    <el-input-number v-model="line.lineRows" :min="1"></el-input-number>
                </el-form-item>
                 <el-form-item label="产线排序">
                    <el-input-number v-model="line.sort" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="line.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogLineFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import line from '@/api/base/line'

export default {
    data() {    
        return {
            list:null, //数据列表
            page:1,//当前页
            limit:10,//每页记录数
            total:0, //总记录数
            lineQuery:{}, //条件封装对象

            line:{lineName:'',lineNo:'',remark:''},
            dialogLineFormVisible:false,  //是否展示新增对话框
            dialogTitle:'',

            rules:{
                lineName :[{required: true, message: '请输入产线名称', trigger: 'blur'}],
                lineNo :[{required: true, message: '请输入产线编码', trigger: 'blur'}],
                lineRows :[{required: true, message: '请输入产线行数', trigger: 'blur'}]
            }


        }
    },
    created(){ 
        this.getList()
    },
    methods:{
        getList(page = 1){
            this.page = page
            line.getLineListPage(this.page,this.limit,this.lineQuery)
                .then(response =>{
                    this.list = response.data.rows
                    this.total = response.data.total
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.lineQuery = {}
            this.getList()
        },

         //点击新增弹出对话框
        openLineDialog(){
            this.dialogLineFormVisible = true;
            this.dialogTitle = '新增产线'
            if (this.$refs["lineForm"] !== undefined) {this.$refs["lineForm"].resetFields();}  //mouted加载数据以后，隐藏的弹出框并没有编译渲染进dom里面。click弹出的时候$refs并没有获取到dom元素导致 'resetFields' of undefined
            this.line.lineName = ''
            this.line.lineNo = ''
            this.line.remark = ''
        },

         //点击修改弹出对话框
        openEditLine(lineId){
            this.dialogLineFormVisible = true;
            this.dialogTitle = '修改产线'
            if (this.$refs["lineForm"] !== undefined) {this.$refs["lineForm"].resetFields();}
            line.getLine(lineId)
                .then(response => {
                    this.line = response.data.line
                })
            
        },


        saveOrUpdate(){
            if(!this.line.id){
               this.addLine()
            }else{
                this.updateLine()
            }
        },

        //添加产线
        addLine(){
            this.$refs["lineForm"].validate((valid) => {
                if (valid) {
                        line.getCountByLineNoInsert(this.line.lineNo)
                            .then(response => {
                                if(response.data.count>0){this.$message({message: '您输入的产线编码在系统已经存在',type: 'warning'}); }
                                else{
                                    line.addLine(this.line)
                                        .then(response => {
                                        //关闭弹窗
                                        this.dialogLineFormVisible = false
                                        //提示
                                        this.$message({
                                            type:'success',
                                            message:'添加产线成功！' 
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
        
        //修改产线
        updateLine(){
            line.getCountByLineNoUpdate(this.line)
                .then(response => {
                     if(response.data.count>0){this.$message({message: '您输入的产线编码在系统已经存在',type: 'warning'}); }
                     else{
                              line.updateLine(this.line)
                                .then(response => {
                                    //关闭弹窗
                                    this.dialogLineFormVisible = false
                                    this.line={}
                                    //提示
                                    this.$message({
                                        type:'success',
                                        message:'修改产线成功！'
                                    })
                                    //刷新页面
                                    this.getList()
                                })
                     }
               })
          
        },


         //删除产线
     removeLine(lineId,lineName){
        this.$confirm('此操作将删除产线: '+lineName+'，是否继续？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        }).then(() => {
            line.deleteLine(lineId)
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