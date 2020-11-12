import ldUpload from "./toolComponent/ld-upload.vue"
import elTitle from "../../component/el-title";
import draggable from "vuedraggable";
import {
    deepClone
} from "@/utils/Foundation"
export default {
    props: ["blockData"],
    data() {
        return {
            optionData: {}
        }
    },
    components: {
        elTitle,
        ldUpload,
        draggable,
    },
    methods: {
        //保存配置
        saveOption() {
            this.$emit("setBlockData", this.optionData);
        },
    },
    beforeMount() {
        if (this.blockData) {
            this.optionData = deepClone(this.blockData)
        }
    },
    mounted() {},
}