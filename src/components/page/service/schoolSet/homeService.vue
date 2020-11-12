 <template>
  <div class="page-sortable">
    <div class="tag-table">
      <h3>拖拽元素</h3>
      <el-collapse class="block" v-model="activeTab">
        <el-collapse-item
          v-for="(item, key) in tagTableLeft"
          :key="key"
          :title="item.name"
          :name="key"
        >
          <draggable
            class="draggable-left"
            v-bind="optionsLeft"
            :move="onMove"
            :list="item.children"
            @update="datadragEnd"
          >
            <transition-group tag="ul">
              <li
                v-for="child in item.children"
                :key="child.id"
                class="module-left"
                @click="addBlock(child)"
              >
                <p>{{ child.block_name }}</p>
              </li>
            </transition-group>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="sortable">
      <div class="draggable-module">
        <draggable
          class="draggable-right"
          v-bind="optionsRight"
          :list="tagTableRight"
          handle=".handle"
          :move="onMove"
        >
          <transition-group tag="ul" class="tagTableRight">
            <li
              class="tagTableLi"
              v-for="(item, index) in tagTableRight"
              :key="`${item.id}_${index}`"
            >
              <sortableTable
                :id="item.id"
                :blockOption="item"
                :index="index"
                @setBlockData="setBlockData"
                @removeCallback="removeCallback"
                @addCallback="addCallback"
                @openOption="openOption"
              />
              <div class="move-box">
                <el-button @click="handleMove(index, 'top')">置顶</el-button>
                <el-button @click="handleMove(index, 'up')">上移</el-button>
                <el-button @click="handleMove(index, 'down')">下移</el-button>
                <el-button @click="handleMove(index, 'bottom')">置底</el-button>
              </div>
            </li>
          </transition-group>
        </draggable>
        <!-- 添加元素 -->
        <div class="placeholder" v-if="tagTableRight.length == 0">
          <h1>添加元素</h1>
          <p>选中左侧元素，拖动到这里</p>
        </div>
      </div>
      <el-button type="success" size="large" class="setFloor" @click="setFloor">保存发布</el-button>
    </div>
    <!-- 图片上传 -->
    <upload-component
      :show="imgShow"
      :data="modelData"
      @close="imgShow = false"
      @upload="upload"
    >
    </upload-component>
  </div>
</template>
 
 <script>
