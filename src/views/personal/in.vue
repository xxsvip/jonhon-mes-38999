<template>
    <div class="app-container">

        <el-form :inline="true"  class="demo-form-linline">
        <!-- 默认填充目的地为线边库对应编码 -->
        <el-button type="primary" @click="openDialog()">添加料盒</el-button>
         <el-button type="primary" @click="ruku()" :loading="loading">入线边库</el-button>
         <el-button @click="clearBox()">清空料盒</el-button>
        </el-form>
        <br/>

        <el-table :data="list" border fit highlight-current-row>
          <el-table-column label="箱子层数" prop="layer">
            <template slot-scope="{row}">
               <span v-if="row.layer == 1" style="color:red">第1层(最下层)</span>
               <span v-if="row.layer !== 1" >第{{row.layer}}层</span>
            </template>
          </el-table-column>
          <el-table-column prop="box" label="箱子编号"  />   
          <el-table-column prop="so" label="车间订单号"  />


        </el-table>

         <!-- 添加表单 -->
         <el-dialog :title="dialogTitle" :visible.sync="dialogOperationFormVisible">
            <el-form :model="form" label-width="120px" ref="form" :rules="rules" >
                <el-form-item label="箱子编号" prop="box">
                    <el-input v-model="form.box" clearable ref="box"></el-input>
                </el-form-item>
               <el-form-item label="车间订单号" prop="so">
                    <el-input v-model="form.so" clearable ref="so"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOperationFormVisible = false">取消</el-button>
                <el-button type="primary" @click="save">添加</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>

import inBox from '@/api/personal/in'

export default {
    data() {    
        return {
          
            list:[], //数据列表

            form: {box:''}, //添加表单

            loading: false,
            
            
            dialogOperationFormVisible:false,  //是否展示新增对话框
            dialogTitle:'',

            rules:{
                box :[{required: true, message: '请输入箱子编号', trigger: 'blur'}],
                so :[{required: true, message: '请输入车间订单号', trigger: 'blur'}]
            }


        }
    },
    created(){ 
    },
    computed: {
      newBox() {
        return this.form.box;
      }
    },

    watch:{
        newBox(val){
            if(val.length === 15){
                this.$nextTick(function () {
                    this.$refs.so.$el.querySelector('input').focus();
                });
            }
        }
    },

    methods:{
         //点击新增弹出对话框
        openDialog(){
            if(this.list.length < 3){
                this.dialogOperationFormVisible = true;
                this.dialogTitle = '新增料盒'
                if (this.$refs["form"] !== undefined) {this.$refs["form"].resetFields();}  //mouted加载数据以后，隐藏的弹出框并没有编译渲染进dom里面。click弹出的时候$refs并没有获取到dom元素导致 'resetFields' of undefined
                this.form = {box:''}

                this.$nextTick(function () {
                    this.$refs.box.$el.querySelector('input').focus();
                });
            }else{
                 this.$message({
                    type:'warning',
                    message:'每次最多叠三个料盒进行入库' 
                })
            }
           
        },

        //添加
        save(){
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    var len = this.list.length;
                    if(len === 0){this.form.layer = 1}
                    if(len === 1){this.form.layer = 2}
                    if(len === 2){this.form.layer = 3}
                    let data={};
                    Object.assign(data,this.form)   //对象拷贝，否则会有问题
                    this.list.push(data)
                    this.$message({
                        type:'success',
                        message:'添加料盒成功！' 
                    })
                    this.dialogOperationFormVisible = false
                   
                } else {
                    return false;
                }
                });
            },


          clearBox(){
              this.list = [];
          } ,

          ruku(){
              if(this.list.length === 0 ){
                  this.$message({
                        type:'warning',
                        message:'至少添加一个料盒' 
                    })
                  return;
              }
               this.loading = true;
              inBox.addBoxes(this.list).then(response => {
                 this.$router.push({ path: '/personal/inlist' })
              }).catch( e => {
                  this.loading = false;
              })
          }
    }
}
</script>