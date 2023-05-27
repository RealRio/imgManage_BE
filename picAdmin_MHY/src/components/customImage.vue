<template>
    <div class="cus-image">
        <el-image style="width: 100%; height: 100%" :src="src" :preview-src-list="previewSrcList" preview-teleported
            @click="cusPreviewImage" z-index="2000">
        </el-image>
        <span v-show="cusIcon" @click="pass(id)">
            <img  class="el-image-viewer__btn el-image-viewer__plus"  :src="'/pass.svg'"/>
        </span>
        <span  v-show="cusIcon" @click="refuse(id)">
            <img class="el-image-viewer__btn el-image-viewer__minus"  :src="'/refuse.svg'"/>
        </span>
    </div>
</template>
<script>
export default {
    name: "cusImage",
    data() {
        return {
            cusIcon: false,
            wrapperElem: null,
        };
    },
    props: {
        src: {
            type: String,
            default: "",
        },
        id: {
            type: Number,
            default: 0,
        },
        previewSrcList: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    methods: {
        cusPreviewImage() {
            this.cusIcon = true;
            this.checkElemlents();
        },
        checkElemlents() {
            this.$nextTick(() => {
                let wrapper = document.getElementsByClassName(
                    "el-image-viewer__wrapper"
                );
                if (wrapper.length > 0) {
                    this.wrapperElem = wrapper[0];
                    this.cusClickHandler();
                } else {
                    this.checkElemlents();
                }
            });
        },
        cusClickHandler() {
            let hideButton = document.getElementsByClassName("el-image-viewer__btn el-image-viewer__close");
            console.log(hideButton)
            hideButton[0].addEventListener("click", this.hideCusBtn);
        },
        hideCusBtn() {
            console.log(this.cusIcon)
            this.cusIcon = false;
            console.log(this.cusIcon)
        },
        pass(id) {
            console.log(id)
            axios.post('/api/passImage', { id }).then((res) => {
                console.log(res);
                axios.post('/api/getImages', {
                    lastIndex: 0,
                }).then((res) => {
                    originData.value = res.data;
                    imgCount.value = res.data?.length;
                })
            }).catch((err) => {
                console.log(err);
            })
        },
        refuse(id) {
            axios.post('/api/refuseImage', { id }).then((res) => {
                console.log(res);
                axios.post('/api/getImages', {
                    lastIndex: 0,
                }).then((res) => {
                    originData.value = res.data;
                    imgCount.value = res.data?.length;
                })
            }).catch((err) => {
                console.log(err);
            })
        }
    },
};
</script>
<style scoped>

.el-image-viewer__plus {
    top: 40px;
    right: 155px;
    width: 40px;
    height: 40px;
    font-size: 120px;
    fill: red;
    background-color: #606266;
    z-index: 2001;
    /* 如果该组件需要传递 z-index 的值，这个值也需要做成动态的 props */
    cursor: pointer;
    position: fixed;
}

.el-image-viewer__minus {
    top: 40px;
    right: 100px;
    width: 40px;
    height: 40px;
    font-size: 40px;
    position: fixed;
    /* 如果该组件需要传递 z-index 的值，这个值也需要做成动态的 props */
    cursor: pointer;
    fill: #fff;
    background-color: #606266;
}
</style>
  