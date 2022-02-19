<template>
  <div class="bg-container">
    <el-container style="height:1100px">
      <el-header>
        <el-row :gutter="0">
          <el-col :span="2">
            <h1>后勤报修系统</h1>
          </el-col>
          <el-col :span="2" :offset="20" style="text-align: right">
            <br/>
              <el-link @click="UserInfoDialog = true">
                {{ userInfo.name }}
              </el-link>
          </el-col>
        </el-row>


      </el-header>

      <el-container>
        <el-aside width="200px">
          <!--          <el-header class="el-header-left">后勤报修系统</el-header>-->
          <el-menu router v-if="active">
            <el-menu-item v-for="(item,i) in menu" :key="i" :index="item.path" class="el-menu-item">
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
      <el-footer><br/>华东交通大学理工学院</el-footer>
    </el-container>

    <el-dialog width="300px" :title="userInfo.name" :visible.sync="UserInfoDialog" :append-to-body="true">
      <el-row>
        <el-col>
          <el-link class="el-link--primary" @click="UserInfoManageDialog = true">我的信息管理</el-link>
        </el-col>
      </el-row>
      <br/><br/>
      <el-row>
        <el-col>
          <el-button @click="logOut" class="el-button--warning">退出登录</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog width="500px" :title="userInfo.name" :visible.sync="UserInfoManageDialog" :append-to-body="true">
      <el-form ref="form" :model="userInfoManage" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="userInfoManage.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfoManage.phone" :placeholder="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-button @click="UserInfoPasswordDialog = true" class="el-link">修改</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">确定</el-button>
          <el-button @click="UserInfoManageDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="500px" :title="userInfo.name" :visible.sync="UserInfoPasswordDialog" :append-to-body="true">
      <el-form ref="form" :model="userInfoManage" label-width="80px">
        <el-form-item label="新密码">
          <el-input type="password" v-model="userInfoManage.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="userInfoManage.passwordConfirm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">确定</el-button>
          <el-button @click="UserInfoPasswordDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Main",
  created() {
    if (this.$route.path === '/') {
      //console.log("this.$route.path:"+this.$route.path)
      this.getUserInfo()
      this.active = false
    }
  },
  data() {
    return {
      //loginState: false,
      active: true,
      UserInfoDialog: false,
      UserInfoManageDialog: false,
      UserInfoPasswordDialog: false,
      userInfoManage: {
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
        id: '',
      },
      userInfo: {
        name: sessionStorage.getItem("curUserName"),
        phone: sessionStorage.getItem("currUserPhone"),
        id: sessionStorage.getItem("currUserId"),
      },
      menu: [
        {path: '/WeChatPublish', name: '微信公告发布'},
        {path: '/Report', name: '维修上报'},
        {path: '/RepairStaff', name: '维修人员信息'},
        {path: '/AdminStaff', name: '管理员信息'}
      ]
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (to.path !== '/') {
        this.active = true
        this.getUserInfo()
      }
    }
  },
  methods: {
    logOut() {
      this.$data.userInfo.name = null
      sessionStorage.clear()
      this.$data.UserInfoDialog = false
      this.$data.active = false
      this.$router.push({path: '/'})
    },
    updateUserInfo() {
      if (this.$data.userInfoManage.password !== this.$data.userInfoManage.passwordConfirm) {
        this.$message.success("两次密码不一致！")
        return
      }
      let userId = sessionStorage.getItem("currUserId")
      let userPhone
      if (this.$data.userInfoManage.phone === '' || this.$data.userInfoManage.phone === null) {
        userPhone = sessionStorage.getItem("currUserPhone")
      } else {
        userPhone = this.$data.userInfoManage.phone
      }
      let userPassword = this.$data.userInfoManage.password
      let userName = sessionStorage.getItem("curUserName")
      this.axios.post("/admin/saveOrUpdate", {
        "id": userId,
        "name": userName,
        "phone": userPhone,
        "password": userPassword,
      }).then((response) => {
        if (response.data.status === 200) {
          this.$message.success(response.data.respBody)
          this.$data.UserInfoManageDialog = false
          this.$data.UserInfoPasswordDialog = false
          this.$data.UserInfoDialog = false
          this.getUserInfo()
        } else {
          this.$message.error('用户信息获取失败,原因:' + response.data.respBody)
        }
      })
    },
    getUserInfo() {
      this.axios.post("/admin/getUserInfo", {}).then((response) => {
        if (response.data.status === 200) {
          let curUser = response.data.respBody
          sessionStorage.setItem("curUserName", curUser.name)
          sessionStorage.setItem("currUserPhone", curUser.phone)
          sessionStorage.setItem("currUserId", curUser.id)
          this.$data.userInfo.name = curUser.name
          this.$data.userInfo.phone = curUser.phone
          this.$data.userInfo.id = curUser.id
          this.$data.userInfoManage.name = curUser.name
          this.$data.userInfoManage.phone = curUser.phone
          this.$data.userInfoManage.id = curUser.id
          //this.$data.loginState = true
        } else {
          this.$message.error('用户信息获取失败,原因:' + response.data.respBody)
        }
      })
    }
  }
}
</script>

<style scoped>

.bg-container {
  background-image: url("../assets/bg-img.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  border: 13px solid #008752;
  border-radius: 25px;
}


.el-header {
  border: 5px solid #FFFFFF;
  color: black;
  font-family: 幼圆;
  opacity: 0.8;
  background-color: #FFFFFF;
  /*text-align: right;*/
  font-size: 12px;
  border-radius: 12px 12px 12px 0;
}

.el-footer {
  text-align: center;
  font-size: 15px;
  color: white;
  background-color: rgba(255, 255, 255, 0.76);
  border-radius: 12px;
}

.el-menu {
  opacity: 0.9;
  color: black;
  border-radius: 0 0 12px 12px;
}

.el-menu-item {
  font-size: 15px;
  border-radius: 12px;
}
</style>