<template>
  <div>
    <div class="container">
      <el-row style="background-color: #FFFFFF">
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">新增管理员</el-button>
        </el-col>
        <el-col :span="4" :offset="16">
            <el-button type="danger" @click="logOut">退出超级管理员</el-button>
        </el-col>
      </el-row>
      <br/>
      <el-table
          :data="adminStaff"
          border
          style="width: 100%">
        <el-table-column
            v-if="false"
            fixed
            prop="id"
            label=""
            width="0">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="400">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="联系方式"
            width="400">
        </el-table-column>

        <el-table-column
            fixed="right"
            label="操作"
            width="300">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="text" size="small">修改</el-button>
            &nbsp;&nbsp;
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row)">
              <el-button style="color: red"  slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog title="新增/修改管理员" :visible.sync="dialogFormVisible"
                 :append-to-body="true"
                 :show-close="false"
                 :close-on-click-modal="false">
        <el-form ref="form" :model="addAdminForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="addAdminForm.name" :disabled="adminNameDisable"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addAdminForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="staffSubmit">确定</el-button>
            <el-button @click="updateOrAddCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <br/><br/><br/><br/><br/><br/>
  </div>
</template>

<script>
export default {
  name: "AdminStaffManage",
  created() {
    this.getAllAdminInfo()
  },
  methods: {
    getAllAdminInfo() {
      this.axios.post("/superAdmin/admin/getAllAdmin"
      ).then((response) => {
        if (response.data.status === 200) {
          //this.$message.success('get maintainers data success')
          this.$data.adminStaff = response.data.respBody
          //console.log(response.data.respBody)
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    staffSubmit() {
      let isAdd = this.$data.adminNameDisable
      let this_ = this.$data.addAdminForm
      if (!isAdd) {//新增
        this.$data.adminNameDisable = false
        //save
        this.axios.post("/superAdmin/admin/saveOrUpdate", {
              "name": this_.name,
              "phone": this_.phone
            }
        ).then((response) => {
          if (response.data.status === 200) {
            this.$message.success(response.data.respBody)
            this.$data.addAdminForm.phone = ''
            this.$data.addAdminForm.name = ''
            this.getAllAdminInfo()
          } else {
            this.$message.error('数据获取失败,原因:' + response.data.respBody)
          }
        })
        this.$data.dialogFormVisible = false
      //update
      } else {//修改
        let row = this.$data.updateRow
        this.axios.post("/superAdmin/admin/saveOrUpdate", {
              "id": row.id,
              "phone": this_.phone
            }
        ).then((response) => {
          if (response.data.status === 200) {
            this.$message.success(response.data.respBody)
            this.$data.addAdminForm.phone = ''
            this.$data.addAdminForm.name = ''
            this.$data.updateRow = ''
            this.$data.adminNameDisable = false
            this.getAllAdminInfo()
          } else {
            this.$message.error('数据获取失败,原因:' + response.data.respBody)
          }
        })
        this.$data.dialogFormVisible = false
      }
    },
    update(row) {
      this.$data.adminNameDisable = true
      this.$data.addAdminForm.name = row.name
      this.$data.addAdminForm.phone = row.phone
      this.$data.updateRow = row
      this.$data.dialogFormVisible = true
    },
    updateOrAddCancel(){
      this.$data.adminNameDisable = false
      this.$data.addAdminForm.name = ''
      this.$data.addAdminForm.phone = ''
      this.$data.updateRow = ''
      this.$data.dialogFormVisible = false
    },
    del(row) {
      console.log(row.id)
      this.axios.post("/superAdmin/admin/del", {
            "id": row.id,
          }
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success(response.data.respBody)
          this.getAllAdminInfo()
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    logOut() {
      this.axios.post("/superAdmin/loginOut", {}).then((response) => {
        if (response.data.status === 200) {
          this.$message.success(response.data.respBody)
        } else {
          this.$message.error('用户信息获取失败,原因:' + response.data.respBody)
        }
      })
      this.$router.push({path: '/'})
    },
  },
  data() {
    return {
      adminStaff: [],
      adminNameDisable: false,
      /*add staff*/
      dialogFormVisible: false,
      addAdminForm: {
        name: '',
        phone: ''
      },
      /*update staff*/
      updateRow: '',
    }
  },
}
</script>

<style scoped>
.container{
  background-color: #FFFFFF;
  border: 10px solid #FFFFFF;
  border-radius: 12px;
  width: 1300px;
  position: absolute;left: 120px;
}
</style>