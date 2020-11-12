<template>
  <div class="tpl tpl-teacher">
    <!-- 我们的团队 -->
    <div class="container-fluid fff">
      <el-row>
        <el-col :span="24">
          <div class="teacher-wrap">
            <div class="container">
              <div class="teacher-header">
                <div class="teacher-name">
                  <span style="position: relative; right: 16px">{{
                    teacher.real_name
                  }}</span>
                </div>
                <img
                  :src="teacher.teacher_icon || teacher.head_icon"
                  class="image"
                />
              </div>
              <div class="teacher-info">
                <p>{{ teacher.describe }}</p>
                <el-rate
                  class="star-num"
                  v-model="teacher.star_num"
                  disabled
                  text-color="#ff9900"
                  score-template="{teacher.star_num}"
                ></el-rate>
                <span class="star-num-span">{{ teacher.star_num }}.0</span>
                <ul class="teacher-samll-header">
                  <li>
                    <img
                      src="../../../../../../assets/image/school/schoolset/teacherleft.png"
                      alt
                      class="fuhao"
                    />
                  </li>
                  <li
                    v-for="(item, index) in teacherList"
                    :key="index"
                    @click="selectTeacher(index)"
                    :class="{ actvie: selectindex == index }"
                  >
                    <p class="zhezhao"></p>
                    <img :src="item.head_icon" alt class="small-header" />
                  </li>
                  <li>
                    <img
                      src="../../../../../../assets/image/school/schoolset/tearchright.png"
                      alt
                      class="fuhao"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

