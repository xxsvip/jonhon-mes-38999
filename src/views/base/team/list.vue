<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
          <el-form-item>
              <el-input v-model="teamName" placeholder="班组名称" clearable />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
           <el-button type="primary" @click="openTeamDialog()">添加班组</el-button>
           <el-button type="default"  @click="resetData()">清空</el-button>
        </el-form>


        <el-table :data="list" element-loading-text="数据加载中..." border fit highlight-current-row>
          
          <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">
                  {{scope.$index + 1}}
              </template>
          </el-table-column>
    
          <el-table-column prop="teamName" label="班组名称"  />
          <el-table-column prop="remark" label="备注"  />

          <el-table-column label="操作" width="200"  align="center">
              <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditTeam(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeTeam(scope.row.id,scope.row.teamName)">删除</el-button>
              </template>
          </el-table-column>

        </el-table>


         <!-- 添加和修改班组表单 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogTeamFormVisible">
            <el-form :model="team" label-width="120px" ref="teamForm" :rules="rules" >
                <el-form-item label="班组名称" prop="teamName">
                    <el-input v-model="team.teamName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="team.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTeamFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import team from '@/api/base/team'

export default {
    data() {    
        return {
            list:null, //数据列表
            teamName:'',  //查询条件

            team:{teamName:'',remark:''},
            dialogTeamFormVisible:false,  //是否展示对话框
            dialogTitle:'',
            rules:{
                teamName :[{required: true, message: '请输入班组名称', trigger: 'blur'}]
            }
        }
    },
    created(){ 
        this.getList()
    },
    methods:{
        getList(){
            team.getTeamList(this.teamName)
                .then(response =>{
                    this.list = response.data.list
                }) //请求成功
                .catch(error => {
                    console.log(error)
                }) //请求失败
        },
        resetData(){
            this.teamName = ''
            this.getList()
        },
          //点击新增弹出对话框
        openTeamDialog(){
            this.dialogTeamFormVisible = true;
            this.dialogTitle = '新增班组'
            if (this.$refs["teamForm"] !== undefined) {this.$refs["teamForm"].resetFields();} 
            this.team.teamName = ''
            this.team.remark = ''
        },
         //点击修改弹出对话框
        openEditTeam(teamId){
            this.dialogTeamFormVisible = true;
            this.dialogTitle = '修改班组'
            if (this.$refs["teamForm"] !== undefined) {this.$refs["teamForm"].resetFields();}
            team.getTeam(teamId)
                .then(response => {
                    this.team = response.data.team
                })
            
        },

         saveOrUpdate(){
            if(!this.team.id){
               this.addTeam()
            }else{
                this.updateTeam()
            }
        },

         //添加班组
        addTeam(){
            this.$refs["teamForm"].validate((valid) => {
                if (valid) {
                            team.addTeam(this.team)
                                .then(response => {
                                //关闭弹窗
                                this.dialogTeamFormVisible = false
                                //提示
                                this.$message({
                                    type:'success',
                                    message:'添加班组成功！' 
                                })
                                //刷新页面
                                this.getList()
                            })
                } else {
                    return false;
                }
                });
            },

        //修改班组
         updateTeam(){
                team.updateTeam(this.team)
                .then(response => {
                    //关闭弹窗
                    this.dialogTeamFormVisible = false
                    this.team={}
                    //提示
                    this.$message({
                        type:'success',
                        message:'修改班组成功！'
                    })
                    //刷新页面
                    this.getList()
                })
          
        },


     //删除班组
     removeTeam(teamId,teamName){
        this.$confirm('此操作将删除班组: '+teamName+'，是否继续？','提示',{
            confirmButtonText:'确定',
            cancelButtonText:'取消',
            type:'warning'
        }).then(() => {
            team.deleteTeam(teamId)
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