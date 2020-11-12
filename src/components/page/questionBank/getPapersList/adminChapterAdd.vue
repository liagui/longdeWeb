<template>
  <div class="edit-info">
    <el-dialog
      :visible="showModal"
      :close-on-click-modal="false"
      class="edit-dialog"
      :title="editForm.subject_name +titleName+'试卷'"
      width="773px"
      :append-to-body="true"
      @close="close()"
    >
      <el-form
        ref="editForm"
        class="edit-form"
        :model="editForm"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="试卷名称：" prop="papers_name">
          <el-input v-model="editForm.papers_name"></el-input>
        </el-form-item>
        <el-form-item label="试卷类型" prop="diffculty">
          <el-radio-group v-model="editForm.diffculty">
            <el-radio :label="1">真题</el-radio>
            <el-radio :label="2">模拟题</el-radio>
            <el-radio :label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="答题时间（分）" prop="papers_time">
          <el-input-number
            v-model="editForm.papers_time"
            controls-position="right"
            :min="10"
            :max="180"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="editForm.area" placeholder="请选择所属区域">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item,index) in regionList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传封面：" prop="cover_img">
          <el-upload
            class="avatar-uploader"
            :action="fileUploadPath"
            :show-file-list="false"
            :headers="setHead"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="试卷描述：" prop="content">
          <el-input
            v-model="editForm.content"
            type="textarea"
            resize="none"
            size="medium"
            :autosize="{ minRows: 4, maxRows: 20 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择题类型" prop="type">
          <el-checkbox-group v-model="editForm.type">
            <el-checkbox
              v-for="(item,index) in questionTypeList"
              :key="index"
              :label="item.status"
              :value="item.status"
            >{{item.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="clear-btn" @click="close()">取 消</el-button>
        <el-button type="primary" class="sub-btn" @click="submitForm('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

import _request from "@/utils/request";
import { checkCharacters, rightNumber, checkDns } from "@/utils/rules";
export default {
  computed: {
    ...mapState({
      authority: state => state.question.authority,
      bank_id: state => state.question.bank_id
    }),
    showModal() {
      return this.show;
    }
  },
  props: ["show", "searchData", "editData"],
  data() {
    var checktime = (rule, value, callback) => {
      setTimeout(() => {
        if (value <= 0) {
          callback(new Error('请大于0'));
        } else if (value > 180) {
          callback(new Error('请小于180'));
        } else {
          callback();
        }
      });
    };
    return {
      titleName: "添加",
      isEdit: false,
      routerQuery: this.$route.query,
      regionList: [], //地域列表
      fileUploadPath: this.GLOBAL.postImgUrl,
      setHead: this.GLOBAL.setHead(),
      editForm: {
        papers_name: "",
        diffculty: "",
        papers_time: "10",
        area: "",
        cover_img: "",
        content: "",
        type: [],
        bank_id: this.bank_id,
        subject_name: this.searchData.subject_name,
        subject_id: this.searchData.subject_id
      },
      questionTypeList: this.$store.state.question.questionTypeList,
      imageUrl: "",
      rules: {
        papers_name: [{ required: true, message: "不能为空", trigger: "blur" }],
        diffculty: [{ required: true, message: "不能为空", trigger: "blur" }],
        papers_time: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: rightNumber, message: "请输入整数", trigger: "blur" },
          { validator: checktime, trigger: "blur"},
        ],
        cover_img: [{ required: true, message: "不能为空", trigger: "blur" }],
        content: [{ required: true, message: "不能为空", trigger: "blur" }],
        type: [{ required: true, message: "不能为空", trigger: "blur" }],
        area: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    "searchData.subject_name"(val) {
      this.editForm.subject_name = val;
    },
    "searchData.subject_id"(val) {
      this.editForm.subject_id = val;
    },
    editData: {
      handler(n, o) {
        if (n && n.papers_name) {
          this.editForm = Object.assign(this.editForm, n);
          this.editForm.papers_id = this.$store.state.question.papers_id;
          this.editForm.type = this.editForm.type.split(",");
          this.imageUrl = this.editForm.cover_img;
          this.isEdit = true;
          this.titleName = "  编辑";
          console.log(this.editForm);
        } else {
          this.resetParam();
          this.isEdit = false;
          this.titleName = "  添加";
        }
      },
      immediate: true //刷新加载 立马触发一次handler
      // deep: true
    }
  },
  created() {
    this.getRegionList();
    // _request
    //   .http(this, 'school/getSchoolUpdate', {
    //     school_id: this.schoolSelf.schoolId,
    //   })
    //   .then((res) => {
    //     console.log('获取的网校信息', res.data)
    //     this.editForm = res.data
    //     this.imageUrl = res.data.logo_url
    //   })
  },
  methods: {
    resetParam() {
      this.editForm = {
        papers_name: "",
        diffculty: "",
        papers_time: "",
        area: "",
        cover_img: "",
        content: "",
        type: [],
        bank_id: this.bank_id,
        subject_name: this.searchData.subject_name,
        subject_id: this.searchData.subject_id
      };
      this.imageUrl = "";
    },
    close() {
      this.$emit("close");
    },
    //上传图片 之后的钩子方法
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.$set(this.editForm, "logo_url", res.data);
        this.editForm.cover_img = res.data;
      } else {
      }
    },
    //上传之前的钩子方法
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt5M) {
      //   this.$message.error('上传头像图片大小不能超过 5MB!')
      // }
      // return isJPG && isLt5M
      return true;
    },
    submitForm(editForm) {
      if (!this.authority) {
        alert("授权的相关内容，没有操作权限，请联系服务商");
        return;
      }
      this.$refs[editForm].validate(valid => {
        if (valid) {
          console.log(this.editForm);
          let param = Object.assign({}, this.editForm);
          param.type = param.type.join(",");
          let url = this.isEdit
            ? "question/doUpdatePapers"
            : "question/doInsertPapers";
          _request.http(this, url, param).then(res => {
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: "保存成功",
                type: "success"
              });
              this.$emit("refresh");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getRegionList() {
      _request.http(this, "question/getRegionList", {}).then(res => {
        if (res.code == 200) {
          this.regionList = res.data;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;

  .cut {
    margin-right: 10px;
    width: 4px;
    height: 15px;
    background: #26a4fd;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.edit-form {
  border-bottom: solid 1px #eaeaea;
}
</style>
