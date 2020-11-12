<template>
    <!-- 选择小节资料 -->
    <el-dialog title="添加资料" :close-on-click-modal="false" :visible.sync="showDialog" width="80%" min-width='850px' @close="closeDialogFun">
      <div class="form-box" style="width:100%;">
        <el-form :model="resData" ref="resData" v-loading='loading'>
          <el-form-item label="资源类型：">
            <el-select v-model="resData.type" style="width:150px" placeholder="选择资源类型">
              <el-option
                v-for="(item, index) in resTypeArr"
                :label="item.name"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传资源：">
            <el-upload
              ref="upload"
              :action="fileUploadPath"
              :auto-upload="true"
              :show-file-list="false"
              class="avatar-uploader"
              :headers="setHead"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            > 
              <el-button size="small" type="primary">选择资料</el-button>
            </el-upload>
          </el-form-item>

          <el-table
            stripe
            border width='770'
            :data="fileList"
            highlight-current-row
            ref="custTable"
            cell-class-name="center"
            header-cell-class-name="center"
            height="500px"
          >
            <el-table-column label="资料名称" prop="name"></el-table-column>
            <el-table-column label="大小" prop="size">
                 <template slot-scope="scope">
                     <div>
                         {{(parseInt(scope.row.size)/1024/1024).toFixed(2)}}MB
                     </div>
                 </template>
            </el-table-column>
            <el-table-column label="类型" prop="typeName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogFun">取 消</el-button>
        <el-button type="primary" @click="dialogMarksure">确 定</el-button>
      </span>
    </el-dialog>

</template>
<script>

import _request from "@/utils/request";
import { checkCharacters, rightNumber, onlyInputNumber } from "@/utils/rules";
export default { 
  props:['transFile','changeDialogFile'],
  data(){
      return{
        resData: {
            type:1,
            typeName:''
        },  
        resTypeArr: [
        { id: 1, name: "材料" },
        { id: 2, name: "辅料" },
        { id: 3, name: "其他" }
      ],
      fileList:[],
      fileUploadPath: this.GLOBAL.doUploadOssFile,
      setHead: this.GLOBAL.setHead(),
      showDialog:false,
      loading:false,
      }
  },
  mounted(){
    this.showDialog = this.changeDialogFile;
    this.fileList = this.transFile;
    console.log(JSON.stringify(this.transFile))
  },
  methods:{
      // 保存资料信息
    dialogMarksure() {
      this.showDialog = false;
      this.$emit('marksure',this.fileList);
       
    },
    closeDialogFun() {
    //   this.showDialog = false;
    //   showDialog = false
      this.$emit('closeFile');
       
    },
    deleteRow(index){
      this.fileList.splice(index,1)
    },    
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        // this.addData.head_icon = res.data;
        // this.head_icon = URL.createObjectURL(file.raw);
        // this.$refs.uploadFile.clearValidate();
        this.loading = false;
        var selType = this.resData.type;
        var getType = this.resTypeArr;
        // 展示资料辅料其他        
        var getData = res.data;
        getData.type = selType;
        getData.typeName = '';
        for(var i =0;i<getType.length;i++){
          if(selType == getType[i]['id']){
            getData.typeName = getType[i]['name'];
          }
        }
        this.fileList.push(getData);
      } else {
        alert(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      // return testPostImage(file);
      console.log(file.type)
      var FileExt = file.name.replace(/.+\./, "");       
      if (['pptx','ppt','txt','pdf','doc','docx','xls','xlsx'].indexOf(FileExt.toLowerCase()) === -1){            
        this.$message({ 
            type: 'warning', 
            message: '请上传后缀名为txt、pdf、ppt、pptx、doc、docx、xls或xlsx的附件！' 
         });                
        return false;       
      } 
      this.loading = true; 
      // const isPic = file.type === "image/gif" || 'xls' || 'xlsx' || 'txt' || 'video/mp4';
      // // const isLt2M = file.size / 1024 /1024 < 3;
      // if (!isPic) {
      //   alert('上传图片必须是JPG/PNG/GIF/JPEG 格式!')    
      // }
      // // if (!isLt2M) {    
      // //   alert('上传图片大小不能超过 3MB!');    
      // // }
      // console.log(isPic)
      // return isPic;
      // return isPic && isLt2M;
        // return testPostImage(file);
    },
  },
}

</script>
<style scoped lang="less">

</style>