import draggable from "vuedraggable";
import sortableTable from "./sortableTable/index.vue";
import uploadComponent from "./component/imageUpload";
import * as API_schoolSet from "@/api/schoolSet";
let idGlobal = 10;
export default {
  data() {
    return {
      tagTableLeft: [
        {
          name: "轮播展示",
          children: [
            {
              id: "tpl_swiper_1",
              block_name: "轮播模块",
              block_data: {},
              config_type: "swiperEdit",
            },
          ],
        },
        {
          name: "课程展示",
          children: [
            {
              block_name: "一图课程",
              id: "tpl_course_1",
              block_data: {},
              config_type: "imgEdit",
            },
            {
              block_name: "二图课程",
              id: "tpl_course_2",
              block_data: {},
              config_type: "imgEdit",
              config_model: 2,
            },
            {
              block_name: "四图课程",
              id: "tpl_course_4",
              block_data: {},
              config_type: "courseEdit",
              config_model: 4,
            },
            {
              block_name: "八图课程",
              id: "tpl_course_8",
              block_data: {},
              config_type: "courseEdit",
              config_model: 8,
            },
          ],
        },
        {
          name: "新闻展示",
          children: [
            {
              id: "tpl_news_1",
              block_name: "图文混排",
              block_data: {},
              config_type: "newsEdit",
            },
            {
              id: "tpl_news_2",
              block_name: "图片轮播",
              block_data: {},
              config_type: "newsEdit",
            },
            {
              id: "tpl_news_4",
              block_name: "四图新闻",
              block_data: {},
              config_type: "newsEdit",
            },
          ],
        },
        {
          name: "名师展示",
          children: [
            {
              id: "tpl_teacher_1",
              block_name: "五图展示",
              block_data: {},
              config_type: "teacherEdit",
            },
            {
              id: "tpl_teacher_2",
              block_name: "切换展示",
              block_data: {},
              config_type: "teacherEdit",
            },
          ],
        },
        {
          name: "视屏展示",
          children: [
            {
              id: "tpl_video_1",
              block_name: "全屏视频",
              block_data: {},
              config_type: "videoEdit",
            },
            {
              id: "tpl_video_2",
              block_name: "等比视频",
              block_data: {},
              config_type: "videoEdit",
              config_model: 2,
            },
          ],
        },
      ],
      tagTableRight: [],
      imgShow: false,
      currentIndex: "",
      modelData: [],
      activeTab: "",
    };
  },
  components: {
    draggable,
    sortableTable,
    uploadComponent,
  },
  computed: {
    optionsLeft() {
      return {
        animation: 150,
        group: {
          name: "people",
          pull: "clone",
          put: false,
        },
        ghostClass: "ghost",
        sort: false,
      };
    },
    optionsRight() {
      return {
        animation: 0,
        group: "people",
      };
    },
  },
  created() {
    API_schoolSet.getConfig().then((res) => {
      const { index_config } = res;
      this.tagTableRight = index_config ? JSON.parse(index_config) : [];
      console.log(this.tagTableRight);
    });
  },
  methods: {
    log: function (evt) {
      console.log(evt);
    },
    cloneDog(obj) {
      return {
        id: `${obj.id}`,
        name: `${obj.name}`,
        isShow: `${!obj.isShow}`,
      };
    },
    onMove(evt) {
      // console.log(evt);
      // console.log(evt.draggedContext.index)
      // console.log(evt.draggedContext.element)
      // console.log(evt.draggedContext.futureIndex)
      // console.log(evt.relatedContext.index)
      // console.log(evt.relatedContext.element)
      // console.log(evt.relatedContext.list)
      // console.log(evt.relatedContext.component)
    },
    datadragEnd(item) {
      console.log(item);
    },
    removeCallback(index) {
      this.tagTableRight.splice(index, 1);
    },
    addCallback(obj) {
      this.$set(this.tagTableRight, obj.index, {
        ...this.tagTableRight[obj.index],
        data: obj.data,
      });
    },
    //打开配置
    openOption(index) {
      this.imgShow = true;
      this.currentIndex = index;
      this.modelData = this.tagTableRight[index].blockData;
    },
    //接收图片
    upload(imageList) {
      let index = this.currentIndex;
      this.$set(this.tagTableRight, index, {
        ...this.tagTableRight[index],
        block_data: imageList,
      });
    },
    //移动楼层
    handleMove(index, direct) {
      let swapItems = function (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
      };
      let { tagTableRight } = this;
      if (direct == "top") {
        if (tagTableRight.length > 1 && index !== 0) {
          tagTableRight.unshift(tagTableRight[index]);
          tagTableRight.splice(index + 1, 1);
        }
      } else if (direct == "up") {
        if (tagTableRight.length > 1 && index !== 0) {
          tagTableRight = swapItems(tagTableRight, index, index - 1);
        }
      } else if (direct == "down") {
        if (tagTableRight.length > 1 && index !== tagTableRight.length - 1) {
          tagTableRight = swapItems(tagTableRight, index, index + 1);
        }
      } else if (direct == "bottom") {
        tagTableRight.push(tagTableRight[index]);
        tagTableRight.splice(index, 1);
      }
    },
    //保存数据
    addBlock(child) {
      this.tagTableRight.push(child);
    },
    setBlockData(data) {
      const { blockData, index } = data;
      this.$set(this.tagTableRight, index, {
        ...this.tagTableRight[index],
        block_data: blockData,
      });
      console.log(this.tagTableRight);
    },
    setFloor() {
      console.log(this.tagTableRight);
      let _params = {
        cur_type: "index_config",
        cur_type_selected: 0,
        cur_content: JSON.stringify(this.tagTableRight),
      };
      API_schoolSet.setConfig(_params).then((res) => {
        this.$toast("保存成功");
      });
    },
  },
};
</script>
<style lang="less" scope>
ul {
  margin-bottom: 0;
}
.page-sortable {
  display: flex;
  justify-content: flex-end;
  width: calc(100%-60px);
  margin: 0px auto;
  position: relative;

  /deep/ .tag-table {
    // position: sticky;
    position: fixed;
    top: 205px;
    left: 220px;
    width: 172px;
    background-color: #fff;
    .el-collapse-item__header {
      padding-left: 15px;
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
    }
    h3 {
      margin-bottom: 0;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      text-align: center;
    }

    p {
      margin-bottom: 0;
      color: #999999;
      cursor: move;

      &:hover {
        background-color: #ccc;
      }
    }
    .block {
      width: 100%;
    }
    .block-title {
      padding-left: 30px;
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-top: solid lightgray 1px;
      border-bottom: solid lightgray 1px;
    }

    .module-left {
      position: relative;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    div[draggable="true"] {
      // .ghost{
      .echarts {
        display: block !important;
      }
    }
  }

  .sortable {
    width: calc(100% - 190px);
    background-color: #fff;
    box-shadow: 0px 3px 14px 1px rgba(0, 0, 0, 0.05);
    padding-bottom: 100px;
    .headline {
      text-align: center;
      margin-top: 20px;

      .ivu-input-wrapper {
        margin: 0 auto;
        display: block !important;

        input {
          text-align: center;
        }
      }

      p {
        font-size: 14px;
      }

      .large {
        input {
          height: 50px;
          line-height: 50px;
          color: #fc697a !important;
          font-size: 20px;
        }
      }

      .small {
        .ivu-input-wrapper {
          display: inline-block !important;
          width: 140px !important;
          margin-right: 10px;

          input {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
          }
        }
      }
    }

    .draggable-module {
      margin: 0 auto;
      position: relative;
      .draggable-right {
        border-radius: 4px;
        padding: 20px;
      }
    }

    .tagTableRight {
      width: 100%;
      min-height: 200px;

      .tagTableLi {
        min-height: 200px;
        margin-bottom: 20px;
        display: flex;
      }
      .custom-module {
        flex-shrink: 0;
      }
      .move-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
      }
    }
    .placeholder {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 0;
      text-align: center;
      width: calc(100% - 40px);
      height: 100%;
      padding: 120px 0;
      border: dashed 1px #dcdcdc;
      text-align: center;

      h1 {
        font-size: 20px;
      }

      p {
        padding-top: 20px;
      }
    }
  }
}
.move-box {
  .el-button {
    margin-bottom: 15px;
    margin-left: 30px;
  }
}

.setFloor {
  margin-left: 30px;
  margin-top: 30px;
  text-align: center;
  height: 50px;
  cursor: pointer;
}
</style>
 
