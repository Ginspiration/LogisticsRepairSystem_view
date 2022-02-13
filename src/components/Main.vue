<template>
  <div>
    <el-container style="height:1000px">
      <el-aside width="200px">
        <el-header style="text-align: left; font-size: 20px">后勤报修系统</el-header>
        <el-menu router v-if="active">
          <el-menu-item v-for="(item,i) in menu" :key="i" :index="item.path">
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">{{ userInfo.name }}
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "Main",
  created() {
    if (this.$route.path === '/') {
      //console.log("this.$route.path:"+this.$route.path)
      this.active = false
    }
  },
  data() {
    return {
      active: true,
      userInfo: {
        name: '',
        phone: '',
        password: ''
      },
      menu: [
        {path: '/WeChatPublish', name: '微信公告发布'},
        {path: '/Report', name: '维修上报'},
        // {path: '/Repairing', name: "正在维修"},
        // {path: '/RepairComplete', name: '历史维修'},
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
    getUserInfo() {
      this.axios.post("/admin/getUserInfo", {}).then((response) => {
        if (response.data.status === 200) {
          let curUser = response.data.respBody
          this.userInfo.name = curUser.name
          this.userInfo.password = curUser.password
          this.userInfo.phone = curUser.phone
        } else {
          this.$message.error('用户信息获取失败,原因:' + response.data.respBody)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #02a14c;
  color: #fffefe;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>