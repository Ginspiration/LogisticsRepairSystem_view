<template>
<div>
  <el-row>
    <el-col :span="8" :offset="9">
      <h1 style="color: #FFFFFF">登录</h1>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8" :offset="5">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="phone">
          <span slot="label" class="span-gy">手机号</span>
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item  prop="pass">
          <span slot="label" class="span-gy">密码</span>
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button class="el-button--danger" type="primary" @click="toSuperLogin()">超级管理员</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('输入正确手机号!'));
        } else {
          let reg = /^1[0-9]{10}$/
          if (!reg.test(value)) {
            callback(new Error('输入正确手机号!'));
          } else {
            callback();
          }
        }
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
        phone: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    toSuperLogin(){
      this.$router.push({path:'/SuperLogin'})
    },
    submitForm(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios.post("/admin/login",{
            'password':_this.ruleForm.pass,
            'phone':_this.ruleForm.phone
          }).then((response) => {
            if (response.data.status===200){
              this.$message.success('登录成功')
              this.$router.push({path:'/Index'})
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
    }
  }
}
</script>

<style scoped>
.span-gy{
  color: #FFFFFF;
}
</style>