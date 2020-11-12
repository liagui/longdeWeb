<template>
  <div class="child-container">
    <div class="nav-item">
      <div class="nav-tlt">
        <i class="el-icon-s-fold childHandle"></i>
        <div>{{ data.name }}</div>
      </div>
      <div class="nav-path">
        {{ data.url }}
      </div>
      <div class="nav-state">
        {{ data.type | type }}
      </div>
      <div class="nav-operation">
        <i class="el-icon-edit-outline" @click="showEdit"></i>
        <i class="el-icon-delete" @click="del"></i>
      </div>
    </div>
    <div class="edit-block" v-if="show">
      <div class="block-name">
        <div class="edit-item">
          <div class="label">显示名称：</div>
          <el-input placeholder="显示名称" v-model="blockData.name"></el-input>
        </div>
        <div class="edit-item" style="margin-left: 50px">
          <div class="label">链接类型：</div>
          <el-radio v-model="blockData.type" label="1">自定义链接</el-radio>
          <el-radio v-model="blockData.type" label="2">默认链接</el-radio>
          <el-radio v-model="blockData.type" label="3">无链接</el-radio>
        </div>
      </div>
      <template v-if="blockData.type == 1">
        <div class="edit-item">
          <div class="label">链接地址：</div>
          <el-input
            placeholder="链接地址"
            v-model="blockData.url"
            :disabled="data.name == '首页'"
          >
            <template slot="append">
              <i class="el-icon-more" @click="openUrlShow"></i>
            </template>
          </el-input>
        </div>
        <div class="edit-item">
          <div class="label">链接类型：</div>
          <el-radio v-model="blockData.blank" label="1">本页打开</el-radio>
          <el-radio v-model="blockData.blank" label="2">弹出新窗口</el-radio>
        </div>
      </template>
      <template v-if="blockData.type == 2">
        <quillEditorCom
          class="el-card"
          @tranCont="getContent"
          :transIntroduction="contentModal"
        ></quillEditorCom>
      </template>
      <div class="buttons">
        <el-button type="normal" size="middle" @click="handleCancle"
          >关闭</el-button
        >
        <el-button type="primary" size="middle" @click="handleSave"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 自定义链接 -->
    <url-pop
      :show="urlShow"
      @changeUrl="changeUrl"
      @close="urlShow = false"
    ></url-pop>
  </div>
</template>

<script>
import quillEditorCom from "@/components/page/ueditorCom/comEditor";
import urlPop from "./urlPop";
import * as API_schoolSet from "@/api/schoolSet";
export default {
  name: "childEdit",
  props: ["data", "index"],
  components: {
    quillEditorCom,
    urlPop,
  },
  data() {
    return {
      show: false,
      urlShow: false,
      blockData: {
        name: "",
        url: "",
        blank: "1",
        rickText: "",
      },
    };
  },

  computed: {
    contentModal() {
      return this.blockData.rickText;
    },
  },
  filters: {
    type(val) {
      switch (val) {
        case "1":
          return "自定义链接";
        case "2":
          return "默认链接";
        case "3":
          return "无链接";
      }
    },
  },
  methods: {
    //自定义链接
    openUrlShow() {
      this.urlShow = true;
    },
    changeUrl(id) {
      console.log(id);
      this.urlShow = false;
      this.blockData.url = id;
    },
    //富文本
    getContent(val) {
      this.blockData.rickText = val;
    },
    showEdit() {
      console.log(this.data);
      this.blockData = JSON.parse(JSON.stringify(this.data));
      this.show = !this.show;
    },
    edit() {},
    del() {
      this.$emit("itemDelete", this.index);
    },
    //richText
    addRichTextUrl() {
      let _params = {
        page_type: 2,
        parent_id: 0,
        name: this.blockData.name,
        url: "",
        sign: "",
        link_type: 2,
        is_new_open: 0,
        sort: 0,
        text: this.blockData.rickText,
      };
      API_schoolSet.customPageAdd(_params).then((res) => {
        this.blockData.url = "/custom/" + res.url;
      });
    },
    handleCancle() {
      this.show = false;
    },
    async handleSave() {
      if (this.blockData.type == 2) {
        await this.addRichTextUrl();
      }
      console.log(this.blockData);
      this.$emit("itemChange", {
        index: this.index,
        item: this.blockData,
      });
      this.show = false;
      this.$toast("保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.child-container {
  width: 100%;
  background: #f3f3f3;
}
.nav-item {
  width: 100%;
  height: 50px;
  margin-top: 5px;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  color: #888888;
  line-height: 50px;
  div {
    text-align: center;
  }
}
.nav-icon {
  width: 16px;
  height: 16px;
  line-height: 16px;
  float: left;
}
.nav-icon img {
  width: 16px;
  height: 16px;
}
.nav-tlt {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    position: absolute;
    left: 30px;
  }
}
.nav-path {
  flex: 2;
}
.nav-state {
  flex: 1;
}

.nav-operation {
  cursor: pointer;
  flex: 1;
  i {
    display: inline-block;
    margin: 0 5px;
  }
}
.edit-block {
  box-sizing: border-box;
  border-top: solid 1px lightgray;
  padding: 30px 30px 80px 30px;
  width: 100%;
  .edit-item {
    display: flex;
    font-size: 14px;
    height: 50px;
    align-items: center;
    .el-input {
      width: 250px;
    }
    .el-radio {
      margin-top: 9px;
    }
  }
  .buttons {
    float: right;
  }
}
.block-name {
  display: flex;
}
.el-card {
  margin: 20px auto;
}
</style>