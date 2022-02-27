<template>
  <div class="container">
    <el-row>
      <el-col :span="9">
        <span style="font-size: larger">筛选：</span>
        未维修
        <el-switch
            v-model="unRepair"
            active-color="#13ce66"
            inactive-color="#409EFF">
        </el-switch>
        在维修
        <el-switch
            v-model="repairing"
            active-color="#13ce66"
            inactive-color="#409EFF">
        </el-switch>
        已维修
        <el-switch
            v-model="repaired"
            active-color="#13ce66"
            inactive-color="#409EFF">
        </el-switch>
        异常
        <el-switch
            v-model="errorRepair"
            active-color="#13ce66"
            inactive-color="#409EFF">
        </el-switch>
      </el-col>
    </el-row>
    <br/>
    <el-table
        :data="reportData"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="date"
          label="日期"
          width="150">
      </el-table-column>
      <el-table-column
          v-if="false"
          prop="repairId"
          label="repairId"
          width="0">
      </el-table-column>
      <el-table-column
          v-if="false"
          prop="reportId"
          label="reportId"
          width="0">
      </el-table-column>
      <el-table-column
          v-if="false"
          prop="repairPhone"
          label="repairPhone"
          width="0">
      </el-table-column>
      <el-table-column
          prop="name"
          label="上报人姓名"
          width="120">
      </el-table-column>
      <el-table-column
          prop="number"
          label="学号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号"
          width="120">
      </el-table-column>
      <el-table-column
          prop="faculty"
          label="分院"
          width="120">
      </el-table-column>
      <el-table-column
          prop="address"
          label="报修地址"
          width="300">
      </el-table-column>
      <el-table-column
          prop="description"
          label="描述"
          width="300">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">详细</el-button>
          <el-button @click="dealReport(scope.row)" type="text" size="small">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-drawer
        title="可点击图片查看大图"
        :visible.sync="drawer"
        :direction="direction"
        :append-to-body="true"
    >
      <div class="container">
        <div class="demo-image__preview el-dialog--center">
          <el-image
              style="width: 200px; height: 200px"
              :src="imgData.imgUrl"
              :preview-src-list="imgData.bigImg">
          </el-image>
        </div>
        <div class="description">
          <span>
            <h4>报修描述：</h4>
            {{ imgData.description }}
          </span>
          <span v-if="maintainerInfo!==null
          &&maintainerInfo!==[]
          &&maintainerInfo!==''
          &&maintainerInfo.name!==null
          &&maintainerInfo.phone!==null">
          <h4>维修人信息：</h4>
          <p>{{ maintainerInfo.name }}</p>
            <p>联系方式: {{ maintainerInfo.phone }}</p>
            <p>最新维修时间: {{ RepairedDate }}</p>
          </span>
        </div>
      </div>
    </el-drawer>

    <el-dialog title="报修处理" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="maintainersForm">
        <el-form-item label="处理方式" label-width="120px">
          <el-select v-model="dealWay" placeholder="请选择处理方式">
            <el-option label="派送维修人员" value="send"></el-option>
            <el-option label="维修完成" value="complete" v-if="showComplete"></el-option>
            <el-option label="异常" value="error" v-if="showError"></el-option>
          </el-select>
          &nbsp;
          <el-select
              v-model="maintainersForm.repairManPhone"
              @change="selectOnChange"
              v-if="dealWay==='send'"
              placeholder="请选择员工">
            <el-option v-for="(val,index) in maintainersForm.maintainers"
                       :key="index"
                       :value="val.phone"
                       :label="val.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dealWithReport">提交结果</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Report",

  created() {
    //let headers = {"content-Type":"application/json"}
    this.pageSize = 5
    this.getReportInfo(1, this.pageSize, 0)
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    dealWay(newV, oldV) {
      if (newV === 'send') {
        this.$data.dealWay = newV
        this.dealStatus = 1
        this.getAllMaintainerInfo()
      } else if (newV === 'complete') {
        this.$data.dealWay = newV
        this.dealStatus = 2
      } else if (newV === 'error') {
        this.$data.dealWay = newV
        this.dealStatus = 3
      }
    },
    unRepair(val) {
      if (val === true) {
        this.$data.showError = true
        this.$data.showComplete = false
        this.$data.repaired = false
        this.$data.repairing = false
        this.$data.errorRepair = false
        this.$data.chooseStatus = 0
        this.getReportInfo(this.currentPage, this.pageSize, 0)
      }
    },
    repairing(val) {
      if (val === true) {
        this.$data.showError = true
        this.$data.showComplete = true
        this.$data.repaired = false
        this.$data.unRepair = false
        this.$data.errorRepair = false
        this.$data.chooseStatus = 1
        this.getReportInfo(this.currentPage, this.pageSize, 1)
      }
    },
    repaired(val) {
      if (val === true) {
        this.$data.showComplete = false
        this.$data.showError = true
        this.$data.repairing = false
        this.$data.unRepair = false
        this.$data.errorRepair = false
        this.$data.chooseStatus = 2
        this.getReportInfo(this.currentPage, this.pageSize, 2)
      }
    },
    errorRepair(val) {
      if (val === true) {
        this.$data.showError = false
        this.$data.repaired = false
        this.$data.unRepair = false
        this.$data.repairing = false
        this.$data.chooseStatus = 3
        this.getReportInfo(this.currentPage, this.pageSize, 3)
      }
    },
  },
  methods: {
    //监听选择的员工
    selectOnChange(mId) {
      this.maintainersForm.repairManPhone = mId
    },
    dealWithReport() {
      let row = this.currRow
      let deal = this.dealStatus
      let repairManPhone = this.maintainersForm.repairManPhone
      let reportPhone = row.phone
      let rprId = row.repairId
      let rptId = row.reportId
      if (repairManPhone === '' || repairManPhone === null){
        repairManPhone = row.repairPhone
      }
      this.axios.post("/repair/dealWithReport",
          {
            "reportId": rptId,
            "repairId": rprId,
            "reportPhone": reportPhone,
            "repairPhone": repairManPhone,
            "status": deal
          }
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success(response.data.respBody)
          this.maintainersForm.maintainers = response.data.respBody
          this.maintainersForm.repairManPhone = ''
          this.dialogFormVisible = false
          this.getReportInfo(this.$data.currentPage, this.$data.pageSize, this.$data.chooseStatus)
          this.$data.maintainerInfo = null
          this.$data.dealWay = ''
        } else {
          this.$message.error('操作失败,原因:' + response.data.respBody)
        }
      })

    },
    dealReport(row) {
      this.dialogFormVisible = true
      this.currRow = row
    },
    getAllMaintainerInfo() {
      this.axios.post("/maintainer/getAllMaintainerInfo"
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success('get maintainers data success')
          this.maintainersForm.maintainers = response.data.respBody
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    /*详细弹窗信息*/
    handleClick(row) {
      let url
      if (row.imgUrl === null || row.imgUrl === '') {
        url = "http://localhost:7999/image/user-img-is-null.png"
      } else
        url = "http://localhost:7999" + row.imgUrl
      this.drawer = true
      this.imgData.description = row.description
      this.imgData.imgUrl = url
      //console.log(this.imgData.imgUrl)
      this.imgData.bigImg = [url]
      this.getRepairInfoById(row.repairId)
    },
    getRepairInfoById(id) {
      console.log(id)
      this.axios.post("/repair/getRepairInfoById",
          {"id": id}
      ).then((response) => {
        if (response.data.status === 200) {
          //this.$message.success('get report data success')
          this.$data.maintainerInfo = response.data.respBody.maintainer
          this.$data.RepairedDate = response.data.respBody.repairedDate
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    getReportInfo(curr, size, status) {
      this.axios.post("/report/getReportInfo",
          {"curr": curr, "size": size, "status": status}
      ).then((response) => {
        if (response.data.status === 200) {
          //this.$message.success('get report data success')

          this.reportData = response.data.respBody.records;
          console.log(response.data.respBody.records)
          this.total = response.data.respBody.total
          this.pages = response.data.respBody.pages

        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getReportInfo(this.currentPage, size, this.$data.chooseStatus)
      //console.log(this.pageSize)  //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.getReportInfo(currentPage, this.pageSize, this.$data.chooseStatus)
      //console.log(this.currentPage)  //点击第几页
    },
  },

  data() {
    return {
      //显示维修完成
      showComplete:false,
      //显示异常
      showError:true,

      reportData: [{}],
      currentPage: 1,  //初始页
      pageSize: 5,    //每页的多少条
      pages: 0,       //共多少页
      total: 0,        //多少条数据

      /*详细信息*/
      imgData: [{
        description: '',
        imgUrl: '',
        bigImg: [],
      }],
      drawer: false,
      direction: 'ltr',
      display: 'none',
      maintainerInfo: [],
      RepairedDate: '',
      showMaintainer: '',

      /*处理信息*/
      currRow: {},//选中的数据(条)
      dealStatus: '',//处理方式(int)
      dialogTableVisible: false,
      dialogFormVisible: false,
      dealWay: '',//处理方式
      maintainersForm: {
        maintainers: [],//员工列表
        repairManPhone: ''//选择的员工
      },

      /*筛选*/
      unRepair: true,
      repaired: false,
      errorRepair: false,
      repairing: false,
      chooseStatus: 0,
    }
  }
}
</script>

<style scoped>
.description {
  border-left: 10px solid #FFFFFF;
  border-right: 10px solid #FFFFFF;
}
.container{
  background-color: #FFFFFF;
  border: 10px solid #FFFFFF;
  border-radius: 12px;
}
</style>