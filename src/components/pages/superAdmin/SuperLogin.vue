<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="9">
        <h1 style="color: #FFFFFF">超级管理登录</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="5">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item prop="account">
            <span slot="label" class="span-gy">管理员账号</span>
            <el-input v-model.number="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item  prop="pass">
            <span slot="label" class="span-gy">密码</span>
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button class="el-button--warning" @click="backToLogin()">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name:'SuperLogin',
  data() {
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'));
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        //   callback(new Error('输入正确账号!'));
        // } else {
        //   let reg = /{}/
        //   if (!reg.test(value)) {
        //     callback(new Error('输入正确账号!'));
        //   } else {
        //     callback();
        //   }
        // }
        if(value === '' || value === null){
          callback(new Error('请输入账号!'));
        }else
            callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        account: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post("/superAdmin/login",{
            'account':_this.ruleForm.account,
            'password':_this.ruleForm.pass
          }).then((response) => {
            if (response.data.status===200){
              this.$message.success(response.data.respBody)
              this.$router.push({path:'/SuperAdminStaff'})
            }else{
              this.$message.error('登录失败,原因:'+response.data.respBody)
            }
          })
        } else {
          console.log('您输入的信息不正确!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    backToLogin(){
      this.$router.push({path:'/'})
    }
  }
}
</script>

<style scoped>
.span-gy{
  color: #FFFFFF;
}
</style>