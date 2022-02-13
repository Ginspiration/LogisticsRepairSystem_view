<template>
  <div>
    <el-row>
      <el-col>
        微信公告发布
        <el-form ref="form" :model="submitForm" label-width="90px">
          <el-form-item label="公告发布方">
            <el-input v-model="submitForm.publisher"></el-input>
          </el-form-item>
          <el-form-item label="公告标题">
            <el-input v-model="submitForm.title"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="选择图片">
                <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :http-request="getFile"
                    :limit="1"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="1"><el-button @click="uploadImg" type="info">上传</el-button></el-col>
          </el-row>
          <el-form-item label="公告内容">
            <el-input type="textarea" :rows="10" v-model="submitForm.content"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="publish">确认发布</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>

</template>

<script>

export default {
  data() {
    return {
      //fileList: [],
      file: {},
      imageUrl: '',
      submitForm: {
        publisher: '',
        title: '',
        content: ''
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    publish() {
      this.$confirm('公告发布后微信用户将立即收到消息 , 并无法撤回 , 是否在检查一遍?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSubmit()
        this.$message({
          type: 'success',
          message: '发布成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '发布取消'
        });
      });
    },
    onSubmit() {
      let _this = this
      this.axios.post("/announce/publish/doPublish",{
        publisher:_this.submitForm.publisher,
        title:_this.submitForm.title,
        content:_this.submitForm.content
      }).then((response) => {
        if (response.status===200){
          this.$message.success('发布成功,请微信公众查收!')
        }else{
          this.$message.error('发布失败!')
        }
      })
    },
    getFile(item) {
      //console.log(item.file)
      this.file = item.file
    },
     uploadImg() {
       const fd = new FormData()
       fd.append('file', this.file)
       const config = {headers: {'Content-Type': 'multipart/form-data'}}
       this.axios.post("/announce/publish/upload",fd,config).then((response) => {
         if (response.status===200){
           this.$message.success('图片上传成功!')
         }else{
           this.$message.error('图片上传失败!')
         }
       })
     },
  }
};
</script>

<style scoped>

</style>