import * as API_schoolSet from "@/api/schoolSet";
import mixin from "./customComponent/mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      selectindex: "",
      teacher: {},
      teacherList: [
        {
          id: 1,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159904821043565f4f8a1213c74.jpg",
          real_name: "\u590f\u8001\u5e08",
          describe:
            "\u89e3\u653e\u519b301\u533b\u9662\u5065\u5eb7\u7ba1\u7406\u7814\u7a76\u9662\u4e3b\u68c0\u533b\u5e08\u3001\u516c\u5171\u8425\u517b\u5e08\u3001\u591a\u5bb6\u5065\u5eb7\u7ba1\u7406\u5e08\u3001\u8425\u517b\u5e08\u57f9\u8bad\u673a\u6784\u9ad8\u7ea7\u8bb2\u5e08\uff0c\u300a\u4fdd\u5065\u65f6\u62a5\u300b\u7b49\u591a\u5bb6\u62a5\u520a\u3001\u6742\u5fd7\u64b0\u7a3f\u4eba",
          number: 8,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159904821710235f4f8a194263e.png",
          checked: true,
          student_number: 34,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 2,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159905001135615f4f911b2bd28.jpg",
          real_name: "\u5f20\u59d7",
          describe:
            "\u4ece\u4e8b\u8425\u517b\u884c\u4e1a11\u5e74\uff0c\u539f\u5317\u4eac\u745e\u4eac\u7cd6\u5c3f\u75c5\u533b\u9662\u8425\u517b\u79d1-\u8425\u517b\u5e08\uff0c\u539f\u5317\u4eac\u4e30\u53f0\u5e7f\u6d4e\u533b\u9662\u300a\u7279\u9700\u95e8\u8bca\u300b\u4e3b\u4efb\uff0c\u5317\u63a7\u5065\u5eb7\u5065\u5eb7\u7ba1\u7406\u4e8b\u4e1a\u90e8-\u603b\u76d1\uff0c\u5317\u4eac\u662d\u5149\u5927\u4f17\u5065\u5eb7\u7814\u7a76\u6240\u9879\u76ee\u90e8-\u4e3b\u4efb",
          number: 8,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159905001817765f4f912237f20.png",
          checked: true,
          student_number: 34,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 3,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159905219182065f4f999f31f52.jpg",
          real_name: "\u9a6c\u8001\u5e08",
          describe:
            "\u9996\u6279\u4e00\u7ea7\u6ce8\u518c\u6d88\u9632\u5de5\u7a0b\u5e08\u3001\u9ad8\u7ea7\u6d88\u9632\u8bbe\u65bd\u64cd\u4f5c\u5458\u3001\u5de5\u7a0b\u5e08\u804c\u79f0\uff1b\u66fe\u5c31\u804c\u4e8e\u53cc\u7532\u7ea7\u8bbe\u8ba1\u9662\uff0c\u540e\u4ece\u4e8b\u6d88\u9632\u8bbe\u65bd\u68c0\u6d4b\u7ef4\u62a4\u4fdd\u517b\u5de5\u4f5c\uff0c\u53c2\u52a0\u8fc7\u591a\u9879\u5927\u4e2d\u578b\u5de5\u7a0b\u7684\u68c0\u6d4b\u7ef4\u4fdd\u5de5\u4f5c\uff0c\u73b0\u573a\u7ecf\u9a8c\u4e30\u5bcc\uff0c\u80fd\u5c06\u7406\u8bba\u4e0e\u5b9e\u9645\u76f8\u7ed3\u5408\uff0c\u4fbf\u4e8e\u5b66\u5458\u7406\u89e3\u3002",
          number: 1,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-09-02/159905220298755f4f99aa7c9e7.png",
          checked: true,
          student_number: 8,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 4,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514647263485f1400e8f3620.jpg",
          real_name: "\u4f55\u8001\u5e08",
          describe:
            "\u4f55\u8001\u5e08\uff0c\u7279\u8058\u8bb2\u5e08\uff08\u5168\u804c\u8bb2\u5e08\uff09\uff0c\u4e2d\u897f\u533b\u4e16\u5bb6\uff0c\u5065\u5eb7\u7ba1\u7406\u5e08\u9ad8\u7ea7\u8bb2\u5e08\uff0c\u4e94\u5e74\u57f9\u8bad\u8bb2\u5e08\u7ecf\u9a8c\uff0c\u957f\u671f\u57f9\u8bad\u6df1\u8c19\u8003\u8bd5\u91cd\u70b9\u3001\u96be\u70b9\u4e0e\u6613\u9519\u70b9\uff0c\u80fd\u5f88\u597d\u5e26\u9886\u5b66\u5458\u8de8\u8fc7\u4e00\u4e2a\u4e2a\u8003\u9898\u6df1\u5751\uff0c\u4fa7\u91cd\u7406\u8bba\u4e0e\u5b9e\u8df5\u76f8\u7ed3\u5408\uff0c\u5584\u7528\u7cfb\u7edf\u903b\u8f91\u5e76\u901a\u8fc7\u7b80\u6613\u751f\u52a8\u8bed\u8a00\u5c06\u8003\u70b9\u8fdb\u884c\u5f52\u7eb3\u603b\u7ed3\uff0c\u540c\u65f6\u5c06\u91cd\u70b9\u4e0e\u8003\u9898\u76f8\u4e32\u8054\uff0c\u6240\u7528\u65b9\u6cd5\u7686\u4ee5\u5b66\u5458\u80fd\u591f\u771f\u6b63\u7406\u89e3\u4e0e\u7262\u8bb0\u4e3a\u51c6\u5219\uff0c\u6240\u5e26\u73ed\u6b21\u901a\u8fc7\u7387\u8f83\u9ad8\u3002",
          number: 10,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514311066595f13f3c66dbba.png",
          checked: true,
          student_number: 48,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 5,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-06-17/159238096099575ee9ce20f3119.jpg",
          real_name: "\u82cf\u6587\u5e73",
          describe:
            "\u9ad8\u7ea7\u5de5\u7a0b\u5e08\u3001\u4e00\u7ea7\u6ce8\u518c\u6d88\u9632\u5de5\u7a0b\u5e08\u3001\u4e00\u7ea7\u6ce8\u518c\u5efa\u9020\u5e08\u3001\u6ce8\u518c\u9020\u4ef7\u5de5\u7a0b\u5e08\u3002\u4ece\u4e8b\u6d88\u9632\u5de5\u7a0b\u5e08\u57f9\u8bad\u591a\u5e74\uff0c\u5c31\u804c\u4e8e\u67d0\u5927\u578b\u6d88\u9632\u5de5\u7a0b\u516c\u53f8\uff0c\u8d1f\u8d23\u6d88\u9632\u5de5\u7a0b\u7684\u65bd\u5de5\u7ba1\u7406\u548c\u6280\u672f\u652f\u6301\u3001\u6d88\u9632\u5de5\u7a0b\u9020\u4ef7\u53ca\u62db\u6295\u6807\u3001\u4f01\u4e1a\u6d88\u9632\u6280\u672f\u57f9\u8bad\u7b49\uff1b\u66fe\u4efb\u591a\u9879\u56fd\u5bb6\u7ea7\u91cd\u70b9\u6d88\u9632\u5de5\u7a0b\u7684\u9879\u76ee\u7ecf\u7406\uff0c\u8d1f\u8d23\u65bd\u5de5\u7ba1\u7406\u3001\u5de5\u7a0b\u9a8c\u6536\u3001\u5de5\u7a0b\u9884\u51b3\u7b97\u7b49\u5de5\u4f5c\u3002",
          number: 0,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514309591455f13f3b7ea750.png",
          checked: true,
          student_number: 0,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 6,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-06-17/159238087662115ee9cdcc5491c.jpg",
          real_name: "\u4e09\u8f66",
          describe:
            "\u54c8\u5c14\u6ee8\u5de5\u4e1a\u5927\u5b66\u7855\u58eb\uff0c\u67d0\u9ad8\u6821\u526f\u6559\u6388\uff0c\u5efa\u7b51\u5de5\u7a0b\u4e13\u4e1a\u3002\u5728\u5168\u56fd\u591a\u5bb6\u673a\u6784\u4e3b\u8bb2\u6d88\u9632\u9762\u6388\u548c\u7f51\u7edc\u8bfe\u7a0b\uff0c\u591a\u5e74\u6267\u4e1a\u8d44\u683c\u8003\u8bd5\u7814\u7a76\u53ca\u57f9\u8bad\u7ecf\u9a8c\uff0c\u5584\u4e8e\u603b\u7ed3\u3001\u80fd\u51c6\u786e\u628a\u63e1\u8003\u70b9\u3002\u5bf9\u6d88\u9632\u77e5\u8bc6\u6846\u67b6\u6709\u6df1\u523b\u7684\u7406\u89e3\uff0c\u6761\u7406\u6e05\u6670\u3002\u5c06\u6559\u6750\u548c\u89c4\u8303\u603b\u7ed3\u68b3\u7406\uff0c\u4e09\u5408\u4e00\u878d\u6c47\u8d2f\u901a\u3001\u5e76\u8f85\u4ee5\u539f\u521b\u53e3\u8bc0\uff0c\u6388\u8bfe\u65b9\u5f0f\u6df1\u5165\u6d45\u51fa\uff0c\u53d7\u5230\u5b66\u5458\u53ca\u673a\u6784\u7684\u597d\u8bc4\u3002",
          number: 0,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514308262965f13f3aa3b9ca.png",
          checked: true,
          student_number: 0,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 8,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-06-17/159238055937755ee9cc8fbce2b.jpg",
          real_name: "\u9ad8\u6c38\u5fd7",
          describe:
            "\u9ad8\u7ea7\u5de5\u7a0b\u5e08\u3001\u4e00\u7ea7\u6ce8\u518c\u6d88\u9632\u5de5\u7a0b\u5e08\u3001\u4e00\u7ea7\u5efa\u9020\u5e08\uff08\u5e02\u653f\u3001\u6c34\u5229\u3001\u516c\u8def\u4e13\u4e1a\uff09\uff1b\u6709\u5341\u4e94\u5e74\uff08\u56fd\u5185\u5916\uff09\u65bd\u5de5\u7ecf\u9a8c\uff0c\u66fe\u4ece\u4e8b\u9ad8\u94c1\uff0c\u5e02\u653f\uff0c\u6c34\u5229\u5de5\u7a0b\u65bd\u5de5\uff0c\u62c5\u4efb\u5341\u5e74\u9879\u76ee\u7ecf\u7406\u3002\u76ee\u524d\u4e13\u6ce8\u4e8e\u4e00\u7ea7\u5efa\u9020\u5e08\u3001\u4e8c\u7ea7\u5efa\u9020\u5e08\u57f9\u8bad\uff0c\u6d88\u9632\u5de5\u7a0b\u5e08\u57f9\u8bad\uff0c\u56fd\u5bb6\u6ce8\u518c\u5ba1\u6838\u5458\u57f9\u8bad\uff0c\u4f01\u4e1a\u7ba1\u7406\u57f9\u8bad\u7b49\u3002\u7406\u8bba\u8054\u7cfb\u5b9e\u9645\uff0c\u6df1\u5165\u6d45\u51fa\uff0c\u65b9\u6cd5\u72ec\u7279\u3002",
          number: 0,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514275858705f13f2669f8fc.png",
          checked: true,
          student_number: 0,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
        {
          id: 9,
          head_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-06-17/159238016821505ee9cb08b3245.jpg",
          real_name: "\u9648\u5b89\u5b81",
          describe:
            "\u54c8\u5c14\u6ee8\u5de5\u4e1a\u5927\u5b66\u7855\u58eb\uff0c\u67d0\u9ad8\u6821\u526f\u6559\u6388\uff0c\u5efa\u7b51\u5de5\u7a0b\u4e13\u4e1a\u3002\u5728\u5168\u56fd\u591a\u5bb6\u673a\u6784\u4e3b\u8bb2\u6d88\u9632\u9762\u6388\u548c\u7f51\u7edc\u8bfe\u7a0b\uff0c\u591a\u5e74\u6267\u4e1a\u8d44\u683c\u8003\u8bd5\u7814\u7a76\u53ca\u57f9\u8bad\u7ecf\u9a8c\uff0c\u5584\u4e8e\u603b\u7ed3\u3001\u80fd\u51c6\u786e\u628a\u63e1\u8003\u70b9\u3002\u5bf9\u6d88\u9632\u77e5\u8bc6\u6846\u67b6\u6709\u6df1\u523b\u7684\u7406\u89e3\uff0c\u6761\u7406\u6e05\u6670\u3002\u5c06\u6559\u6750\u548c\u89c4\u8303\u603b\u7ed3\u68b3\u7406\uff0c\u4e09\u5408\u4e00\u878d\u6c47\u8d2f\u901a\u3001\u5e76\u8f85\u4ee5\u539f\u521b\u53e3\u8bc0\uff0c\u6388\u8bfe\u65b9\u5f0f\u6df1\u5165\u6d45\u51fa\uff0c\u53d7\u5230\u5b66\u5458\u53ca\u673a\u6784\u7684\u597d\u8bc4\u3002",
          number: 0,
          teacher_icon:
            "https://longdeapi.oss-cn-beijing.aliyuncs.com/upload/2020-07-19/159514273525605f13f24f9c1e3.png",
          checked: true,
          student_number: 0,
          star_num: 5,
          grade: "5.0",
          is_nature: 0,
        },
      ],
    };
  },
  mounted() {
    API_schoolSet.getTeacherList({
      top_num: 8,
    }).then((res) => {
      this.teacher = res[0]
      this.teacherList = res;
    });
  },
  methods: {
    selectTeacher(index) {
      this.teacher = this.teacherList[index];
      this.selectindex = index;
    },
  },
};
</script>

