<template>
  <div class="content-boxs">
    <div class="contents">
      <span><i>|</i>网站统计分析代码部署</span>
      <el-switch
        v-model="isOpen"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-text="isOpen ? '开启' : '关闭'"
      >
      </el-switch>
    </div>

    <div class="nav" v-show="isOpen">
      <div class="top">
        <img
          src="../../../../assets/image/service/daimatuoguan2 (1)@2x.png"
          alt=""
        />
        <span>统计分析代码：</span>
        <el-select v-model="values" placeholder="谷歌分析">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a>{{ msg || "src=" }}</a>
        <el-input v-model="input" />
        <el-button type="primary" @click="upplugin">保存</el-button>
        <el-button type="info" v-if="input">取消</el-button>
      </div>
      <p class="zhu">注：请将如图所示标注部分输入编辑框中</p>
      <div class="top">
        <img src="../../../../assets/image/service/daima (1)@2x.png" alt="" />
        <span>代码预览：</span>
        <div class="lookMa">
          <!-- cnzz -->
          <div
            class="code-show sh4 chosed"
            style="display: block"
            v-if="indexId == 4"
          >
            &lt;script type="text/javascript"&gt;<br />var cnzz_protocol =
            (("https:" == document.location.protocol) ? " https://" : "
            http://");<br />
            document.write(unescape("%3Cspan id='cnzz_stat_icon_<span
              class="input-show"
              >{{ input }}</span
            >'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol +
            "s11.cnzz.com/z_stat.php%3Fid%3D<span class="input-show">{{
              input
            }}</span
            >' type='text/javascript'%3E%3C/script%3E"));<br />&lt;/script&gt;
          </div>
          <!-- 腾讯 -->
          <div
            v-if="indexId == 3"
            class="code-show sh3 chosed"
            style="display: block"
          >
            &lt;script type="text/javascript"
            src="http://tajs.qq.com/stats?sId=<span class="input-show">{{
              input
            }}</span
            >" charset="UTF-8"&gt;&lt;/script&gt;
          </div>
          <!--  -->
          <!--百度  -->
          <div
            class="code-show sh2 chosed"
            style="display: block"
            v-if="indexId == 1"
          >
            &lt;script&gt;<br />var _hmt = _hmt || [];<br />(function()
            <br />var hm = document.createElement("script");<br />hm.src =
            "//hm.baidu.com/hm.js?<br /><span class="input-show">{{
              input
            }}</span
            >";<br />var s = document.getElementsByTagName("script")[0];<br />s.parentNode.insertBefore(hm,
            s);<br />})();<br />&lt;/script&gt;
          </div>
          <!--  -->
          <!-- 谷歌 -->
          <div
            class="code-show sh1 chosed"
            style="display: block"
            v-if="indexId == 2"
          >
            &lt;script&gt;<br />
            (function(i, s, o, g, r, a, m) {<br />
            i['GoogleAnalyticsObject'] = r;<br />
            i[r] = i[r] ||<br />
            function() { (i[r].q = i[r].q || []).push(arguments)<br />
            }, i[r].l = 1 * new Date();<br />
            a = s.createElement(o),<br />
            m = s.getElementsByTagName(o)[0];<br />
            a.async = 1;<br />
            a.src = g;<br />
            m.parentNode.insertBefore(a, m)<br />
            })(window, document, 'script',
            '//www.google-analytics.com/analytics.js', 'ga');<br />
            ga('create', 'UA-<span class="input-show">{{ input }}</span
            >', 'auto');<br />
            ga('send', 'pageview');<br />&lt;/script&gt;
          </div>
          <!--  -->
        </div>
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
      isOpen: true,
      options: [
                {
          id: 1,
          value: "baidu",
          label: "百度统计",
        },
        {
          id: 2,
          value: "guge",
          label: "谷歌分析",
        },

        {
          id: 3,
          value: "tengx",
          label: "腾讯分析",
        },
        {
          id: 4,
          value: "cnzz",
          label: "cnzz",
        },
      ],
      scriptItem: "",
      values: "",
      input: "",
      textarea: "",
      msg: "",
      indexId: 1,
      isOpenInit :false,
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {
    this.initData(true);
  },
  methods: {
    upplugin(){
      // plugin/upplugin  修改  ”传 key内容“   ”ontype  1统计2客服“  “type 1百度2谷歌3腾讯4cnzz
      this.isOpenInit = false;
      let param = {
        ontype:1,
        type:this.indexId,
        key:this.input
      }
      _request.http(this, "plugin/upplugin", param).then((res) => {
        if(res.code == 200){
          this.initData();
        }
      });
    },
    opendown(){
      //plugin/opendown 开启关闭   “传 ontype  1统计2客服
      this.isOpenInit = false;
      let param = {
        ontype:1
      }
      _request.http(this, "plugin/opendown", param).then((res) => {
       this.isOpenInit = true;
      });
    },
    initData(isFirst) {
      // plugin/pluginlist 列表   “传 ontype  1统计2客服”  “type 1百度2谷歌3腾讯4cnzz”
      let param = {
        ontype:1
      }
      _request.http(this, "plugin/pluginlist", param).then((res) => {
        if(res.code == 200){
          this.isOpen = res.data.open==1;
          this.tjInfo = res.data;

          //首次加载
          if(isFirst){
            this.values ='baidu';
            this.input = this.tjInfo.baidu;
            this.indexId = 1;
            setTimeout(()=>{
              this.isOpenInit = true;
            })
          }


        }
      });
    },
  },
  watch: {
    isOpen(newValue, oldValue){
      if(this.isOpenInit){
        this.opendown();
      }
    },
    values(newValue, oldValue) {
      if (newValue == "baidu") {
        this.indexId = 1;
        this.msg = "hm.src=";
        this.input = this.tjInfo.baidu;
      } else if (newValue == "guge") {
        this.indexId = 2;
        this.msg = "UA-";
        this.input = this.tjInfo.guge;
      } else if (newValue == "tengx") {
        this.indexId = 3;
        this.msg = "sld=";
        this.input = this.tjInfo.tengx;
      } else if (newValue == "cnzz") {
        this.indexId = 4;
        this.msg = "id=";
        this.input = this.tjInfo.cnzz;
      }
    },
  },
};
</script>
<style scoped lang="less">
.lookMa {
  // width: 500px;
  // height: 300px;
  border: 2px solid #f0f0f0;
  margin-left: 30px;
  padding: 10px;
  div {
    line-height: 30px;
    font-size: 14px;
  }
}
.content-boxs {
  width: 95%;
  background: #fff;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 3px 5px 5px 3px #f0f0f0;

  .contents {
    width: 95%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 60px;

    i {
      width: 4px;
      height: 20px;
      background: rgb(18, 161, 228);
      margin-right: 10px;
    }
  }
  .nav {
    width: 95%;
    margin: 0 auto;
    padding: 15px;
    border: 1px solid #f0f0f0;
    margin-bottom: 15px solid #fff;
    .top {
      width: 100%;
      display: flex;
      // align-items: center;
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
      }
    }
    input[type="textarea"] {
      width: 500px;
      height: 300px;
      margin: 0 35px;
      border: 1px solid #ccc;
      outline: none;
    }
  }
  .zhu {
    width: 90%;
    line-height: 45px;
    text-align: center;
    color: #ccc;
    font-size: 14px;
  }
}
.el-input {
  width: 400px;
  margin: 0 10px;
}
.el-button {
  width: 100px;
}
</style>
