<template>
  <div class="item-container">
    <div class="nav-item">
      <div class="nav-tlt">
        <i class="el-icon-s-fold handle"></i>
        <div>{{ data.name }}</div>
      </div>
      <div class="nav-path">
        {{ data.url }}
      </div>
      <div class="nav-state" v-if="head">
        <el-switch
          v-model="data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </div>
      <div class="nav-state" v-else-if="model == 1">默认</div>
      <div class="nav-state" v-else>{{ data.type | type }}</div>
      <!-- 操作 -->
      <div class="nav-operation">
        <template v-if="head">
          <i class="el-icon-edit-outline" @click="showEdit"></i>
          <i class="el-icon-delete" @click="del" v-if="data.editAble"></i>
          <i
            class="el-icon-edit-outline"
            @click="showEdit"
            v-if="data.editAble"
          ></i>
        </template>
        <template v-else>
          <i class="el-icon-edit-outline" @click="showEdit"></i>
          <i class="el-icon-delete" @click="del"></i>
          <template v-if="model == 1">
            <i class="el-icon-plus" @click="add"></i>
            <i
              :class="[showChild ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
              @click="showchildren"
            ></i>
          </template>
        </template>
      </div>
    </div>
    <!-- child-block -->
    <div class="child-block" v-if="showChild">
      <draggable
        class="draggable-right"
        v-bind="draggOption"
        :list="blockData.children"
        handle=".childHandle"
      >
        <child-edit
          v-for="(item, key) in blockData.children"
          :key="key"
          :data="item"
          :index="key"
          @itemChange="setChild"
          @itemDelete="delChild"
        ></child-edit
      ></draggable>
    </div>
    <!-- edit-block -->
    <div class="edit-block" v-if="show">
      <div class="block-name">
        <div class="edit-item">
          <div class="label">显示名称：</div>
          <el-input placeholder="显示名称" v-model="blockData.name"></el-input>
        </div>
        <template v-if="blockData.qrcode">
          <div class="edit-item">
            <div class="label">主标题：</div>
            <el-input
              placeholder="主标题"
              v-model="blockData.mainTitle"
            ></el-input>
          </div>
          <div class="edit-item">
            <div class="label">副标题：</div>
            <el-input
              placeholder="副标题"
              v-model="blockData.subTitle"
            ></el-input>
          </div>
        </template>
      </div>
      <template v-if="model != 1 || data.editAble">
        <div class="edit-item">
          <div class="label">链接类型：</div>
          <el-radio v-model="blockData.type" label="1">自定义链接</el-radio>
          <el-radio v-model="blockData.type" label="2">默认链接</el-radio>
          <el-radio v-model="blockData.type" label="3" v-if="!head"
            >无链接</el-radio
          >
        </div>
        <template v-if="blockData.type == 1">
          <div class="edit-item">
            <div class="label">链接地址：</div>
            <el-input placeholder="链接地址" v-model="blockData.url">
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
import childEdit from "./childEdit";
import urlPop from "./urlPop";
import quillEditorCom from "@/components/page/ueditorCom/comEditor";
import draggable from "vuedraggable";
import { deepClone } from "@/utils/Foundation";
import * as API_schoolSet from "@/api/schoolSet";
export default {
  name: "dataEdit",
  props: ["data", "index", "model", "head"],
  components: {
    childEdit,
    quillEditorCom,
    draggable,
    urlPop,
  },
  data() {
    return {
      show: false,
      showChild: false,
      blockData: {
        name: "",
        url: "",
        type: "3",
        blank: "1",
        rickText: "",
        children: [],
      },
      //自定义链接
      urlShow: false,
    };
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
  computed: {
    contentModal() {
      return this.blockData.rickText;
    },
    // drag
    draggOption() {
      return {
        animation: 0,
        group: "people",
      };
    },
  },
  mounted() {
    if (this.data) {
      this.blockData = deepClone(this.data);
    }
  },
  methods: {
    //自定义链接
    openUrlShow() {
      this.urlShow = true;
    },
    changeUrl(id) {
      this.urlShow = false;
      this.blockData.url = id;
    },
    //富文本
    getContent(val) {
      this.blockData.rickText = val;
    },
    async setChild(childData) {
      const { index, item } = childData;
      this.$set(this.blockData.children, index, item);
      this.handleSave();
    },
    showchildren() {
      this.blockData = deepClone(this.data);
      this.show = false;
      this.showChild = !this.showChild;
    },
    delChild(index) {
      this.blockData.children.splice(index, 1);
    },
    showEdit() {
      this.showChild = false;
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
    add() {
      this.showChild = true;
      this.blockData.children.push({
        name: "新建模块",
        url: "",
        type: "3",
        blank: "1",
      });
    },
    handleCancle() {
      this.show = false;
    },
    async handleSave() {
      if (this.blockData.type == 2) {
        await this.addRichTextUrl();
      }
      this.$emit("itemChange", {
        index: this.index,
        item: this.blockData,
      });
      console.log(this.blockData);
      this.show = false;
      this.$toast("保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.item-container {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 9px 1px rgba(0, 26, 44, 0.1);
  border-radius: 4px;
}
.nav-item {
  width: 100%;
  height: 50px;
  margin-top: 25px;
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
    left: 10px;
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
    .label {
      width: 90px;
      text-align: right;
    }
    .el-input {
      width: 350px;
    }
    .el-radio {
      margin-top: 9px;
    }
  }
  .buttons {
    margin-top: 20px;
    float: right;
  }
}
//edit-block
.block-name {
  // display: flex;
}
</style>