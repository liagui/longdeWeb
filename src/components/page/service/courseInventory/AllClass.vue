<template>
  <div class="box-content">
    <div class="top">
      <span></span>
      <span v-for="(item, index) in itemXue" :key="index">{{ item.name }}</span>
    </div>

    <div class="contents" v-for="(item, index) in itemXues" :key="index">
      <!-- <img src="item.cover" alt="" /> -->
      <img :src="item.cover" alt="" />
      <span>{{ item.title }}</span>
      <span>{{ item.parent_name }}</span>
      <span>{{ item.child_name }}</span>
      <span>￥{{ item.price }}</span>
      <div>
        <button @click="buttonClick('de', item.id, index)">-</button>
        <input type="text" v-model="item.number" />
        <button @click="buttonClick('in', item.id, index)">+</button>
      </div>
      <span>￥{{ item.number * item.price }}</span>
      <span style="color: red" @click="del(item.id)">x</span>
    </div>

    <div class="footer">
      <div class="nums">
        <span>继续选课</span>
        <span>|</span>
        <span
          >共<a>{{ totals }}</a
          >件选课，已选择<a>{{ totals }}</a
          >件</span
        >
      </div>
      <div class="he">
        <span
          >合计：<a>￥{{ totalPrice }}</a></span
        >
        <el-button type="danger" @click="toPrice">去结算</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import _request from "@/utils/request";
export default {
  name: "",
  data() {
    return {
      itemXue: [
        { name: "课程" },
        { name: "学科" },
        { name: "小类" },
        { name: "单价" },
        { name: "库存" },
        { name: "小计" },
        { name: "操作" },
      ],
      itemXues: [
       
      ],
      item: {
        schoolid: window.localStorage.getItem("school_id"),
        gid: 1,
        operate: "in",
      },
      totals: 1,
    };
  },
  components: {},
  computed: {
    totalPrice: function () {
      var total = 0;
      for (var i = 0; i < this.itemXues.length; i++) {
        var item = this.itemXues[i];
        total += item.number * item.price;
      }
      return total.toString().replace(/\B(?=(\d{3})+$)/g, ",");
    },
  },
  beforeMount() {},
  mounted() {
    this.shopList();
  },
  methods: {
    shopList() {
      _request.http(this, "service/stock/shopCart", this.item).then((res) => {
        console.log(res);
        // this.itemXues = res.data.list;
        this.totals = res.data.total;
      });
    },
    // 点击加减按钮控制数量
    buttonClick(str, id, index) {
      console.log(str, id);
      this.item.gid = id;
      this.item.operate = str;
      if (str == "de") {
        if (this.itemXues[index].number <= 0) {
          return;
        } else {
          this.itemXues[index].number--;
        }
      } else if (str == "in") {
        this.itemXues[index].number++;
      }
      _request
        .http(this, "service/stock/shopCartManageOperate", this.item)
        .then((res) => {
          if (res.code == 200) {
            console.log(res.data.list);
          }
        });
    },
    // 删除一条数据
    del(i) {
      _request
        .http(this, "service/stock/shopCartManageDel", this.item, { gid: i })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.itemXues.splice(i, 1);
          }
        });
    },
    toPrice() {
      _request
        .http(this, "service/stock/shopCartPay", this.item)
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.itemXues = [];
          }
        });
    },
  },
  watch: {},
};
</script>
<style scoped lang="less">
.box-content {
  // width: 95%;
  margin: 0 auto;
  border-radius: 5px;
  min-height: 650px;
  margin-left: 30px;
  background: #ffffff;
  box-shadow: 2px 2px 2px 2px #f0f0f0;
  padding: 0 25px 25px 25px;
  position: relative;
  .top {
    width: 100%;
    height: 80px;
    line-height: 80px;
    display: flex;
    justify-content: space-around;
    span {
      width: 16%;
      text-align: center;
    }
  }
  .contents {
    width: 99%;
    height: 120px;
    margin: 20px auto;

    box-shadow: 2px 2px 2px 2px #f0f0f0;
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      width: 16%;
      text-align: center;
    }
    img {
      width: 16%;
    }
    div {
      width: 16%;
      text-align: center;
      button {
        width: 20px;
        line-height: 20px;
        border: none;
      }
      input {
        border: 1px solid #f0f0f0;
        width: 60px;
        height: 21px;
        text-align: center;
      }
    }
  }
}
.footer {
  width: 96%;
  padding: 0 20px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  font-size: 15px;
  box-shadow: 2px 2px 2px 2px #f0f0f0;
  div {
    width: 30%;
    display: flex;
    line-height: 30px;
    align-items: center;
    justify-content: space-around;
    a {
      color: chocolate;
      font-size: 18px;
    }
  }
  .nums {
    color: #ccc;
  }
}
</style>
