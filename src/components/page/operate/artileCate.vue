<template>
  <div class="cashAudit">
    <div class="container-box">
      <div class="content-head">
        <span>分类管理</span>
        <div></div>
        <el-form :model="order" ref="order" :inline="true">
          <el-select v-model="order.school_id" clearable placeholder="选择网校" @change="initData">
            <el-option
              v-for="(item, index) in schoolArr"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
          <el-form-item style="margin-left:20px;">
            <el-button type="primary" @click="addCate">+ 添加分类</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-cont">
        <el-table
          :data="cashAuditData"
          stripe
          border
          cell-class-name="center"
          header-cell-class-name="center"
        >
          <el-table-column prop="id" label="ID" title="id" width="80"></el-table-column>
          <el-table-column prop="typename" label="分类名称" title="分类名称"></el-table-column>
          <el-table-column prop="name" label="所属网校" title="所属网校"></el-table-column>
          <el-table-column prop="username" label="创建人" title="创建人"></el-table-column>
          <el-table-column prop="phoneNo" label="状态" title="状态">
            <template slot-scope="scope">
              <el-switch
                :width="55"
                v-model="scope.row.status"
                @change="changeStatus(scope.row.id)"
                active-color="#00cc00"
                :active-value="1"
                :inactive-value="2"
                active-text="启用"
                inactive-text="禁用"
                inactive-color="#ddd"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="errorDesc" label="操作" title="操作" width="160">
            <template slot-scope="scope">
              <el-button type="delete" @click="delType(scope.row.id)">删除</el-button>
              <el-button type="primary" @click="upType(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          v-if="paginationShow"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100]"
          :page-size="cur.pageSize"
          :total="totalCount"
          :current-page="nextPage"
          layout="total, sizes, prev, pager, next, jumper,slot"
        >
          <el-button class="pagingBtn" size="small">确认</el-button>
        </el-pagination>
      </div>
      <!--      展示弹框-->
      <el-dialog title="修改分类" :close-on-click-modal="false" label-width="90px" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="updateRule" ref="updateForm">
          <el-form-item label="id" style="display:none;">
            <el-input v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属网校">
            <el-input v-model="form.schoolname" autocomplete="off" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="form.typename" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" rows="4" v-model="form.description" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="upTypename">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加弹框-->
      <el-dialog :title="addform.id?'修改分类':'添加分类'" :close-on-click-modal="false" :visible.sync="adddialogFormVisible">
        <el-form :model="addform" label-width="90px" ref="addDataForm" :rules="addDataRule">
          <el-form-item label="选择网校：" prop="school_id" @change="addschool">
            <el-select v-model="addform.school_id" :disabled="is_disable" placeholder="请选择网校">
              <el-option
                v-for="(item, index) in schoolArr"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称：" prop="typename">
            <el-input v-model="addform.typename" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <el-input type="textarea" rows="4" v-model="addform.description" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="clear-btn" @click="adddialogFormVisible = false">取 消</el-button>
          <el-button class="sub-btn" type="primary" @click="submit">确 定</el-button>
           
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import _request from "@/utils/request";
import constants from "@/utils/constants";
import { formatDate, getDay, getEndDay, deisabledTime } from "@/utils";
import { checkCharacters, rightNumber } from "@/utils/rules";
export default {
  data() {
    return {
      //详情弹框
      dialogFormVisible: false,
      form: {
        id: "",
        typename: "",
        schoolname: "",
        description: ""
      },
      //添加弹框
      adddialogFormVisible: false,
      addform: {
        id: "",
        typename: "",
        school_id: "",
        description: ""
      },

      //条件
      order: {
        school_id: ""
      },
      //删除,或者禁用启用条件  传id
      delid: {
        id: ""
      },
      wherename: "0",
      cashAudit: {
        userNameOrPhoneNo: "",
        status: ""
      },
      //网校列表
      schoolArr: [],
      //数据
      cashAuditData: [],

      paginationShow: true,
      //分页
      cur: {
        page: 1,
        pageSize: 20
      },
      nextPage: 1,
      totalCount: 20,
      updateRule: {
        typename: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" }
        ]
      },
      addDataRule: {
        typename: [
          { required: true, message: "请输入课程单元介绍", trigger: "blur" }
        ]
      },
      is_disable: false
    };
  },
  mounted() {
    this.schoolData();
    this.initData();
  },
  methods: {
    addCate() {
      this.adddialogFormVisible = true;
      this.addform.id = "";
      this.is_disable = false;
      this.$refs.addDataForm && this.$refs.addDataForm.clearValidate();
      this.$refs.addDataForm && this.$refs.addDataForm.resetFields();
    },
    //单条展示
    upType(val) {
      //单条查询
      console.log(val);
      this.adddialogFormVisible = true;
      this.$refs.addDataForm && this.$refs.addDataForm.clearValidate();
      this.is_disable = true;
      _request.http(this, "article/OnelistType", { id: val }).then(res => {
        console.log(res);
        this.form.id = res.data.id;
        this.form.typename = res.data.typename;
        this.form.schoolname = res.data.name;
        this.form.description = res.data.description;
        var getData = res.data;
        this.addform = {
          id: getData.id,
          typename: getData.typename,
          school_id: getData.school_id,
          description: getData.description
        };
      });
    },
    schoolData() {
      _request.http(this, "schoolLists").then(res => {
        this.schoolArr = res.data; //分类
        this.addform.school_id = res.data[0]["value"] || "";
      });
    },
    initData() {
      _request
        .http(this, "article/getTypeList", this.order, this.cur)
        .then(res => {
          console.log(res);
          this.cashAuditData = res.data;
          this.totalCount = res.page.total; //总条数
          this.cur.pageSize = parseInt(res.page.pageSize); //每页条数
          this.cur.page = res.page.page; //
          this.nextPage = parseInt(res.page.page);
        });
    },
    select() {
      this.$refs.cashAudit.validate(valid => {
        if (valid) {
          this.paginationShow = false;
          this.cur.pageNumber = 1;
          this.$nextTick(() => {
            this.initData();
            this.paginationShow = true;
          });
        } else {
          return false;
        }
      });
    },
    //每页
    handleSizeChange(val) {
      this.cur.pageSize = val;
      this.initData();
    },
    //第几页
    handleCurrentChange(val) {
      this.cur.page = val;
      this.initData();
    },

    //删除
    delType(val) {
      //弹框处理
      console.log(val);
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.delid.id = val;
          _request
            .http(this, "article/exitDelForId", this.delid, this.cur)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              if (this.cur.page > 1) {
                this.cur.page =
                  Math.ceil(this.totalCount - 1) / this.cur.pagesize;
              }
              this.initData();
            });
        })
        .catch(() => {
          console.log(33333);
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //禁用/开启
    changeStatus(val) {
      this.delid.id = val;
      _request
        .http(this, "article/editStatusForId", this.delid, this.cur)
        .then(res => {});
    },

    //修改方法
    upTypename() {
      console.log(this.form);
      this.$refs.addDataForm.validate(valid => {
        if (valid) {
          _request
            .http(this, "article/exitTypeForId", this.form, this.cur)
            .then(res => {
              console.log(res);
              this.initData();
              this.$toast("修改成功。");
              this.dialogFormVisible = false;
              this.initData();
            });
        }
      });
    },
    //网校默认值
    addschool(val) {
      if (val == "" || val < 1) {
        this.$toast("请选择网校");
      }
      console.log(val);
      this.addform.school_id = val;
    },
    //进行请求添加
    submit() {
      this.$refs.addDataForm.validate(valid => {
        if (valid) {
          if (this.addform.id) {
            // 修改
            _request
              .http(this, "article/exitTypeForId", this.addform)
              .then(res => {
                if (res.code == 200) {
                  this.initData();
                  this.adddialogFormVisible = false;
                } else {
                  this.$message({
                    type: "danger",
                    message: res.msg
                  });
                }
              });
          } else {
            _request.http(this, "article/addType", this.addform).then(res => {
              if (res.code == 200) {
                this.initData();
                this.adddialogFormVisible = false;
              } else {
                this.$message({
                  type: "danger",
                  message: res.msg
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ebebeb;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
  height: 45px;
  line-height: 45px;
  padding: 0 16px 0 24px;
  box-sizing: border-box;
  .pin {
    cursor: pointer;
    color: #444444;
  }
}
.text-color {
  color: black;
}
.btn {
  display: inline-block;
}
.btn:last-child {
  margin-right: 10px;
}
.input-width-150 {
  width: 96px;
}
</style>
