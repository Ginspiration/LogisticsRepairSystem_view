<template>
  <div>
    <div class="container">
      <el-row style="background-color: #FFFFFF">
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible=true">新增员工</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="repairStaff"
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
            width="200">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="联系方式"
            width="200">
        </el-table-column>
        <el-table-column
            prop="statusStr"
            label="状态"
            width="200">
        </el-table-column>
        <el-table-column
            prop="workCount"
            label="出工次数"
            width="200">
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
      <el-dialog title="新增员工" :visible.sync="dialogFormVisible"
                 :append-to-body="true"
                 :show-close="false"
                 :close-on-click-modal="false">
        <el-form ref="form" :model="addStaffForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="addStaffForm.name" :disabled="staffNameDisable"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addStaffForm.phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="staffSubmit">确定</el-button>
            <el-button @click="updateOrAddCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminStaff",
  created() {
    this.getAllMaintainerInfo()
  },
  methods: {
    getAllMaintainerInfo() {
      this.axios.post("/maintainer/getAllMaintainerInfo"
      ).then((response) => {
        if (response.data.status === 200) {
          //this.$message.success('get maintainers data success')
          this.$data.repairStaff = response.data.respBody
          //console.log(response.data.respBody)
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    staffSubmit() {
      let isAdd = this.$data.staffNameDisable
      let this_ = this.$data.addStaffForm
      if (!isAdd) {
        this.$data.staffNameDisable = false
        this.axios.post("/maintainer/saveOrUpdate", {
              "name": this_.name,
              "phone": this_.phone
            }
        ).then((response) => {
          if (response.data.status === 200) {
            this.$message.success(response.data.respBody)
            this.$data.addStaffForm.phone = ''
            this.$data.addStaffForm.name = ''
            this.getAllMaintainerInfo()
          } else {
            this.$message.error('数据获取失败,原因:' + response.data.respBody)
          }
        })
        this.$data.dialogFormVisible = false
      } else {
        let row = this.$data.updateRow
        this.axios.post("/maintainer/saveOrUpdate", {
              "id": row.id,
              "phone": this_.phone
            }
        ).then((response) => {
          if (response.data.status === 200) {
            this.$message.success(response.data.respBody)
            this.$data.addStaffForm.phone = ''
            this.$data.addStaffForm.name = ''
            this.$data.updateRow = ''
            this.$data.staffNameDisable = false
            this.getAllMaintainerInfo()
          } else {
            this.$message.error('数据获取失败,原因:' + response.data.respBody)
          }
        })
        this.$data.dialogFormVisible = false
      }
    },
    update(row) {
      this.$data.staffNameDisable = true
      this.$data.addStaffForm.name = row.name
      this.$data.addStaffForm.phone = row.phone
      this.$data.updateRow = row
      this.$data.dialogFormVisible = true
    },
    updateOrAddCancel(){
      this.$data.staffNameDisable = false
      this.$data.addStaffForm.name = ''
      this.$data.addStaffForm.phone = ''
      this.$data.updateRow = ''
      this.$data.dialogFormVisible = false
    },
    del(row) {
      console.log(row.id)
      this.axios.post("/maintainer/del", {
            "id": row.id,
          }
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success(response.data.respBody)
          this.getAllMaintainerInfo()
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
  },
  data() {
    return {
      repairStaff: [],
      staffNameDisable: false,
      /*add staff*/
      dialogFormVisible: false,
      addStaffForm: {
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

</style>