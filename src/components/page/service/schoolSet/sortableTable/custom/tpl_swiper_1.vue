 <template>
  <div class="tpl tpl-swiper">
    <tpl-title
      v-if="blockData && blockData.optionName"
      :title="blockData.optionName"
    ></tpl-title>
    <div v-if="blockData && blockData.swiperData">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide
          v-for="(item, key) in blockData.swiperData"
          :key="key"
          v-show="item.imgStatus"
        >
          <img :src="item.imgUrl" alt="" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="empty" v-else>请上传图片</div>
  </div>
</template>
 <script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
import mixin from "./customComponent/mixin";

export default {
  name: "tpl_swiper_1",
  mixins: [mixin],
  data() {
    return {
      swiperOptions: {},
    };
  },
  props: ["blockData"],
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>
 
 <style lang="less" scoped>
.swiper-slide {
  width: 100% !important;
  height: 100%;
  background-color: gray;
}
img {
  display: block;
  width: 100%;
  height: 550px;
}
.empty {
  width: 100%;
  height: 300px;
  line-height: 300px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
 
