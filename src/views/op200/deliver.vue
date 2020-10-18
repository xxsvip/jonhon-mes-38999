<template>
    <div class="app-container">

         <div> <el-button type="primary" @click="liuzhuanAction">流转</el-button></div><br/>

        <el-form :model="allbox"  label-width="120px" ref="form" >
            <el-form-item label="料盒1">
                <el-input v-model="allbox.box1" ref="box1" placeholder="料盒1(最下层)" clearable  />
            </el-form-item>
             <el-form-item label="料盒2">
                <el-input v-model="allbox.box2" ref="box2" clearable  />
            </el-form-item>
             <el-form-item label="料盒3">
                <el-input v-model="allbox.box3" ref="box3" clearable  />
            </el-form-item>
             <el-form-item label="料盒4">
                <el-input v-model="allbox.box4" ref="box4" clearable  />
            </el-form-item>
             <el-form-item label="料盒5">
                <el-input v-model="allbox.box5" ref="box5" clearable  />
            </el-form-item>
             <el-form-item label="料盒6">
                <el-input v-model="allbox.box6" ref="box6" clearable  />
            </el-form-item>
        </el-form>
         


    </div>
</template>

<script>

import op200 from '@/api/op200/op200'

export default {
    data() {    
        return {

            allbox:{}

        }
    },
    created(){ 
        this.$nextTick(function () {
            this.$refs.box1.$el.querySelector('input').focus();
        });
    },
    computed: {
      newBox1() { return this.allbox.box1;},
      newBox2() { return this.allbox.box2;},
      newBox3() { return this.allbox.box3;},
      newBox4() { return this.allbox.box4;},
      newBox5() { return this.allbox.box5;}
    },
    watch:{
        newBox1(val){if(val.length === 15){this.$nextTick(function () { this.$refs.box2.$el.querySelector('input').focus();});} },
        newBox2(val){if(val.length === 15){this.$nextTick(function () { this.$refs.box3.$el.querySelector('input').focus();});} },
        newBox3(val){if(val.length === 15){this.$nextTick(function () { this.$refs.box4.$el.querySelector('input').focus();});} },
        newBox4(val){if(val.length === 15){this.$nextTick(function () { this.$refs.box5.$el.querySelector('input').focus();});} },
        newBox5(val){if(val.length === 15){this.$nextTick(function () { this.$refs.box6.$el.querySelector('input').focus();});} }
    },

    methods:{

        liuzhuanAction(){

            var finalBoxes = [];

            for(var box in this.allbox) {
                 if(this.allbox[box].length === 15 ){
                     finalBoxes.push(this.allbox[box])
                 }
                 if(this.allbox[box].length < 15 && this.allbox[box].length > 0 ){
                      this.$message({
                            type:'warning',
                            message:'输入的料盒信息有误' 
                        })
                     return
                 }
            }

            if(finalBoxes.length === 0){
                this.$message({type:'warning',message:'至少要有一个料盒信息' })
            }

            op200.deliver(this.$route.query.so,finalBoxes.join(',')).then(response =>{
                this.$router.push({path:'/op200/workbench'})
            })

        }


    }
}
</script>