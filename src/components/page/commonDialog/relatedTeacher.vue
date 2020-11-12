<template>
  <!-- liveResourceClassAdmin 关联老师-->
  <el-dialog
    title="关联讲师/教务"
    :close-on-click-modal="false"
    :visible.sync="showRealDialog"
    width="80%"
    @close="closeRelateTea"
  >
    <div class="dialogTeac" v-loading="loading">
      <div class="teahead">
        <div class="teacText">讲师</div>
        <i class="el-icon el-icon-plus" @click="addTeacher">添加讲师</i>
      </div>
      <div class="teaCont">
        <div
          class="listItem"
          v-for="(item, index) in jiangshi"
          :key="index"
          @click="clickTeacher(item, index)"
          :class="{ itemActive: checkTeacherindex == item.teacher_id }"
        >
          {{ item.real_name }}
        </div>
      </div>
      <div class="teahead">
        <div class="teacText">教务</div>
        <i class="el-icon el-icon-plus" @click="tianjiajiaowu">添加教务</i>
      </div>
      <div class="teaCont">
        <div
          class="listItem"
          v-for="(item, index) in jiaowu"
          :key="index"
          @click="clickEducator(item, index)"
          :class="{ itemActive: item.checked }"
        >
          {{ item.real_name }}
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeRelateTea">取 消</el-button>
      <el-button type="primary" @click="dialogMarksure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import _request from "@/utils/request";
export default {
  props: {
    relateTea: {
      type: Boolean,
      default: false,
    },
    transData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      showRealDialog: false,
      jiangshi: [],
      jiaowu: [],
      dynamicTags: [],
      loading: false,
      teacher_id: this.transData.teacher_id,
      senate_id: this.transData.senate_id,
      checkTeacherindex: Number,
    };
  },
  created() {
    this.selTeacher();
  },
  mounted() {
    this.showRealDialog = this.relateTea;
  },
  methods: {
    tianjiajiaowu() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalEducation": "/#/users/educatAdmin";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },
    addTeacher() {
      let isZongKong = this.$store.state.school_status == 1; //总控1 中控0
      let hrefStr = isZongKong ? "/#/resourceGeneral/generalLecturers": "/#/users/lecturers";
      let href = window.location.origin + hrefStr;
      window.open(href, "_blank");
    },

    selTeacher() {
      this.loading = true;
      _request.http(this, "teacher/getTeacherSearchList").then((res) => {
        this.jiangshi = res.data.jiangshi;
        var jiaowuArr = res.data.jiaowu;
        this.jiaowu = jiaowuArr;
        this.loading = false;
        this.checkTeacherindex = this.transData.teacher_id;

        for (var i = 0; i < jiaowuArr.length; i++) {
          this.$set(this.jiaowu[i], "checked", false);
        }
        if (this.senate_id.length) {
          for (var i = 0; i < jiaowuArr.length; i++) {
            for (var j = 0; j < this.senate_id.length; j++) {
              if (jiaowuArr[i]["teacher_id"] == this.senate_id[j]) {
                this.$set(this.jiaowu[i], "checked", true);
              }
            }
          }
        }
      });
    },
    // 选中讲师
    clickTeacher(item, index) {
      this.teacher_id = item.teacher_id;
      this.checkTeacherindex = item.teacher_id;
    },
    clickEducator(item, index) {
      if (item.checked == true) {
        this.$set(this.jiaowu[index], "checked", false);
        for (let i = 0; i < this.dynamicTags.length; i++) {
          if (this.dynamicTags[i]["teacher_id"] == item.teacher_id) {
            this.dynamicTags.splice(i, 1);
          }
        }
      } else {
        this.$set(this.jiaowu[index], "checked", true);
        this.dynamicTags.push(item);
      }
    },
    dialogMarksure() {
      var senateArr = [];
      var selSenateArr = this.jiaowu;
      for (var i = 0; i < selSenateArr.length; i++) {
        if (selSenateArr[i]["checked"]) {
          senateArr.push(selSenateArr[i]["teacher_id"]);
        }
      }
      console.log(this.teacher_id);
      if (this.teacher_id) {
        this.$emit("markSureDialog", this.teacher_id, senateArr);
        // _request
        //   .http(this, "teacherLiveChild", {
        //     class_id: this.transData.id,
        //     teacher_id: this.teacher_id,
        //     senate_id: senateArr
        //   })
        //   .then(res => {
        //     if (res.code == 200) {
        //       this.showDialog = false;
        //       this.$emit("markSureDialog", 1);
        //     }
        //   });
      } else {
        this.$toast("请选择讲师");
      }
    },
    closeRelateTea() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style lang="less" scoped>
.dialogTeac {
  .teahead {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;
    .teacText {
      height: 16px;
      line-height: 16px;
      padding-left: 5px;
      border-left: 4px solid rgba(38, 164, 253, 1);
    }
    .el-icon-plus {
      color: #0094fe;
      cursor: pointer;
    }
  }
  .teaCont {
    .listItem {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 26px;
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(227, 227, 227, 1);
      border-radius: 3px;
      margin: 0 20px 20px 0;
      cursor: pointer;
    }
    .itemActive {
      background: rgba(38, 164, 253, 1);
      border-radius: 3px;
      color: #fff;
      border: 1px solid rgba(38, 164, 253, 1);
    }
  }
}
</style>