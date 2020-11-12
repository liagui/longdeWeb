<template>
  <div>
    
      <div class="list-box" v-for="(item,index) in orderList" :key="index">
        <img :src="item.course_cover" class="course-cover" alt="pic" />
        <div class="course-center">
          <el-row class="rowStyle">
            <el-col :span="12">
              商品名称：
              <span class="center-data">{{item.course_title}}</span>
            </el-col>
            <el-col :span="12">
              订单编号：
              <span class="center-data">{{item.order_number}}</span>
            </el-col>
          </el-row>
          <el-row class="rowStyle">
            <el-col :span="12">
              商品价格：
              <span class="center-data">{{item.lession_price}}</span>
            </el-col>
            <el-col :span="12">
              实付价格：
              <span class="center-data">{{item.price}}</span>
            </el-col>
          </el-row>
          <el-row class="rowStyle">
            <el-col :span="12">
              支付时间：
              <span class="center-data">{{item.pay_time}}</span>
            </el-col>
            <el-col :span="12">
              付款方式：
              <span class="center-data">{{item.pay_name}}</span>
            </el-col>
          </el-row>
        </div>
        <div style="position:relative;" class="text-r">
          <el-button
            v-if="item.status == '2' && (item.pay_status == 3 || item.pay_status == 4)"
            @click="changeClass(item.order_number,item.school_id)"
            type="primary"
            size="mini"
            plain
            round
          >转班</el-button>
          <el-button @click="getJinDu(item)" type="primary" size="mini" plain round>学习进度</el-button>
          <div class="statusbox" :style="{color: item.bgcolor}">{{item.learning}}</div>
        </div>
      </div>
      <div class="noData" v-if="noData">暂无数据</div>
  
    <!-- 学习进度 -->
    <Modal
      width="660px"
      :show="showModal"
      :clickModal="true"
      :title="jinduTitle"
      @close="marksureFun"
    >
      <div style="height:100%;overflow:auto">
        <el-table
          stripe
          border
          row-key="id"
          :data="dataList"
          highlight-current-row
          ref="custTable"
          width="100%"
          cell-class-name="center"
          header-cell-class-name="center"
          :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
        >
          <el-table-column label="课次名称" prop="name"></el-table-column>
          <el-table-column label="学习时长" prop="mt_duration"></el-table-column>
          <el-table-column label="学习进度" prop="use_duration"></el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="handleSizeChange"
          :page-sizes="[5,10,20,50,100]"
          :page-size="pagesize"
          :total="total"
          :current-page="currentPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
    </Modal>

  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import Modal from "@/components/business/Modal";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
export default {
  data() {
    return {
      jinduClass_id: "",
      jinduTitle: "",
      pagesize: 10,
      currentPage: 1,
      total: 0,
      dataList: [{}],
      showModal: false, //学习进度
      student_id: "",
      addData: {
        head_icon: "",
        schoolName: "",
        phone: "",
        real_name: "",
        sex: 1,
        papers_type: "",
        papers_num: "",
        birthday: "",
        address_locus: "",
        age: "",
        educational: "",
        family_phone: "",
        office_phone: "",
        contact_people: "",
        contact_phone: "",
        email: "",
        qq: "",
        wechat: "",
        address: "",
        remark: ""
      },
      orderList: [],
      noData: false
    };
  },
  components: { Modal },
  mounted() {
    this.getDetail();
    this.orderForStudent();
  },
  methods: {
    initData() {
      _request
        .http(
          this,
          "student/getStudentStudyList",
          {
            phone: this.addData.phone,
            course_id: this.jinduClass_id
          },
          { page: this.currentPage, pagesize: this.pagesize }
        )
        .then(res => {
          if (res.code == 200) {
            let data = res.data;
            this.showModal = true;
            this.dataList = data.chapters;
            this.total = data.count;
          }
        });
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pagesize = val;
      this.initData();
    },
    currentChange(current) {
      this.currentPage = current;
      this.initData();
    },
    marksureFun() {
      this.showModal = false;
    },
    getJinDu(item) {
      this.jinduTitle = item.course_title;
      this.jinduClass_id = item.class_id;
      this.initData();
    },
    changeClass(order_number, school_id) {
      this.$router.push({
        path: "/users/students/changeClass",
        query: {
          order_number: order_number,
          schoolId: school_id
        }
      });
    },
    orderForStudent() {
      _request
        .http(this, "orderForStudent", {
          student_id: this.$route.query.archiveId
        })
        .then(res => {
          if (res.code == 200) {
            if (res.data.length) {
              this.orderList = res.data;
              this.noData = false;
            } else {
              this.noData = true;
            }
          }
        });
    },
    getDetail() {
      _request
        .http(this, "student/getStudentInfoById", {
          student_id: this.$route.query.archiveId
        })
        .then(res => {
          if (res.code == 200) {
            this.addData = res.data;
          }
        });
    }
  },
  watch: {
    student_id(val) {
      console.log(val);
      this.getDetail();
    }
  }
};
</script>

<style scoped lang="less">
.archive {
  margin: 0 25px;
}
.archive-head {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
  padding: 30px 10px 20px;

  .head-box {
    display: flex;
  }
  .head_icon {
    width: 128px;
    height: 128px;
    vertical-align: top;
    margin-right: 10px;
  }
  .head-mess {
    flex: 1;
    font-size: 14px;
    color: #666;

    .el-col {
      margin-bottom: 20px;
    }
  }
  .text-333 {
    color: #333;
  }
  .head-right {
    font-size: 14px;
    color: #666;
    margin-bottom: 38px;
  }
}
.item-img {
  vertical-align: top;
  margin-right: 2px;
}
.right-img {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 5px;
}
.archive-content {
  padding-top: 20px;

  .content-order {
    font-size: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #24a3fc;
    color: #24a3fc;
    margin: 20px 10px;
  }
  .list-box {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    display: flex;
    padding: 23px 16px 8px;

    .course-cover {
      width: 260px;
      height: 140px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .course-center {
      flex: 1;
      padding-top: 10px;
      font-size: 14px;
      color: #666666;
    }
    .rowStyle {
      margin-bottom: 20px;
      .center-data {
        color: #333;
      }
    }
    .statusbox {
      margin-top: 63px;
      text-align: right;
      font-size: 14px;
    }
    .changeClass {
      position: absolute;
      right: 0;
      width: 42px;
      text-align: center;
      color: #fff;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      border: 0;
      background: #fda426;
      border-radius: 15px;
      cursor: pointer;
    }
  }
}
</style>