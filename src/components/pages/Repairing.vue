<template>
  <div class="container">
    <el-table
        :data="repairData"
        border
        style="width: 100%">
      <el-table-column
          fixed
          prop="date"
          label="日期"
          width="150">
      </el-table-column>
      <el-table-column
          prop="name"
          label="上报人与联系方式"
          width="200">
      </el-table-column>
      <el-table-column
          prop="address"
          label="报修地址"
          width="120">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态"
          width="120">
      </el-table-column>
      <el-table-column
          prop=""
          label="维修人与联系方式"
          width="200">
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="300">
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
        </div>
      </div>
    </el-drawer>

    <el-dialog title="报修处理" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form :model="maintainersForm">
        <el-form-item label="处理方式" label-width="120px">
          <el-select v-model="dealWay" placeholder="请选择处理方式">
            <el-option label="派送维修人员" value="send"></el-option>
            <el-option label="维修完成" value="complete"></el-option>
            <el-option label="异常" value="error"></el-option>
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
                       :label="val.name+'(出工'+val.workCount+'次)'"></el-option>
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
  name: "RepairIng",

  created() {
    //let headers = {"content-Type":"application/json"}
    this.pageSize = 5
    this.getReportInfo(1, this.pageSize)
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    dealWay(newV, oldV) {
      if (newV === 'send') {
        this.dealWay = newV
        this.dealStatus = 1
        this.getAllMaintainerInfo()
      }
    }
  },
  methods: {
    //监听选择的员工
    selectOnChange(mId){
      // let obj = {};
      // obj = this.maintainersForm.maintainers.find((val)=>{//这里的selectList就是上面遍历的数据源
      //  // return val.id === vId;//筛选出匹配数据
      //   console.log(val.name +'/'+vId)
      // });
      // console.log(obj);//我这边的name就是对应label的
      this.maintainersForm.repairManPhone = mId
    },
    dealWithReport() {
      let row = this.currRow
      let deal = this.dealStatus
      let repairManPhone = this.maintainersForm.repairManPhone
      let reportPhone = row.phone
      console.log(deal)
      console.log(repairManPhone)
      this.axios.post("/repair/dealWithReport",
          {
            "reportPhone": reportPhone,
            "repairPhone": repairManPhone,
            "status": deal
          }
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success('处理成功')
          this.maintainersForm.maintainers = response.data.respBody
          this.dialogFormVisible = false
        } else {
          this.$message.error('操作失败,原因:' + response.data.respBody)
        }
      })

    },
    dealReport(row) {
      this.dialogFormVisible = true
      //console.log(row)
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
    handleClick(row) {
      //console.log(row)
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
    },
    getReportInfo(curr, size) {
      this.axios.post("/report/getReportInfo",
          {"curr": curr, "size": size}
      ).then((response) => {
        if (response.data.status === 200) {
          this.$message.success('get report data success')

          this.reportData = response.data.respBody.records;

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
      this.getReportInfo(this.currentPage, size)
      //console.log(this.pageSize)  //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.getReportInfo(currentPage, this.pageSize)
      //console.log(this.currentPage)  //点击第几页
    },
  },

  data() {
    return {
      repairData:[{}],
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

      /*处理信息*/
      currRow:{},//选中的数据(条)
      dealStatus:'',//处理方式(int)
      dialogTableVisible: false,
      dialogFormVisible: false,
      dealWay: '',//处理方式
      maintainersForm: {
        maintainers: [],//员工列表
        repairManPhone: ''//选择的员工
      },

      //repairManPhoneList:false,
      //repairManPhone:[],

    }
  }
}
</script>

<style scoped>
.description {
  border-left: 10px solid #FFFFFF;
  border-right: 10px solid #FFFFFF;
}
</style>