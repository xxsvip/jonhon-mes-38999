<template>
  <div class="app-container">
    <el-form ref="user" :model="user" :rules="validateRules" label-width="120px">
      <el-form-item label="用户工号" prop="username">
        <el-input v-model="user.username"/>
      </el-form-item>
      <el-form-item label="用户姓名" prop="realName">
        <el-input v-model="user.realName"/>
      </el-form-item>
     
      <!-- <el-form-item v-if="!user.id" label="用户密码" prop="password">
        <el-input v-model="user.password"/>
      </el-form-item> -->

      <el-form-item label="用户班组" prop="teamId">
        <el-select v-model="user.teamId" clearable style="width:500px">
            <el-option v-for="team in teamList" 
            :key="team.id" :label="team.teamName" :value="team.id"/>
        </el-select>
       </el-form-item>

        <el-form-item label="用户工序" prop="operationId">
        <el-select v-model="user.operationId" placeholder="可多选" multiple style="width:500px">
            <el-option v-for="operation in operationList" 
            :key="operation.id" :label="operation.name" :value="operation.id"/>
        </el-select>
       </el-form-item>

       <el-form-item label="用户工位">
           <el-cascader v-model="user.workcenterId" :options="workCenterOptions" clearable></el-cascader>
       </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import userApi from '@/api/acl/user'
import teamApi from '@/api/base/team'
import operationApi from '@/api/base/operation'
import lineApi from '@/api/base/line'



const defaultForm = {
  username: '',
  realName: ''//,
  // password: ''
}

// const validatePass = (rule, value, callback) => {
//   if (value.length < 6) {
//     callback(new Error('密码不能小于6位'))
//   } else {
//     callback()
//   }
// }

export default {
  data() {
    return {
      user: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      validateRules: {
        username: [{ required: true, trigger: 'blur', message: '用户工号必须输入' }],
        realName: [{ required: true, trigger: 'blur', message: '用户姓名必须输入' }]

        // password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      teamList: null,  //用户所在班组信息
      operationList: null , //用户工序信息
      workCenterOptions: [],
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      // console.log('路由变化......')
      // console.log(to)
      // console.log(from)
      this.init()
    }
  },

  // 生命周期方法（在路由切换，组件不变的情况下不会被调用）
  created() {
    // console.log('form created ......')
    this.init()
  },

  methods: {

    // 表单初始化
    init() {
      //debugger
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        // 对象拓展运算符：拷贝对象，而不是赋值对象的引用
        this.user = { ...defaultForm }
      }


      //加载班组信息
      teamApi.getTeamList('').then(response =>{
        this.teamList = response.data.list
      })
      //加载工序信息
      operationApi.getAll().then(response => {
        this.operationList = response.data.list
      })
      //加载产线信息
      lineApi.getAllWithTree().then(response => {
        this.workCenterOptions = response.data.finalList;
      })



    },

    saveOrUpdate() {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          this.user.stationId = this.user.workcenterId[this.user.workcenterId.length - 1];  //返回两个值，最后一个为最全的选中项目。
          if (!this.user.id) {
            this.saveData()
          } else {
            this.updateData()
          }
        }
      })
    },

    // 新增用户
    saveData() {
      userApi.save(this.user).then(response => {
        // debugger
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.$router.push({ path: '/acl/user/list' })
        }
      })
    },

    // 根据id更新记录
    updateData() {
      // teacher数据的获取
      userApi.updateById(this.user).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.$router.push({ path: '/acl/user/list' })
        }
      })
    },

    // 根据id查询记录
    fetchDataById(id) {
      userApi.getById(id).then(response => {
        //debugger
        this.user = response.data.item
        if(this.user.stationId){
          this.user.workcenterId = [this.user.stationId.substr(0,8),this.user.stationId]  //element ui 级联选择需要设置所有选中层级。
        }
        
      })
    }

  }
}
</script>
