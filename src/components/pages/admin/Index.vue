<template>
<el-row>
  <el-col :span="6" :offset="9" style="color: #FFFFFF;font-size: 40px">
    公告/时间线
  </el-col>
    <el-col>
      <div class="block">
        <el-timeline>
          <el-timeline-item
              v-for="(announceVo, index) in announceVo"
              :key="index"
              :timestamp="announceVo.announce.dateStr"
              placement="top">
            <el-card>
              <h4>标题：{{announceVo.announce.title}}</h4>
              <p><span style="font-weight: bold">内容：</span><br/>{{announceVo.announce.content}}</p>
              <div class="demo-image__placeholder">
                <div class="block">
                  <span class="demonstration"><span style="font-weight: bold">图片:</span></span><br/>
                  <el-image style="width: 300px" :src="announceVo.announce.imgUrl"></el-image>
                </div>
              </div>
              <p><span style="font-weight: bold">公告发布方：</span>{{announceVo.announce.publisher}}</p>
              <p>由：{{announceVo.adminName}} 操作，发布于——{{announceVo.announce.dateStr}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Index",
  created() {
    this.getPublishInfo();
  },
  methods:{
    getPublishInfo() {
      this.axios.post("/announce/publish/getPublish",
          {"adminId": 1}
      ).then((response) => {
        if (response.data.status === 200) {
          this.$data.announceVo = response.data.respBody
        } else {
          this.$message.error('数据获取失败,原因:' + response.data.respBody)
        }
      })
    }
  },
  data(){
    return{
      announceVo:''
    }
  }
}
</script>

<style scoped>

</style>