<style lang="less" scoped>
/* 我们的团队 */
.teacher-wrap {
  margin-top: 80px;
  width: 100%;
  background-color: gray;
  background: url("../../../../../../assets/image/school/schoolset/teacherbg.png")
    center/cover no-repeat;
  background-size: 100% 100%;
  .teacher-header {
    width: 506px;
    display: inline-block;
    position: relative;
    margin-right: 30px;
    text-align: center;
    .teacher-name {
      position: absolute;
      right: 0;
      width: 60px;
      height: 108px;
      text-align: center;
      -webkit-writing-mode: vertical-rl;
      writing-mode: vertical-rl;
      color: #75bef3;
      letter-spacing: 4px;
      font-size: 20px;
      background-color: gray;
      background: url(../../../../../../assets/image/school/schoolset/teachername.png)
        center/cover no-repeat;
    }
  }
  img.image {
    // width: 80%;
    // height: 80%;
    display: inline-block;
    max-width: 506px;
    height: 506px;
    margin-top: -80px;
    vertical-align: bottom;
  }
  .teacher-info {
    width: 50%;
    display: inline-block;
    word-spacing: 8px;
    vertical-align: top;
    padding-top: 10px;
    p {
      max-height: 76px;
      line-height: 26px;
      color: #fff;
      font-size: 14px;
      overflow: hidden;
    }
    span {
      color: #fff;
    }
  }
}
.teacher-samll-header {
  position: absolute;
  bottom: 14px;
  display: inline-table;
  width: 392px;
  li {
    position: relative;
    float: left;
    width: 72px;
    height: 72px;
    margin-right: 6px;
    margin-top: 6px;
    .zhezhao {
      position: absolute;
      height: 100%;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(51, 51, 51, 0.7);
    }
    img.fuhao {
      width: 26px;
      height: 24px;
      margin-left: 12px;
    }
    img.small-header {
      max-width: 72px;
      max-height: 72px;
      cursor: pointer;
    }
  }
}
.teacher-samll-header li:hover .zhezhao,
.teacher-samll-header .actvie .zhezhao {
  display: none;
}
.star-num {
  padding-top: 10px;
  padding-bottom: 10px;
}
.star-num-span {
  margin-top: 10px;
  left: 2px;
  display: inline-block;
}
</style>