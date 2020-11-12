<template>
  <div class="pc-answer">
    <ul>
      <pcAnswerItem
        icon="bg-xuanze"
        text="已选"
        :answer="currentQuestion.my_answer"
        classAnswer="color-main"
      />
      <pcAnswerItem
        icon="bg-wenhuachengdu"
        text="难易程度"
        :answer="currentQuestion.exam_diffculty"
        v-show="isShow"
      />
      <pcAnswerItem
        icon="bg-daananswer"
        text="您的答案"
        :answer="currentQuestion.my_answer"
        classAnswer="color-error"
        v-show="isShow"
      />
      <pcAnswerItem
        icon="bg-daananswer"
        text="正确答案"
        :answer="currentQuestion.correct_answer"
        classAnswer="color-success"
        v-show="isShow"
      />
      <pcAnswerItem
        icon="bg-wenzi"
        text="文字解析"
        :answer="currentQuestion.text_analysis"
        v-show="isShow"
      />
    </ul>
  </div>
</template>

<script>
import pcAnswerItem from "./pcAnswerItem";
export default {
  props: ["currentQuestion", "type"], //type--为'answer'时，必须答完题才能显示答案
  components: {
    pcAnswerItem
  },
  computed: {
    isShow() {
      if (this.type == "answer") {
        if (this.currentQuestion.my_answer) {
          return true;
        } else {
          return false;
        }
      } else {
        return this.currentQuestion.showAnswer;
      }
    }
  }
};
</script>
