<template>
  <div>
    <el-card>
      <quill-editor
      class="editor"
        v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @focus="onEditorFocus($event)"
        @blur="onEditorBlur($event)"
        @change="onEditorChange($event)"
        @ready="onEditorReady($event)"
      >       
      </quill-editor>
    </el-card>
     
  </div>
</template>
<script>
import { Quill, quillEditor } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register('modules/ImageExtend', ImageExtend)
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
// import * as Quill from "quill";
import "../../../assets/css/font.css";

export default {
  props: ["transIntroduction"],
  data() {
    return {
      content:'',
      fileUploadPath: this.GLOBAL.postQuillImgUrl,
      editor: null, // 富文本编辑器对象
      editorOption: {
        modules: {
          ImageExtend: {
            // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入
            name: "file", // 图片参数名
            size: 3, // 可选参数 图片大小，单位为M，1M = 1024kb
            action: this.GLOBAL.postQuillImgUrl, // 服务器地址, 如果action为空，则采用base64插入图片
            // response 为一个函数用来获取服务器返回的具体图片地址
            // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
            // 则 return res.data.url
            response: res => {
              return res.data;
            },
            headers: xhr => {
              // 上传图片请求需要携带token的 在xhr.setRequestHeader中设置
              xhr.setRequestHeader(
               'Authorization', 'Bearer ' + this.$store.state.token
              );
            }, // 可选参数 设置请求头部
            sizeError: () => {
              alert('图片大小不能超过3MB。')
            }, // 图片超过大小的回调
            start: () => {}, // 可选参数 自定义开始上传触发事件
            end: () => {}, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => {}, // 可选参数 上传失败触发的事件
            success: () => {}, // 可选参数  上传成功触发的事件
            change: (xhr, formData) => {
              // xhr.setRequestHeader('myHeader','myValue')
              // formData.append('token', 'myToken')
            } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },

          toolbar: {
            // 如果不上传图片到服务器，此处不必配置
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction

              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],
              ["image"] //去除video即可
            ], // container为工具栏，此次引入了全部工具栏，也可自行配置
            handlers: {
              image: function(val) {
                // 劫持原来的图片点击按钮事件
                console.log(val)
                QuillWatch.emit(this.quill.id);
              }
            }
          }
        },
        theme: "snow",
        placeholder: "请输入正文"
      },
    };
  },
  mounted() {
    this.content = this.transIntroduction;
    this.editor = this.$refs.myQuillEditor.quill;    
  },
  components: {
    quillEditor
  },
  computed:{   
    
  },
  watch:{
    transIntroduction(val){
        this.content = val;
    },
   
  },
  methods: {
    // 准备富文本编辑器
    onEditorReady(e) {
          
    },
    // 富文本编辑器 失去焦点事件
    onEditorBlur(editor) {},
    // 富文本编辑器 获得焦点事件
    onEditorFocus(editor) {},
    // 富文本编辑器 内容改变事件
    onEditorChange(editor) {
      this.$emit('tranCont',this.content);
    },

  }
};
</script>
<style lang="less" scoped>

/deep/ .ql-container {
  min-height: 450px;
}
.ql-editor {
  height: 450px !important;
}
</style>